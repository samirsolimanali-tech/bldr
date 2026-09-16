import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PayoutsService {
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

  async markAsPaid(id: string, note?: string) {
    const payout = await this.prisma.payout.findUnique({ where: { id } });
    if (!payout) throw new NotFoundException('Payout not found');

    return this.prisma.payout.update({
      where: { id },
      data: { status: 'PAID', paidAt: new Date(), note },
    });
  }
}
