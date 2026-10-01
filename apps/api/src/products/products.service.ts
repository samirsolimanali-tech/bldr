import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateProductDto {
  ventureId: string;
  slug: string;
  title_en: string;
  title_ar: string;
  description?: string;
  priceMinor: number;
  currency?: string;
  saleMode?: 'DIRECT' | 'REDIRECT';
  redirectUrl?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'ARCHIVED';
  coverImage?: string;
}

export interface UpdateProductDto {
  title_en?: string;
  title_ar?: string;
  description?: string;
  priceMinor?: number;
  currency?: string;
  saleMode?: 'DIRECT' | 'REDIRECT';
  redirectUrl?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'ARCHIVED';
  coverImage?: string;
}

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── Create Product (Admin / Scoped Venture) ─────────────────────────────────
  async createProduct(
    dto: CreateProductDto,
    actorId: string,
    actorRole: string,
    actorVentureId?: string,
  ) {
    // Brand isolation check: if actor is scoped to a venture, they cannot create for another
    if (actorRole !== 'ADMIN' && actorVentureId && actorVentureId !== dto.ventureId) {
      throw new ForbiddenException(
        `Brand isolation violation: You cannot create products for venture "${dto.ventureId}".`,
      );
    }

    if (dto.priceMinor <= 0) {
      throw new BadRequestException('priceMinor must be a positive integer in piasters.');
    }

    // Ensure venture exists
    const venture = await (this.prisma as any).provider.findFirst({
      where: {
        OR: [{ id: dto.ventureId }, { slug: dto.ventureId.toLowerCase() }],
      },
    });
    if (!venture) {
      throw new NotFoundException(`Venture "${dto.ventureId}" not found.`);
    }

    const product = await (this.prisma as any).product.create({
      data: {
        ventureId: venture.id,
        slug: dto.slug.toLowerCase().trim(),
        title_en: dto.title_en,
        title_ar: dto.title_ar,
        description: dto.description || null,
        priceMinor: Math.round(dto.priceMinor),
        currency: dto.currency || 'EGP',
        saleMode: dto.saleMode || 'DIRECT',
        redirectUrl: dto.redirectUrl || null,
        status: dto.status || 'ACTIVE',
        coverImage: dto.coverImage || null,
      },
    });

    // Write audit log
    await (this.prisma as any).auditLog.create({
      data: {
        entity: 'PRODUCT',
        entityId: product.id,
        action: 'CREATE',
        actorId,
        actorRole,
        ventureId: venture.id,
        diff: {
          created: {
            title_en: product.title_en,
            priceMinor: product.priceMinor,
            status: product.status,
          },
        },
      },
    });

    this.logger.log(`[Product Created] ID=${product.id} slug=${product.slug} by actor=${actorId}`);
    return product;
  }

  // ─── Find All Products (Scoped) ──────────────────────────────────────────────
  async findAll(actorRole: string, actorVentureId?: string, filterStatus?: string) {
    const where: any = {};

    // Strict brand isolation: non-superadmins can only list their own brand's products
    if (actorRole !== 'ADMIN' && actorVentureId) {
      where.ventureId = actorVentureId;
    }

    if (filterStatus) {
      where.status = filterStatus;
    }

    return (this.prisma as any).product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        provider: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  // ─── Public Products for Storefront ──────────────────────────────────────────
  async findPublic(ventureSlug?: string) {
    const where: any = { status: 'ACTIVE' };

    if (ventureSlug) {
      const venture = await (this.prisma as any).provider.findFirst({
        where: { slug: ventureSlug.toLowerCase() },
      });
      if (venture) {
        where.ventureId = venture.id;
      }
    }

    return (this.prisma as any).product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        provider: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  // ─── Find One Product ────────────────────────────────────────────────────────
  async findOne(idOrSlug: string, actorRole?: string, actorVentureId?: string) {
    const product = await (this.prisma as any).product.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug.toLowerCase() }],
      },
      include: {
        provider: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product "${idOrSlug}" not found.`);
    }

    // Brand isolation for admin retrieval
    if (actorRole && actorRole !== 'ADMIN' && actorVentureId && product.ventureId !== actorVentureId) {
      throw new ForbiddenException(`Brand isolation violation: Access denied to product "${idOrSlug}".`);
    }

    return product;
  }

  // ─── Update Product (Price & Status Audit Log) ───────────────────────────────
  async updateProduct(
    id: string,
    dto: UpdateProductDto,
    actorId: string,
    actorRole: string,
    actorVentureId?: string,
  ) {
    const existing = await (this.prisma as any).product.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Product "${id}" not found.`);
    }

    // Brand isolation
    if (actorRole !== 'ADMIN' && actorVentureId && existing.ventureId !== actorVentureId) {
      throw new ForbiddenException(`Brand isolation violation: Cannot modify another brand's product.`);
    }

    const priceChanged = dto.priceMinor !== undefined && dto.priceMinor !== existing.priceMinor;
    const statusChanged = dto.status !== undefined && dto.status !== existing.status;

    const updated = await (this.prisma as any).product.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.priceMinor ? { priceMinor: Math.round(dto.priceMinor) } : {}),
      },
    });

    // Write audit log if price changed
    if (priceChanged) {
      await (this.prisma as any).auditLog.create({
        data: {
          entity: 'PRODUCT',
          entityId: id,
          action: 'UPDATE_PRICE',
          actorId,
          actorRole,
          ventureId: existing.ventureId,
          diff: {
            oldPriceMinor: existing.priceMinor,
            newPriceMinor: updated.priceMinor,
            currency: updated.currency,
          },
        },
      });
      this.logger.log(
        `[Audit: Price Change] Product ${id} price updated from ${existing.priceMinor}p to ${updated.priceMinor}p by ${actorId}`,
      );
    }

    // Write audit log if status changed
    if (statusChanged) {
      await (this.prisma as any).auditLog.create({
        data: {
          entity: 'PRODUCT',
          entityId: id,
          action: 'UPDATE_STATUS',
          actorId,
          actorRole,
          ventureId: existing.ventureId,
          diff: {
            oldStatus: existing.status,
            newStatus: updated.status,
          },
        },
      });
      this.logger.log(
        `[Audit: Status Change] Product ${id} status updated from ${existing.status} to ${updated.status} by ${actorId}`,
      );
    }

    return updated;
  }

  // ─── Delete / Archive Product ────────────────────────────────────────────────
  async deleteProduct(id: string, actorId: string, actorRole: string, actorVentureId?: string) {
    const existing = await (this.prisma as any).product.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Product "${id}" not found.`);
    }

    if (actorRole !== 'ADMIN' && actorVentureId && existing.ventureId !== actorVentureId) {
      throw new ForbiddenException(`Brand isolation violation: Cannot delete another brand's product.`);
    }

    const deleted = await (this.prisma as any).product.delete({ where: { id } });

    await (this.prisma as any).auditLog.create({
      data: {
        entity: 'PRODUCT',
        entityId: id,
        action: 'DELETE',
        actorId,
        actorRole,
        ventureId: existing.ventureId,
        diff: { deletedTitle: existing.title_en, slug: existing.slug },
      },
    });

    return { success: true, id: deleted.id };
  }
}
