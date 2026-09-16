import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CommissionService } from '../commission/commission.service';
import { ProviderStatus } from '@bldr/shared-types';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private commissionSvc: CommissionService,
  ) {}

  // ─── Provider Management ──────────────────────────────────────────────────

  async listProviders(page = 1, perPage = 20, status?: ProviderStatus) {
    const where = status ? { status } : {};
    const [providers, total] = await Promise.all([
      this.prisma.provider.findMany({
        where,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { listings: true, orders: true, leads: true } },
          commissionRules: true,
        },
      }),
      this.prisma.provider.count({ where }),
    ]);
    return { data: providers, meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) } };
  }

  async approveProvider(id: string) {
    return this.updateProviderStatus(id, ProviderStatus.APPROVED);
  }

  async rejectProvider(id: string, reason?: string) {
    return this.prisma.provider.update({
      where: { id },
      data: { status: ProviderStatus.REJECTED, rejectedReason: reason },
    });
  }

  async suspendProvider(id: string) {
    return this.updateProviderStatus(id, ProviderStatus.SUSPENDED);
  }

  private async updateProviderStatus(id: string, status: ProviderStatus) {
    const provider = await this.prisma.provider.findUnique({ where: { id } });
    if (!provider) throw new NotFoundException('Provider not found');
    return this.prisma.provider.update({ where: { id }, data: { status } });
  }

  // ─── Commission Config ────────────────────────────────────────────────────

  async getCommissionRules() {
    return this.commissionSvc.getAllRules();
  }

  async setGlobalRate(rate: number) {
    return this.commissionSvc.setGlobalRate(rate);
  }

  async setProviderRate(providerId: string, rate: number) {
    return this.commissionSvc.setProviderRate(providerId, rate);
  }

  async removeProviderRate(providerId: string) {
    return this.commissionSvc.removeProviderRate(providerId);
  }

  // ─── Stats ────────────────────────────────────────────────────────────────

  async getDashboardStats() {
    const [
      totalProviders,
      pendingProviders,
      totalOrders,
      paidOrders,
      totalLeads,
      pendingPayouts,
    ] = await Promise.all([
      this.prisma.provider.count(),
      this.prisma.provider.count({ where: { status: 'PENDING' } }),
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: 'PAID' } }),
      this.prisma.lead.count(),
      this.prisma.payout.count({ where: { status: 'PENDING' } }),
    ]);

    const revenue = await this.prisma.order.aggregate({
      where: { status: 'PAID' },
      _sum: { amount: true, commissionAmount: true },
    });

    return {
      totalProviders,
      pendingProviders,
      totalOrders,
      paidOrders,
      totalLeads,
      pendingPayouts,
      totalRevenue: Number(revenue._sum.amount || 0),
      totalCommission: Number(revenue._sum.commissionAmount || 0),
    };
  }
}
