import { Injectable, NotFoundException, UnauthorizedException, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CommissionService } from '../commission/commission.service';
import { IsString, IsNumber, Min, IsOptional, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus, OrderSource, GatewayType } from '@bldr/shared-types';

export class CreateTrackingEventDto {
  @IsString() listingId: string;
}

export class ConversionPostbackDto {
  @IsString() clickId: string;
  @IsString() token: string;
  @IsNumber() @Min(0.01) @Type(() => Number) amount: number;
  @IsOptional() @IsEmail() customerEmail?: string;
  @IsOptional() @IsString() customerName?: string;
  @IsOptional() @IsString() orderRef?: string;
  @IsOptional() @IsString() currency?: string;
}

@Injectable()
export class TrackingService {
  private readonly logger = new Logger(TrackingService.name);
  private rateLimits = new Map<string, number[]>();

  constructor(
    private prisma: PrismaService,
    private commissionSvc: CommissionService,
  ) {}

  /**
   * Rate limiting helper per provider conversion token.
   * Max 20 requests per 60-second window.
   */
  private checkRateLimit(token: string, maxRequests = 20, windowMs = 60_000) {
    const now = Date.now();
    const timestamps = (this.rateLimits.get(token) || []).filter(t => now - t < windowMs);

    if (timestamps.length >= maxRequests) {
      this.logger.warn(`[Anti-Fraud] Rate limit exceeded for conversion token ${token.slice(0, 8)}...`);
      throw new HttpException('Rate limit exceeded for conversion token', HttpStatus.TOO_MANY_REQUESTS);
    }

    timestamps.push(now);
    this.rateLimits.set(token, timestamps);
  }

  /**
   * Called by storefront when user clicks "Visit Provider Store".
   * Creates a tracking_event and returns the click_id + redirect URL.
   */
  async createEvent(dto: CreateTrackingEventDto, meta: { ip?: string; userAgent?: string; referrer?: string }) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: dto.listingId },
      include: { provider: true },
    });
    if (!listing) throw new NotFoundException('Listing not found');
    if (!listing.redirectUrl) throw new NotFoundException('This listing has no redirect URL');

    const event = await this.prisma.trackingEvent.create({
      data: {
        listingId: listing.id,
        providerId: listing.providerId,
        redirectUrl: listing.redirectUrl,
        ipAddress: meta.ip,
        userAgent: meta.userAgent,
        referrer: meta.referrer,
      },
    });

    return {
      clickId: event.clickId,
      redirectUrl: listing.redirectUrl,
    };
  }

  /**
   * GET /r/:clickId — server-side redirect with click_id appended.
   * Returns the target URL so the controller can 302 redirect.
   */
  async resolveRedirect(clickId: string): Promise<string> {
    const event = await this.prisma.trackingEvent.findUnique({ where: { clickId } });
    if (!event) throw new NotFoundException('Tracking event not found');
    const separator = event.redirectUrl.includes('?') ? '&' : '?';
    return `${event.redirectUrl}${separator}click_id=${clickId}`;
  }

  /**
   * Requirement 3: Anti-fraud conversion attribution.
   * - Requires matching provider conversionToken.
   * - Rate-limited per token.
   * - Order created in PENDING_VERIFICATION (never auto-marked PAID).
   * - Calculates commission for visibility, but does NOT credit payout ledger.
   */
  async recordConversion(dto: ConversionPostbackDto) {
    if (!dto.token) {
      throw new UnauthorizedException('Missing provider conversion token');
    }

    this.checkRateLimit(dto.token);

    const trackingEvent = await this.prisma.trackingEvent.findUnique({
      where: { clickId: dto.clickId },
      include: { provider: true, listing: true },
    });

    if (!trackingEvent) {
      throw new NotFoundException(`Tracking click ID "${dto.clickId}" not found`);
    }

    if (!trackingEvent.provider.conversionToken || trackingEvent.provider.conversionToken !== dto.token) {
      this.logger.warn(`[Anti-Fraud] Invalid conversion token provided for click ID ${dto.clickId}.`);
      throw new UnauthorizedException('Invalid provider conversion token');
    }

    const { rate } = await this.commissionSvc.getRate(trackingEvent.providerId);
    const { commissionAmount, netAmount } = this.commissionSvc.calculateCommission(dto.amount, rate);

    const order = await this.prisma.order.create({
      data: {
        listingId: trackingEvent.listingId,
        providerId: trackingEvent.providerId,
        customerEmail: dto.customerEmail || 'customer@redirect-sale.com',
        customerName: dto.customerName,
        amount: dto.amount,
        currency: dto.currency || trackingEvent.listing.currency || 'USD',
        status: OrderStatus.PENDING_VERIFICATION,
        source: OrderSource.REDIRECT,
        externalReference: dto.orderRef || dto.clickId,
        trackingEventId: trackingEvent.id,
        gatewayUsed: GatewayType.EXTERNAL,
        commissionRate: rate,
        commissionAmount,
        netAmount,
        gatewayMetadata: {
          reportedBy: 'postback_webhook',
          clickId: dto.clickId,
          receivedAt: new Date().toISOString(),
        },
      },
    });

    this.logger.log(`[Attribution Postback] Conversion recorded for click ${dto.clickId} (order ${order.id}) in PENDING_VERIFICATION.`);

    return {
      success: true,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      commissionAmount: order.commissionAmount,
      netAmount: order.netAmount,
    };
  }
}
