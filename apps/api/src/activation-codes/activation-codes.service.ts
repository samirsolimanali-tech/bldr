import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EnrollmentCodeStatus, EnrollmentCodeSource } from '@prisma/client';
import * as crypto from 'crypto';

export interface RedeemCodeDto {
  ventureId: string;
  code: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  orderRef?: string;
  ipAddress?: string;
}

export interface ActivationFailureLog {
  timestamp: string;
  reason: 'RATE_LIMIT_EXCEEDED' | 'CODE_NOT_FOUND' | 'CODE_ALREADY_USED' | 'CODE_EXPIRED_OR_VOID' | 'INVALID_INPUT';
  ipAddress: string;
  ventureId: string;
  maskedCode: string;
  details?: string;
}

@Injectable()
export class ActivationCodesService {
  private readonly logger = new Logger(ActivationCodesService.name);

  // Failure logs for forensic security review (capped in-memory; in production use a structured log sink)
  private readonly failureLogs: ActivationFailureLog[] = [];

  // ─── Rate limit thresholds ───────────────────────────────────────────────────
  // State is DB-backed (ActivationAttempt table) — survives restarts and scales
  // across multiple API instances without shared cache.
  private readonly IP_RATE_LIMIT    = 5;        // max attempts per IP per window
  private readonly BRAND_RATE_LIMIT = 20;       // max attempts per brand per window
  private readonly WINDOW_MS        = 60_000;   // 60-second sliding window

  constructor(private readonly prisma: PrismaService) {}

  // ─── Hash & Mask Utilities ──────────────────────────────────────────────────

  static hashCode(code: string): string {
    const normalized = (code || '').trim().toUpperCase();
    return crypto.createHash('sha256').update(normalized).digest('hex');
  }

  static maskCode(code: string): string {
    const trimmed = (code || '').trim().toUpperCase();
    if (trimmed.length <= 4) return '****';
    const firstTwo = trimmed.slice(0, 2);
    const lastFour = trimmed.slice(-4);
    return `${firstTwo}-***-${lastFour}`;
  }

  // ─── DB-backed Rate Limiter ─────────────────────────────────────────────────
  //
  // Counts rows in ActivationAttempt within the sliding WINDOW_MS window.
  // Recording always happens before the check so the current attempt is counted.
  // Any excess rows older than 1 hour are pruned asynchronously.

