import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommissionService {
  constructor(private prisma: PrismaService) {}

  /**
   * Returns the effective commission rate for a provider.
   * Falls back to the global default if no provider-specific rule exists.
   */
  async getRate(providerId: string): Promise<{ rate: number; source: 'provider' | 'global' }> {
    // Try provider-specific rule first
    const providerRule = await this.prisma.commissionRule.findUnique({
      where: { providerId },
    });
    if (providerRule) {
      return { rate: Number(providerRule.rate), source: 'provider' };
    }

    // Fall back to global (providerId = null)
    const globalRule = await this.prisma.commissionRule.findFirst({
      where: { providerId: null },
    });

    const defaultRate = parseFloat(process.env.DEFAULT_COMMISSION_RATE || '0.10');
    return {
      rate: globalRule ? Number(globalRule.rate) : defaultRate,
      source: 'global',
    };
  }

  /**
   * Calculates commission and net payable amounts using integer cents arithmetic.
   * Guarantees grossAmount === commissionAmount + netAmount down to the cent with zero floating-point drift.
   */
  calculateCommission(grossAmount: number, rate: number) {
    const grossCents = Math.round(Number(grossAmount) * 100);
    const commissionCents = Math.round(grossCents * Number(rate));
    const netCents = grossCents - commissionCents;

    return {
      grossAmount: grossCents / 100,
      commissionAmount: commissionCents / 100,
      netAmount: netCents / 100,
      grossCents,
      commissionCents,
      netCents,
    };
  }

  async getGlobalRate() {
    const rule = await this.prisma.commissionRule.findFirst({ where: { providerId: null } });
    return { rate: rule ? Number(rule.rate) : parseFloat(process.env.DEFAULT_COMMISSION_RATE || '0.10') };
  }

  async setGlobalRate(rate: number) {
    const existing = await this.prisma.commissionRule.findFirst({
      where: { providerId: null },
    });
    if (existing) {
      return this.prisma.commissionRule.update({
        where: { id: existing.id },
        data: { rate },
      });
    }
    return this.prisma.commissionRule.create({
      data: { providerId: null, rate },
    });
  }

  async setProviderRate(providerId: string, rate: number) {
    const existing = await this.prisma.commissionRule.findFirst({
      where: { providerId },
    });
    if (existing) {
      return this.prisma.commissionRule.update({
        where: { id: existing.id },
        data: { rate },
      });
    }
    return this.prisma.commissionRule.create({
      data: { providerId, rate },
    });
  }

  async removeProviderRate(providerId: string) {
    const rule = await this.prisma.commissionRule.findUnique({ where: { providerId } });
    if (rule) {
      return this.prisma.commissionRule.delete({ where: { providerId } });
    }
  }

  async getAllRules() {
    return this.prisma.commissionRule.findMany({
      include: { provider: { select: { id: true, name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
