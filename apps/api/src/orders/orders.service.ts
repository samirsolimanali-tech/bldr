import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GatewayFactory } from '../payments/gateway.factory';
import { CommissionService } from '../commission/commission.service';
import { IsString, IsEmail, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { GatewayType, OrderStatus, OrderSource } from '@bldr/shared-types';

export class CreateOrderDto {
  @IsString() listingId: string;
  @IsEmail() customerEmail: string;
  @IsOptional() @IsString() customerName?: string;
}

export class ReportOfflineSaleDto {
  @IsString() clickId: string;
  @IsNumber() @Min(0.01) @Type(() => Number) amount: number;
  @IsOptional() @IsEmail() customerEmail?: string;
  @IsOptional() @IsString() customerName?: string;
  @IsOptional() @IsString() externalReference?: string;
}

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private prisma: PrismaService,
    private gatewayFactory: GatewayFactory,
    private commissionSvc: CommissionService,
  ) {}

  async create(dto: CreateOrderDto) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: dto.listingId },
      include: { provider: true },
    });

    if (!listing) throw new NotFoundException('Listing not found');
    if (!listing.isPublished) throw new BadRequestException('Listing is not available');
    if (listing.purchaseType !== 'NATIVE') {
      throw new BadRequestException('This listing uses redirect — no checkout session needed');
    }

    // Create pending order
    const order = await this.prisma.order.create({
      data: {
        listingId: listing.id,
        providerId: listing.providerId,
        customerEmail: dto.customerEmail,
        customerName: dto.customerName,
        amount: listing.price,
        currency: listing.currency,
        status: OrderStatus.PENDING,
        source: OrderSource.NATIVE,
        gatewayUsed: GatewayType.GEIDEA,
      },
    });

    const orderWithListing = { ...order, listing: { title: listing.title } };
    let checkoutResult;
    let gatewayUsed = GatewayType.GEIDEA;
    let fallbackUsed = false;
    let fallbackReason: string | undefined;

    // Requirement 2: Geidea modal is the default primary path for native buy_now
    const geideaAdapter = this.gatewayFactory.getAdapter(GatewayType.GEIDEA);
    try {
      checkoutResult = await geideaAdapter.createCheckoutSession(orderWithListing as any);
    } catch (err: any) {
      fallbackUsed = true;
      fallbackReason = err?.message || 'Geidea session creation failed';
      this.logger.warn(`[Checkout Fallback] Order ${order.id}: Geidea modal session creation failed (${fallbackReason}). Activating fallback redirect.`);

      const fawryAdapter = this.gatewayFactory.getAdapter(GatewayType.FAWRY);
      checkoutResult = await fawryAdapter.createCheckoutSession(orderWithListing as any);
      gatewayUsed = GatewayType.FAWRY;
    }

    // Update gateway metadata and session
    await this.prisma.order.update({
      where: { id: order.id },
      data: {
        gatewayUsed,
        gatewaySessionId: checkoutResult.type === 'session_id' ? checkoutResult.value : null,
        gatewayMetadata: {
          checkoutResultType: checkoutResult.type,
          checkoutValue: checkoutResult.value,
          gatewayUsed,
          fallbackUsed,
          fallbackReason,
        },
      },
    });

    return {
      orderId: order.id,
      checkoutResult,
      fallbackUsed,
      geideaJsSdkUrl: process.env.GEIDEA_CHECKOUT_JS_URL || 'https://checkout-demo.geidea.net/geideaCheckout.min.js',
    };
  }

  /**
   * Client-side fallback: if Geidea SDK fails to load or initialize in the browser,
   * client calls this endpoint to switch to a fallback redirect URL with full audit logging.
   */
  async getFallbackRedirect(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { listing: true },
    });
    if (!order) throw new NotFoundException('Order not found');

    this.logger.warn(`[Checkout Fallback] Order ${orderId}: Client-side Geidea modal/SDK failed. Generating fallback redirect URL.`);

    const fawryAdapter = this.gatewayFactory.getAdapter(GatewayType.FAWRY);
    const checkoutResult = await fawryAdapter.createCheckoutSession(order as any);

    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        gatewayUsed: GatewayType.FAWRY,
        gatewayMetadata: {
          checkoutResultType: checkoutResult.type,
          checkoutValue: checkoutResult.value,
          gatewayUsed: GatewayType.FAWRY,
          fallbackUsed: true,
          fallbackReason: 'client_sdk_failure',
        },
      },
    });

    return {
      orderId: order.id,
      redirectUrl: checkoutResult.value,
    };
  }

  /**
   * Requirement 3: Anti-fraud Provider "Report a Sale" flow.
   * Creates an order with status PENDING_VERIFICATION and source REDIRECT.
   * Commission is calculated for visibility, but payout ledger is NOT incremented until admin approval.
   */
  async reportOfflineSale(providerId: string, dto: ReportOfflineSaleDto) {
    const trackingEvent = await this.prisma.trackingEvent.findUnique({
      where: { clickId: dto.clickId },
      include: { listing: true },
    });

    if (!trackingEvent) {
      throw new NotFoundException(`Tracking click ID "${dto.clickId}" not found`);
    }

    if (trackingEvent.providerId !== providerId) {
      throw new BadRequestException('Tracking click ID belongs to another provider');
    }

    const { rate } = await this.commissionSvc.getRate(providerId);
    const { commissionAmount, netAmount } = this.commissionSvc.calculateCommission(dto.amount, rate);

    const order = await this.prisma.order.create({
      data: {
        listingId: trackingEvent.listingId,
        providerId,
        customerEmail: dto.customerEmail || 'customer@redirect-sale.com',
        customerName: dto.customerName,
        amount: dto.amount,
        currency: trackingEvent.listing.currency || 'USD',
        status: OrderStatus.PENDING_VERIFICATION,
        source: OrderSource.REDIRECT,
        externalReference: dto.externalReference || dto.clickId,
        trackingEventId: trackingEvent.id,
        gatewayUsed: GatewayType.EXTERNAL,
        commissionRate: rate,
        commissionAmount,
        netAmount,
        gatewayMetadata: {
          reportedBy: 'provider_portal',
          clickId: dto.clickId,
          reportedAt: new Date().toISOString(),
        },
      },
    });

    this.logger.log(`[Attribution Report] Provider ${providerId} reported sale for click ${dto.clickId}. Order ${order.id} placed in PENDING_VERIFICATION.`);

    return order;
  }

  /**
   * Requirement 3: Admin Approval Action.
   * Verifies and approves a REDIRECT order in PENDING_VERIFICATION,
   * transitioning it to PAID and crediting the provider's payout ledger.
   */
  async approveRedirectOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    if (order.status !== OrderStatus.PENDING_VERIFICATION) {
      throw new BadRequestException(`Order ${orderId} is not pending verification (current status: ${order.status})`);
    }

    const amount = Number(order.amount);
    const commissionAmount = Number(order.commissionAmount || 0);
    const netAmount = Number(order.netAmount || (amount - commissionAmount));

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.PAID },
    });

    // Credit payout ledger
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const existingPayout = await this.prisma.payout.findFirst({
      where: {
        providerId: order.providerId,
        periodStart: { lte: now },
        periodEnd: { gte: now },
        status: 'PENDING',
      },
    });

    if (existingPayout) {
      await this.prisma.payout.update({
        where: { id: existingPayout.id },
        data: {
          grossAmount: { increment: amount },
          commissionAmount: { increment: commissionAmount },
          netAmount: { increment: netAmount },
          orders: { connect: { id: orderId } },
        },
      });
    } else {
      await this.prisma.payout.create({
        data: {
          providerId: order.providerId,
          periodStart,
          periodEnd,
          grossAmount: amount,
          commissionAmount,
          netAmount,
          status: 'PENDING',
          orders: { connect: { id: orderId } },
        },
      });
    }

    this.logger.log(`[Attribution Approved] Admin approved redirect order ${orderId}. Credited payout ledger for provider ${order.providerId}.`);

    return updatedOrder;
  }

  async getStatus(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        listing: { select: { id: true, title: true } },
        provider: { select: { id: true, name: true } },
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findForProvider(
    providerId: string,
    page = 1,
    perPage = 20,
    status?: OrderStatus,
    dateFrom?: string,
    dateTo?: string,
  ) {
    const where: Record<string, unknown> = { providerId };
    if (status) where['status'] = status;
    if (dateFrom || dateTo) {
      where['createdAt'] = {
        ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
        ...(dateTo ? { lte: new Date(dateTo) } : {}),
      };
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: 'desc' },
        include: {
          listing: { select: { id: true, title: true } },
          trackingEvent: { select: { clickId: true, redirectUrl: true } },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { data: orders, meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) } };
  }

  async findAll(page = 1, perPage = 20, status?: OrderStatus) {
    const where: Record<string, unknown> = {};
    if (status) where['status'] = status;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: 'desc' },
        include: {
          listing: { select: { id: true, title: true } },
          provider: { select: { id: true, name: true, slug: true } },
          trackingEvent: { select: { clickId: true, redirectUrl: true } },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { data: orders, meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) } };
  }

  /**
   * Requirement 4: Integer cents arithmetic precision.
   * Called by WebhooksService after a verified webhook arrives.
   * Updates order status, calculates commission, updates payout ledger.
   */
  async markPaid(orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    const { rate } = await this.commissionSvc.getRate(order.providerId);
    const amount = Number(order.amount);
    const { commissionAmount, netAmount } = this.commissionSvc.calculateCommission(amount, rate);

    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.PAID,
        commissionRate: rate,
        commissionAmount,
        netAmount,
      },
    });

    // Upsert payout for this provider/period (monthly)
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const existing = await this.prisma.payout.findFirst({
      where: {
        providerId: order.providerId,
        periodStart: { lte: now },
        periodEnd: { gte: now },
        status: 'PENDING',
      },
    });

    if (existing) {
      await this.prisma.payout.update({
        where: { id: existing.id },
        data: {
          grossAmount: { increment: amount },
          commissionAmount: { increment: commissionAmount },
          netAmount: { increment: netAmount },
          orders: { connect: { id: orderId } },
        },
      });
    } else {
      await this.prisma.payout.create({
        data: {
          providerId: order.providerId,
          periodStart,
          periodEnd,
          grossAmount: amount,
          commissionAmount,
          netAmount,
          status: 'PENDING',
          orders: { connect: { id: orderId } },
        },
      });
    }

    return { orderId, commissionAmount, netAmount };
  }

  async markFailed(orderId: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.FAILED },
    });
  }
}
