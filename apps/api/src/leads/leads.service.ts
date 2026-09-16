import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { EngagementType, LeadStatus } from '@bldr/shared-types';

export class CreateLeadDto {
  @IsString() listingId: string;
  @IsString() name: string;
  @IsEmail() email: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() message?: string;
  @IsEnum(EngagementType) engagementType: EngagementType;
}

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLeadDto) {
    const listing = await this.prisma.listing.findUnique({ where: { id: dto.listingId } });
    if (!listing) throw new NotFoundException('Listing not found');

    return this.prisma.lead.create({
      data: {
        listingId: dto.listingId,
        providerId: listing.providerId,
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        message: dto.message,
        engagementType: dto.engagementType,
        status: LeadStatus.NEW,
      },
    });
  }

  async findForProvider(providerId: string, page = 1, perPage = 20, status?: LeadStatus) {
    const where: Record<string, unknown> = { providerId };
    if (status) where['status'] = status;

    const [leads, total] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: 'desc' },
        include: { listing: { select: { id: true, title: true } } },
      }),
      this.prisma.lead.count({ where }),
    ]);

    return { data: leads, meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) } };
  }

  async findAll(page = 1, perPage = 20, status?: LeadStatus) {
    const where: Record<string, unknown> = {};
    if (status) where['status'] = status;

    const [leads, total] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: 'desc' },
        include: {
          listing: { select: { id: true, title: true } },
          provider: { select: { id: true, name: true } },
        },
      }),
      this.prisma.lead.count({ where }),
    ]);

    return { data: leads, meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) } };
  }

  async updateStatus(id: string, status: LeadStatus) {
    return this.prisma.lead.update({ where: { id }, data: { status } });
  }
}
