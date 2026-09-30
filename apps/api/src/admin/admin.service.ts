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

  // ─── Products & Listings Management ────────────────────────────────────────

  async listAllListings(query?: { category?: string; providerId?: string; q?: string; status?: string }) {
    const where: any = {};
    if (query?.category) where.category = { contains: query.category, mode: 'insensitive' };
    if (query?.providerId) where.providerId = query.providerId;
    if (query?.status === 'PUBLISHED') where.isPublished = true;
    if (query?.status === 'DRAFT') where.isPublished = false;
    if (query?.q) {
      where.OR = [
        { title: { contains: query.q, mode: 'insensitive' } },
        { description: { contains: query.q, mode: 'insensitive' } },
        { category: { contains: query.q, mode: 'insensitive' } },
      ];
    }

    return this.prisma.listing.findMany({
      where,
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      include: {
        provider: {
          select: { id: true, name: true, slug: true, isHouseBrand: true, logoUrl: true },
        },
        _count: { select: { orders: true, leads: true } },
      },
    });
  }

  async createListing(dto: any) {
    let providerId = dto.providerId;
    if (!providerId) {
      const houseBrand = await this.prisma.provider.findFirst({ where: { isHouseBrand: true } });
      if (!houseBrand) throw new NotFoundException('House brand provider not found');
      providerId = houseBrand.id;
    }

    return this.prisma.listing.create({
      data: {
        title: dto.title,
        description: dto.description || '',
        price: dto.price || 0,
        currency: dto.currency || 'USD',
        category: dto.category || 'General',
        tags: Array.isArray(dto.tags) ? dto.tags : (dto.tags ? dto.tags.split(',').map((t: string) => t.trim()) : []),
        mediaUrls: dto.mediaUrls || [],
        purchaseType: dto.purchaseType || 'NATIVE',
        engagementType: dto.engagementType || 'BUY_NOW',
        redirectUrl: dto.redirectUrl || null,
        isFeatured: dto.isFeatured ?? false,
        isPublished: dto.isPublished ?? true,
        providerId,
      },
      include: {
        provider: { select: { id: true, name: true, slug: true, isHouseBrand: true } },
      },
    });
  }

  async updateListing(id: string, dto: any) {
    const existing = await this.prisma.listing.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Listing not found');

    const data: any = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.price !== undefined) data.price = dto.price;
    if (dto.currency !== undefined) data.currency = dto.currency;
    if (dto.category !== undefined) data.category = dto.category;
    if (dto.tags !== undefined) {
      data.tags = Array.isArray(dto.tags) ? dto.tags : dto.tags.split(',').map((t: string) => t.trim());
    }
    if (dto.mediaUrls !== undefined) data.mediaUrls = dto.mediaUrls;
    if (dto.purchaseType !== undefined) data.purchaseType = dto.purchaseType;
    if (dto.engagementType !== undefined) data.engagementType = dto.engagementType;
    if (dto.redirectUrl !== undefined) data.redirectUrl = dto.redirectUrl;
    if (dto.isFeatured !== undefined) data.isFeatured = dto.isFeatured;
    if (dto.isPublished !== undefined) data.isPublished = dto.isPublished;
    if (dto.providerId !== undefined) data.providerId = dto.providerId;

    return this.prisma.listing.update({
      where: { id },
      data,
      include: {
        provider: { select: { id: true, name: true, slug: true, isHouseBrand: true } },
      },
    });
  }

  async toggleListingPublish(id: string) {
    const existing = await this.prisma.listing.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Listing not found');
    return this.prisma.listing.update({
      where: { id },
      data: { isPublished: !existing.isPublished },
    });
  }

  async toggleListingFeatured(id: string) {
    const existing = await this.prisma.listing.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Listing not found');
    return this.prisma.listing.update({
      where: { id },
      data: { isFeatured: !existing.isFeatured },
    });
  }

  async deleteListing(id: string) {
    const existing = await this.prisma.listing.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Listing not found');
    return this.prisma.listing.delete({ where: { id } });
  }
}
