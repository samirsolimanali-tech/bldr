import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface SettlementAuditRecord {
  id: string;
  action: 'CREATE_BATCH' | 'APPROVE_BATCH' | 'POST_JOURNAL';
  batchRef: string;
  actorId: string;
  timestamp: string;
  details: Record<string, any>;
}

@Injectable()
export class PayoutsService {
  private readonly logger = new Logger(PayoutsService.name);
  private auditLog: SettlementAuditRecord[] = [];

  constructor(private prisma: PrismaService) {}

  async findForProvider(providerId: string, page = 1, perPage = 20) {
    const [payouts, total] = await Promise.all([
      this.prisma.payout.findMany({
        where: { providerId },
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payout.count({ where: { providerId } }),
    ]);
    return { data: payouts, meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) } };
  }

  async findAll(page = 1, perPage = 20) {
    const [payouts, total] = await Promise.all([
      this.prisma.payout.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: 'desc' },
        include: { provider: { select: { id: true, name: true, slug: true } } },
      }),
      this.prisma.payout.count(),
    ]);
    return { data: payouts, meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) } };
  }

  // ─── Dual-Control Settlement Batch Creation ──────────────────────────────────
  async createSettlementBatch(creatorId: string, data: { providerId: string; grossAmount: number; note?: string }) {
    const batchRef = `STL-${data.providerId.slice(0, 4).toUpperCase()}-${Date.now().toString().slice(-6)}`;

    // In a real execution, calculate net after gateway fees, take rate, and reserve
    const reserveHeld = Math.round(data.grossAmount * 0.05);
    const netAmount = data.grossAmount - reserveHeld;
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 3600 * 1000);

    const payout = await this.prisma.payout.create({
      data: {
        providerId: data.providerId,
        periodStart: weekAgo,
        periodEnd: now,
        grossAmount: data.grossAmount,
        commissionAmount: 0,
        netAmount,
        status: 'PENDING',
        note: JSON.stringify({
          batchRef,
          createdBy: creatorId,
          reserveHeld,
          userNote: data.note || '',
        }),
      },
    });

    const auditEntry: SettlementAuditRecord = {
      id: `aud_${Date.now()}`,
      action: 'CREATE_BATCH',
      batchRef,
      actorId: creatorId,
      timestamp: new Date().toISOString(),
      details: { payoutId: payout.id, grossAmount: data.grossAmount, netAmount },
    };
    this.auditLog.unshift(auditEntry);
    this.logger.log(`[Settlement Dual-Control] Batch ${batchRef} created by actor=${creatorId}`);

    return { payout, batchRef, status: 'PENDING_APPROVAL' };
  }

  // ─── Dual-Control Settlement Batch Approval & Journal Posting ────────────────
  async approveAndPostSettlementBatch(batchId: string, approverId: string) {
    const payout = await this.prisma.payout.findUnique({ where: { id: batchId } });
    if (!payout) throw new NotFoundException('Settlement batch not found.');

    let metadata: any = {};
    try {
      metadata = payout.note ? JSON.parse(payout.note) : {};
    } catch {
      metadata = {};
    }

    // Fail closed if batch creator information is missing
    if (!metadata || !metadata.createdBy) {
      this.logger.error(`[Dual-Control Violation] Batch ${batchId} is missing createdBy metadata. Fails closed.`);
      throw new ForbiddenException(
        'Dual control violation: Settlement batch metadata is missing creator information (createdBy). Cannot verify separation of duties.',
      );
    }

    // Server-enforced dual control: batch creator cannot approve their own batch
    if (metadata.createdBy === approverId) {
      this.logger.warn(`[Dual-Control Violation] Actor ${approverId} attempted to self-approve batch ${batchId}`);
      throw new ForbiddenException(
        'Dual control violation: The creator of a settlement batch cannot approve their own batch. A second financial controller or authorized approver must review and authorize the disbursement.',
      );
    }

    const journalRef = `TR-INT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${batchId.slice(-6).toUpperCase()}`;

    // Post double-entry journal transfer and mark batch PAID
    const updated = await this.prisma.payout.update({
      where: { id: batchId },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        note: JSON.stringify({
          ...metadata,
          approvedBy: approverId,
          approvedAt: new Date().toISOString(),
          journalRef,
        }),
      },
    });

    // Record audit trail
    const auditApprove: SettlementAuditRecord = {
      id: `aud_app_${Date.now()}`,
      action: 'APPROVE_BATCH',
      batchRef: metadata.batchRef || batchId,
      actorId: approverId,
      timestamp: new Date().toISOString(),
      details: { approverId, originalCreator: metadata.createdBy },
    };
    const auditPost: SettlementAuditRecord = {
      id: `aud_post_${Date.now()}`,
      action: 'POST_JOURNAL',
      batchRef: metadata.batchRef || batchId,
      actorId: approverId,
      timestamp: new Date().toISOString(),
      details: { journalRef, debitAccount: 'BLDR_ACQUIRING_POOL', creditAccount: `BRAND_TREASURY_LEDGER_${payout.providerId}` },
    };
    this.auditLog.unshift(auditApprove, auditPost);
    this.logger.log(`[Settlement Dual-Control] Batch ${batchId} approved by ${approverId} -> Journal ${journalRef} posted.`);

    return {
      success: true,
      status: 'POSTED',
      payoutId: updated.id,
      journalRef,
      approvedBy: approverId,
    };
  }

  async markAsPaid(id: string, note?: string) {
    const payout = await this.prisma.payout.findUnique({ where: { id } });
    if (!payout) throw new NotFoundException('Payout not found');

    return this.prisma.payout.update({
      where: { id },
      data: { status: 'PAID', paidAt: new Date(), note },
    });
  }

  getAuditLogs() {
    return this.auditLog;
  }
}
