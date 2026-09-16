import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsArray,
  IsUrl,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PurchaseType, EngagementType } from '@bldr/shared-types';

export class CreateListingDto {
  @IsString() title: string;
  @IsString() description: string;
  @IsNumber() @Min(0) @Type(() => Number) price: number;
  @IsOptional() @IsString() currency?: string;
  @IsString() category: string;
  @IsOptional() @IsArray() tags?: string[];
  @IsEnum(PurchaseType) purchaseType: PurchaseType;
  @IsEnum(EngagementType) engagementType: EngagementType;
  @IsOptional() @IsString() redirectUrl?: string;
  @IsOptional() @IsBoolean() isFeatured?: boolean;
  @IsOptional() @IsBoolean() isPublished?: boolean;
}

export class UpdateListingDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsNumber() @Min(0) @Type(() => Number) price?: number;
  @IsOptional() @IsString() currency?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsArray() tags?: string[];
  @IsOptional() @IsEnum(PurchaseType) purchaseType?: PurchaseType;
  @IsOptional() @IsEnum(EngagementType) engagementType?: EngagementType;
  @IsOptional() @IsString() redirectUrl?: string;
  @IsOptional() @IsBoolean() isFeatured?: boolean;
  @IsOptional() @IsBoolean() isPublished?: boolean;
}

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async create(providerId: string, dto: CreateListingDto) {
    return this.prisma.listing.create({
      data: {
        ...dto,
        currency: dto.currency || 'USD',
        providerId,
      },
    });
  }

  async findAll(query: {
    providerId?: string;
    category?: string;
    q?: string;
    featured?: boolean;
    page?: number;
    perPage?: number;
  }) {
    const { providerId, category, q, featured, page = 1, perPage = 20 } = query;
    const where: Record<string, unknown> = { isPublished: true };
    if (providerId) where['providerId'] = providerId;
    if (category) where['category'] = { contains: category, mode: 'insensitive' };
    if (featured) where['isFeatured'] = true;
    if (q) {
      where['OR'] = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { tags: { has: q } },
      ];
    }

    const [listings, total] = await Promise.all([
      this.prisma.listing.findMany({
        where,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        include: { provider: { select: { id: true, name: true, slug: true, logoUrl: true, isHouseBrand: true } } },
      }),
      this.prisma.listing.count({ where }),
    ]);

    return { data: listings, meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) } };
  }

  async findOne(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: { provider: { select: { id: true, name: true, slug: true, logoUrl: true, bio: true, isHouseBrand: true } } },
    });
    if (!listing) throw new NotFoundException('Listing not found');
    return listing;
  }

  async findByProvider(providerId: string, includeUnpublished = false) {
    return this.prisma.listing.findMany({
      where: {
        providerId,
        ...(includeUnpublished ? {} : { isPublished: true }),
      },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async update(id: string, providerId: string, dto: UpdateListingDto) {
    await this.assertOwner(id, providerId);
    return this.prisma.listing.update({ where: { id }, data: dto });
  }

  async addMedia(id: string, providerId: string, urls: string[]) {
    await this.assertOwner(id, providerId);
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    return this.prisma.listing.update({
      where: { id },
      data: { mediaUrls: [...(listing?.mediaUrls || []), ...urls] },
    });
  }

  async remove(id: string, providerId: string) {
    await this.assertOwner(id, providerId);
    return this.prisma.listing.delete({ where: { id } });
  }

  async getFeatured(limit = 8) {
    return this.prisma.listing.findMany({
      where: { isFeatured: true, isPublished: true },
      take: limit,
      orderBy: [{ createdAt: 'desc' }],
      include: { provider: { select: { id: true, name: true, slug: true, logoUrl: true, isHouseBrand: true } } },
    });
  }

  async getCategories() {
    const results = await this.prisma.listing.groupBy({
      by: ['category'],
      where: { isPublished: true },
      _count: { category: true },
    });
    return results.map((r) => ({ category: r.category, count: r._count.category }));
  }

  private async assertOwner(id: string, providerId: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new NotFoundException('Listing not found');
    if (listing.providerId !== providerId) throw new ForbiddenException('Not your listing');
    return listing;
  }
}
