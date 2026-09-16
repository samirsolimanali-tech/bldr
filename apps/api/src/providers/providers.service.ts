import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IsString, IsOptional, IsUrl } from 'class-validator';
import { ProviderStatus } from '@bldr/shared-types';

export class UpdateProviderDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() tagline?: string;
  @IsOptional() @IsString() bio?: string;
  @IsOptional() @IsString() logoUrl?: string;
  @IsOptional() @IsString() bannerUrl?: string;
  @IsOptional() @IsString() website?: string;
}

@Injectable()
export class ProvidersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, perPage = 20, status?: ProviderStatus) {
    const where = status ? { status } : {};
    const [providers, total] = await Promise.all([
      this.prisma.provider.findMany({
        where,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { listings: true, orders: true } } },
      }),
      this.prisma.provider.count({ where }),
    ]);
    return { data: providers, meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) } };
  }

  async findBySlug(slug: string) {
    const provider = await this.prisma.provider.findUnique({
      where: { slug },
      include: {
        listings: { where: { isPublished: true }, orderBy: { isFeatured: 'desc' } },
        _count: { select: { listings: true, orders: true } },
      },
    });
    if (!provider) throw new NotFoundException('Provider not found');
    return provider;
  }

  async findById(id: string) {
    const provider = await this.prisma.provider.findUnique({ where: { id } });
    if (!provider) throw new NotFoundException('Provider not found');
    return provider;
  }

  async update(id: string, dto: UpdateProviderDto, requestingProviderId: string) {
    if (id !== requestingProviderId) {
      throw new ForbiddenException('Cannot update another provider');
    }
    return this.prisma.provider.update({ where: { id }, data: dto });
  }

  async getPublicList(page = 1, perPage = 20, category?: string) {
    const where: Record<string, unknown> = { status: 'APPROVED' };
    if (category) {
      where['listings'] = { some: { category, isPublished: true } };
    }
    const [providers, total] = await Promise.all([
      this.prisma.provider.findMany({
        where,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: [{ isHouseBrand: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.provider.count({ where }),
    ]);
    return { data: providers, meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) } };
  }
}