  private async checkAndRecordAttempt(ip: string, ventureId: string): Promise<void> {
    const windowStart = new Date(Date.now() - this.WINDOW_MS);

    // Record this attempt first (then count)
    await (this.prisma as any).activationAttempt.create({
      data: { ipAddress: ip, ventureId },
    });

    // Count IP attempts in window
    const ipCount = await (this.prisma as any).activationAttempt.count({
      where: { ipAddress: ip, attemptedAt: { gte: windowStart } },
    });
    if (ipCount > this.IP_RATE_LIMIT) {
      throw new HttpException(
        'Too many redemption attempts from this IP address. Please wait a minute and try again.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Count brand attempts in window
    const brandCount = await (this.prisma as any).activationAttempt.count({
      where: { ventureId, attemptedAt: { gte: windowStart } },
    });
    if (brandCount > this.BRAND_RATE_LIMIT) {
      throw new HttpException(
        'Too many redemption attempts for this brand. Rate limit exceeded; please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Prune stale rows asynchronously (older than 1 h)
    const pruneStart = new Date(Date.now() - 3_600_000);
    (this.prisma as any).activationAttempt
      .deleteMany({ where: { attemptedAt: { lt: pruneStart } } })
      .catch(() => { /* non-fatal */ });
  }

  // ─── Record Failure Log ─────────────────────────────────────────────────────

  private logFailure(
    reason: ActivationFailureLog['reason'],
    ipAddress: string,
    ventureId: string,
    maskedCode: string,
    details?: string,
  ) {
    const logEntry: ActivationFailureLog = {
      timestamp: new Date().toISOString(),
      reason,
      ipAddress: ipAddress || '0.0.0.0',
      ventureId,
      maskedCode,
      details,
    };

    this.failureLogs.unshift(logEntry);
    if (this.failureLogs.length > 500) {
      this.failureLogs.pop();
    }

    this.logger.warn(
      `[Activation Code Failure] Reason=${reason} IP=${logEntry.ipAddress} Brand=${ventureId} Code=${maskedCode} Details=${details || 'none'}`,
    );
  }

  getFailureLogs(filter?: { ventureId?: string; reason?: string }) {
    let logs = this.failureLogs;
    if (filter?.ventureId) {
      logs = logs.filter((l) => l.ventureId.toLowerCase() === filter.ventureId?.toLowerCase());
    }
    if (filter?.reason) {
      logs = logs.filter((l) => l.reason === filter.reason);
    }
    return logs;
  }

  // ─── Create Code (Stored Hashed) ────────────────────────────────────────────

  async createCode(data: {
    ventureId: string;
    code: string;
    serial?: string;
    productId?: string;
    productName: string;
    source?: EnrollmentCodeSource;
    notes?: string;
  }) {
    const normalized = (data.code || '').trim().toUpperCase();
    if (!normalized) throw new BadRequestException('Activation code cannot be empty');

    const codeHash = ActivationCodesService.hashCode(normalized);
    const masked = ActivationCodesService.maskCode(normalized);

    const record = await this.prisma.enrollmentCode.create({
      data: {
        code: masked, // Only store masked code for display
        codeHash,    // Store SHA-256 hash for secure matching
        serial: data.serial,
        ventureId: data.ventureId,
        productId: data.productId,
        productName: data.productName,
        source: data.source ?? EnrollmentCodeSource.CENTER,
        status: EnrollmentCodeStatus.UNUSED,
        notes: data.notes,
      },
    });

    return {
      id: record.id,
      maskedCode: record.code,
      serial: record.serial,
      productName: record.productName,
      status: record.status,
    };
  }

  // ─── Redeem Code (Atomic & Race-Safe) ────────────────────────────────────────

  async redeemCode(dto: RedeemCodeDto) {
    const rawCode = (dto.code || '').trim().toUpperCase();
    const ip = dto.ipAddress || '127.0.0.1';
    const ventureId = (dto.ventureId || '').trim();
    const masked = ActivationCodesService.maskCode(rawCode);

    if (!rawCode) {
      this.logFailure('INVALID_INPUT', ip, ventureId, masked, 'Empty code supplied');
      throw new BadRequestException('Please provide a valid activation code.');
    }

    if (!dto.studentName?.trim() || !dto.studentEmail?.trim()) {
      this.logFailure('INVALID_INPUT', ip, ventureId, masked, 'Missing student name or email');
      throw new BadRequestException('Student name and email are required for registration.');
    }

    // 1. Enforce Rate Limiting (DB-backed per-IP and per-brand, survives restarts)
    try {
      await this.checkAndRecordAttempt(ip, ventureId);
    } catch (rlErr: any) {
      this.logFailure('RATE_LIMIT_EXCEEDED', ip, ventureId, masked, rlErr?.message);
      throw rlErr;
    }

    // 2. Resolve target code hash
    const targetHash = ActivationCodesService.hashCode(rawCode);

    // Find venture/provider by slug or ID
    const venture = await this.prisma.provider.findFirst({
      where: {
        OR: [{ id: ventureId }, { slug: ventureId.toLowerCase() }],
      },
    });
    const resolvedVentureId = venture ? venture.id : ventureId;

    const redeemedAt = new Date();
    const orderRef = dto.orderRef || `ACT-${Date.now().toString().slice(-6)}`;

    // 3. Atomic Single-Use DB Update (Race-Safe)
    // Using updateMany with status: UNUSED ensures that concurrent requests
    // with the exact same code will only have exactly ONE winner with count === 1.
    const result = await this.prisma.enrollmentCode.updateMany({
      where: {
        ventureId: resolvedVentureId,
        codeHash: targetHash,
        status: EnrollmentCodeStatus.UNUSED,
      },
      data: {
        status: EnrollmentCodeStatus.USED,
        redeemedAt,
        redeemedByEmail: dto.studentEmail.trim(),
        redeemedByName: dto.studentName.trim(),
        orderId: orderRef,
      },
    });

    // 4. Handle Race-Condition or Missing / Already-Used Code
    if (result.count === 0) {
      // Investigate reason for failure to log accurate security diagnostics
      const existing = await this.prisma.enrollmentCode.findFirst({
        where: {
          ventureId: resolvedVentureId,
          codeHash: targetHash,
        },
      });

      if (!existing) {
        this.logFailure('CODE_NOT_FOUND', ip, ventureId, masked, 'Code hash does not exist in brand pool');
        throw new NotFoundException(`Activation code "${masked}" was not found for this brand.`);
      }

      if (existing.status === EnrollmentCodeStatus.USED) {
        const dateStr = existing.redeemedAt ? existing.redeemedAt.toISOString().slice(0, 10) : 'a prior date';
        this.logFailure('CODE_ALREADY_USED', ip, ventureId, masked, `Already redeemed on ${dateStr}`);
        throw new ConflictException(
          `This activation code has already been redeemed on ${dateStr}. Each code can only be used once.`,
        );
      }

      this.logFailure('CODE_EXPIRED_OR_VOID', ip, ventureId, masked, `Code status is ${existing.status}`);
      throw new BadRequestException(`This activation code is no longer valid (status: ${existing.status}).`);
    }

    // 5. Successful Redemption
    this.logger.log(
      `[Activation Code Success] Code ${masked} successfully redeemed for ${dto.studentEmail} in brand=${ventureId} (Order: ${orderRef})`,
    );

    // Fetch the updated code details for receipt
    const codeRecord = await this.prisma.enrollmentCode.findFirst({
      where: {
        ventureId: resolvedVentureId,
        codeHash: targetHash,
      },
    });

    return {
      success: true,
      message: 'Activation code redeemed successfully! Enrollment granted.',
      orderId: orderRef,
      redeemedAt: redeemedAt.toISOString(),
      code: {
        id: codeRecord?.id,
        maskedCode: codeRecord?.code,
        serial: codeRecord?.serial,
        productName: codeRecord?.productName,
        source: codeRecord?.source,
        redeemedByEmail: dto.studentEmail,
        redeemedByName: dto.studentName,
      },
    };
  }
}
