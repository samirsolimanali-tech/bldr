import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCheckoutSessionDto, ValidatedCheckoutSessionDto } from './checkout-sessions.controller';
import { createHmac, randomBytes } from 'crypto';

// ─── Settlement Calculator ─────────────────────────────────────────────────────

export interface SettlementLineItems {
  grossPiasters: number;
  gatewayFeesPiasters: number;
  platformFeePiasters: number;
  vatOnFeesPiasters: number;
  refundsPiasters: number;
  netPiasters: number;
  reserveHeldPiasters: number;
}

@Injectable()
export class CheckoutSessionsService {
  private readonly logger = new Logger(CheckoutSessionsService.name);

  // In production, API keys would be stored hashed in the DB against a venture.
  // This map is the in-memory representation for Phase 1 development.
  // Format: sk_live_{ventureCode}_{random} or sk_test_{ventureCode}_{random}
  private readonly VENTURE_API_KEYS: Record<string, string> = {
    sk_live_sh_bldr2026:  'SH',
    sk_test_sh_bldr2026:  'SH',
    sk_live_ac_bldr2026:  'AC',
    sk_test_ac_bldr2026:  'AC',
    sk_live_eh_bldr2026:  'EH',
    sk_test_eh_bldr2026:  'EH',
    sk_live_ch_bldr2026:  'CH',
    sk_test_ch_bldr2026:  'CH',
    sk_live_bldr_2026:    'BLDR',
    sk_test_bldr_2026:    'BLDR',
  };

  constructor(private readonly prisma: PrismaService) {}

  // ─── Resolve venture from API key ───────────────────────────────────────────

  private resolveVentureCode(apiKey: string): string {
    const code = this.VENTURE_API_KEYS[apiKey];
    if (!code) {
      throw new UnauthorizedException(
        'Invalid API key. Obtain your secret key from Hub → Venture Configuration → API Keys.',
      );
    }
    return code;
  }

  // ─── Create Checkout Session ─────────────────────────────────────────────────

  async createSession(
    apiKey: string,
    dto: ValidatedCheckoutSessionDto,
    idempotencyKey?: string,
  ) {
    const resolvedVentureCode = this.resolveVentureCode(apiKey);

    // Verify the ventureId in the payload matches the key's venture (case-insensitive)
    if (dto.ventureId.toUpperCase() !== resolvedVentureCode.toUpperCase()) {
      throw new UnauthorizedException(
        `API key is scoped to venture "${resolvedVentureCode}" but request body specifies ventureId="${dto.ventureId}".`,
      );
    }

    // Idempotency check
    if (idempotencyKey) {
      const existing = await (this.prisma as any).checkoutSession.findUnique({
        where: { idempotencyKey },
      });
      if (existing) {
        this.logger.log(`[Idempotency] Returning existing session ${existing.id}`);
        return this.formatSession(existing);
      }
    }

    // Resolve venture record
    const venture = await this.prisma.provider.findFirst({
      where: { slug: resolvedVentureCode.toLowerCase() },
    });

    // Enforce per-brand max transaction amount
    const maxAllowedPiasters = (venture as any)?.maxTransactionAmountPiasters || 5000000; // default 50,000 EGP in minor units
    if (dto.amountPiasters > maxAllowedPiasters) {
      throw new BadRequestException(
        `Transaction amount (${dto.amountPiasters} piasters) exceeds maximum allowed limit for this brand (${maxAllowedPiasters} piasters).`,
      );
    }

    // Validate redirect URLs against brand authorized domains (prevent open redirect vulnerabilities)
    this.validateRedirectUrls(venture, dto.successUrl, dto.cancelUrl);

    const sessionId = `cs_${apiKey.startsWith('sk_live') ? 'live' : 'test'}_${randomBytes(8).toString('hex')}`;
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes expiry
    const session = await (this.prisma as any).checkoutSession.create({
      data: {
        id: sessionId,
        providerId: venture?.id ?? resolvedVentureCode, // fallback for dev
        externalRef: dto.externalRef,
        amountPiasters: dto.amountPiasters,
        currency: dto.currency ?? 'EGP',
        customerName: dto.customer.name,
        customerEmail: dto.customer.email,
        customerPhone: dto.customer.phone,
        lineItems: dto.lineItems as object[],
        metadata: dto.metadata as object ?? {},
        successUrl: dto.successUrl,
        cancelUrl: dto.cancelUrl,
        allowedMethods: dto.paymentMethodsAllowed ?? ['cards', 'wallets', 'fawry'],
        status: 'open',
        expiresAt,
        idempotencyKey: idempotencyKey ?? null,
      },
    });

    this.logger.log(
      `[Checkout Session] Created ${session.id} for venture=${resolvedVentureCode} ` +
      `amount=${dto.amountPiasters}p expires=${expiresAt.toISOString()}`,
    );

    return this.formatSession(session);
  }

  // ─── Get Session ─────────────────────────────────────────────────────────────

  async getSession(apiKey: string, sessionId: string) {
    const ventureCode = this.resolveVentureCode(apiKey);

    const session = await (this.prisma as any).checkoutSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) throw new NotFoundException(`Checkout session ${sessionId} not found.`);

    // Security: session must belong to the requesting venture (data isolation)
    const venture = await this.prisma.provider.findFirst({
      where: { slug: ventureCode.toLowerCase() },
    });
    if (venture && session.providerId !== venture.id) {
      throw new UnauthorizedException(
        `Session ${sessionId} does not belong to venture ${ventureCode}.`,
      );
    }

    return this.formatSession(session);
  }

  // ─── Get Public Session (For Hosted Checkout Page) ───────────────────────────

  async getSessionPublic(sessionId: string) {
    const session = await (this.prisma as any).checkoutSession.findUnique({
      where: { id: sessionId },
      include: { provider: true },
    });

    if (!session) {
      throw new NotFoundException(`Checkout session "${sessionId}" not found.`);
    }

    const venture = session.provider;
    const lineItems = (session.lineItems as any[]) || [];
    const firstItem = lineItems[0] || {};

    return {
      id: session.id,
      status: session.status,
      amountPiasters: session.amountPiasters,
      amountDisplay: `EGP ${(session.amountPiasters / 100).toFixed(2)}`,
      currency: session.currency,
      brandName: venture?.name ?? 'bldr',
      productTitle: firstItem.title ?? 'Course / Service',
      orderRef: session.externalRef ?? `Order ${session.id.slice(-6).toUpperCase()}`,
      customerName: session.customerName,
      customerEmail: session.customerEmail,
      customerPhone: session.customerPhone,
      successUrl: session.successUrl,
      cancelUrl: session.cancelUrl,
      allowedMethods: session.allowedMethods,
      cardWalletGateway: (venture?.cardWalletGateway?.toLowerCase() as 'geidea' | 'paymob') ?? 'geidea',
      fawryEnabled: venture?.fawryEnabled ?? true,
    };
  }

  // ─── Settlement Calculation Engine ─────────────────────────────────────────
  /**
   * Calculates the exact settlement line items for a venture, in integer piasters.
   * Applied in this order:
   *   1. Gross (paid orders in period)
   *   2. − Gateway fees (PSP fees: Paymob/Fawry/etc.)
   *   3. − Platform fee (bldr internal charge, per venture config)
   *   4. − VAT on fees (14% on gateway fees + platform fee)
   *   5. − Refunds issued in period
   *   6. = Net for venture (what brand team sees as their earnings)
   *   7. − Reserve held (5% of gross, released after 14 days)
   *
   * All arithmetic uses integer piasters to avoid floating-point drift.
   */
  calculateSettlement(params: {
    grossPiasters: number;
    gatewayFeeRateBps: number;    // basis points, e.g. 250 = 2.5%
    platformFeeModel: 'PERCENTAGE' | 'FLAT_PER_TXN' | 'COMBINED';
    platformFeePctBps?: number;   // basis points, e.g. 300 = 3%
    platformFeeFlatPiasters?: number; // e.g. 500 = EGP 5.00
    txnCount: number;
    refundsPiasters: number;
    reserveRateBps?: number;      // default 500 = 5%
    vatOnFeesEnabled?: boolean;   // default true — per-brand toggle
    vatRateBps?: number;          // default 1400 = 14% (configurable per brand)
  }): SettlementLineItems {
    const vatEnabled = params.vatOnFeesEnabled !== false;
    const vatBps = params.vatRateBps ?? 1400;
    const reserveBps = params.reserveRateBps ?? 500;

    // 1. Gateway fees (rounded to nearest piaster)
    const gatewayFeesPiasters = Math.round((params.grossPiasters * params.gatewayFeeRateBps) / 10000);

    // 2. Platform fee
    let platformFeePiasters = 0;
    if (params.platformFeeModel === 'PERCENTAGE' && params.platformFeePctBps) {
      platformFeePiasters = Math.round((params.grossPiasters * params.platformFeePctBps) / 10000);
    } else if (params.platformFeeModel === 'FLAT_PER_TXN' && params.platformFeeFlatPiasters) {
      platformFeePiasters = params.platformFeeFlatPiasters * params.txnCount;
    } else if (params.platformFeeModel === 'COMBINED') {
      const pctPart = params.platformFeePctBps
        ? Math.round((params.grossPiasters * params.platformFeePctBps) / 10000)
        : 0;
      const flatPart = params.platformFeeFlatPiasters
        ? params.platformFeeFlatPiasters * params.txnCount
        : 0;
      platformFeePiasters = pctPart + flatPart;
    }

    // 3. VAT on total fees (gateway + platform) — evaluated per brand configuration
    const totalFeesBeforeVat = gatewayFeesPiasters + platformFeePiasters;
    const vatOnFeesPiasters = vatEnabled
      ? Math.round((totalFeesBeforeVat * vatBps) / 10000)
      : 0;

    // 4. Net
    const netPiasters =
      params.grossPiasters
      - gatewayFeesPiasters
      - platformFeePiasters
      - vatOnFeesPiasters
      - params.refundsPiasters;

    // 5. Reserve held (from gross, before deductions — protects bldr's cash position)
    const reserveHeldPiasters = Math.round((params.grossPiasters * reserveBps) / 10000);

    return {
      grossPiasters: params.grossPiasters,
      gatewayFeesPiasters,
      platformFeePiasters,
      vatOnFeesPiasters,
      refundsPiasters: params.refundsPiasters,
      netPiasters,
      reserveHeldPiasters,
    };
  }

  // ─── Sign Outbound Webhook ───────────────────────────────────────────────────
  /**
   * Signs the outbound webhook payload sent to the venture's external LMS.
   * The receiving server must verify: HMAC-SHA256(secret, `t=${timestamp}.${body}`)
   */
  signWebhookPayload(secret: string, timestamp: number, body: string): string {
    const signingInput = `t=${timestamp}.${body}`;
    return createHmac('sha256', secret).update(signingInput).digest('hex');
  }

  buildWebhookSignatureHeader(secret: string, body: string): string {
    const t = Math.floor(Date.now() / 1000);
    const v1 = this.signWebhookPayload(secret, t, body);
    return `t=${t},v1=${v1}`;
  }

  // ─── Complete Session & Dispatch Outbound Webhook ─────────────────────────────
  async completeSession(sessionId: string, paymentMethod: string = 'card') {
    const session = await (this.prisma as any).checkoutSession.findUnique({
      where: { id: sessionId },
      include: { provider: true },
    });

    if (!session) {
      throw new NotFoundException(`Checkout session ${sessionId} not found.`);
    }

    if (session.status === 'completed' || session.status === 'paid') {
      return { success: true, alreadyCompleted: true, session: this.formatSession(session) };
    }

    // 1. Mark session completed
    await (this.prisma as any).checkoutSession.update({
      where: { id: sessionId },
      data: { status: 'completed' },
    });

    const venture = session.provider;
    const webhookUrl = venture?.externalWebhookUrl || 'http://localhost:3000/api/webhooks/bldr-payments';
    const webhookSecret = venture?.externalWebhookSecret || 'whsec_test_bldr_pilot_2026';

    const orderId = session.externalRef || `bldr_ord_${Date.now()}`;
    const amountEgp = session.amountPiasters / 100;

    // 2. Upsert Order in database so ledger / balances / settlement statement include it
    try {
      const existingOrder = await this.prisma.order.findUnique({ where: { id: orderId } });
      if (!existingOrder) {
        const listing = await this.prisma.listing.findFirst({
          where: { providerId: venture?.id },
        });

        if (listing) {
          await this.prisma.order.create({
            data: {
              id: orderId,
              listingId: listing.id,
              providerId: venture?.id || session.providerId,
              customerEmail: session.customerEmail,
              customerName: session.customerName || 'Valued Learner',
              amount: amountEgp,
              currency: session.currency || 'EGP',
              status: 'PAID',
              gatewayUsed: paymentMethod === 'kiosk' ? 'FAWRY' : 'GEIDEA',
              checkoutSessionId: session.id,
            },
          });
        }
      } else {
        await this.prisma.order.update({
          where: { id: orderId },
          data: { status: 'PAID' },
        });
      }
    } catch (dbErr: any) {
      this.logger.warn(`[Checkout Completion] Order upsert notice: ${dbErr?.message || dbErr}`);
    }

    // 3. Dispatch outbound webhook to the venture's LMS / Storefront with retry
    const webhookPayload = {
      id: `evt_${Date.now()}_${randomBytes(4).toString('hex')}`,
      object: 'event',
      type: 'checkout.session.completed',
      event: 'checkout.session.completed',
      created_at: new Date().toISOString(),
      data: {
        session_id: session.id,
        order_id: orderId,
        amount_piasters: session.amountPiasters,
        amount_egp: amountEgp,
        currency: session.currency,
        customer_email: session.customerEmail,
        customer_name: session.customerName,
        payment_method: paymentMethod,
        routing_gateway: venture?.cardWalletGateway || 'GEIDEA',
        status: 'paid',
        metadata: session.metadata,
      },
    };

    await this.dispatchWebhookWithRetry(webhookUrl, webhookPayload, webhookSecret);

    return {
      success: true,
      status: 'completed',
      sessionId: session.id,
      orderId,
      dispatchedTo: webhookUrl,
    };
  }

  // ─── Dispatch Webhook with Exponential Backoff ─────────────────────────────────
  private async dispatchWebhookWithRetry(url: string, payload: any, secret: string, maxRetries = 3): Promise<boolean> {
    const rawBody = JSON.stringify(payload);
    const sigHeader = this.buildWebhookSignatureHeader(secret, rawBody);

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        this.logger.log(`[Outbound Webhook] Dispatching ${payload.type} (Attempt ${attempt}/${maxRetries}) to ${url}`);
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-BLDR-Signature': sigHeader,
            'User-Agent': 'bldr-Payment-Hub/1.0',
          },
          body: rawBody,
        });

        if (res.ok) {
          this.logger.log(`[Outbound Webhook] Successfully delivered ${payload.type} (HTTP ${res.status})`);
          return true;
        }
        this.logger.warn(`[Outbound Webhook] Attempt ${attempt} failed with HTTP ${res.status}`);
      } catch (err: any) {
        this.logger.warn(`[Outbound Webhook] Attempt ${attempt} error: ${err.message}`);
      }

      if (attempt < maxRetries) {
        const delayMs = attempt * 1000;
        await new Promise(r => setTimeout(r, delayMs));
      }
    }
    this.logger.error(`[Outbound Webhook] All ${maxRetries} delivery attempts failed for ${url}`);
    return false;
  }

  // ─── Validate Redirect URLs Against Brand Whitelist ──────────────────────────
  private validateRedirectUrls(venture: any, successUrl: string, cancelUrl: string) {
    if (!successUrl || !cancelUrl) {
      throw new BadRequestException('Both successUrl and cancelUrl are required.');
    }

    const allowedHosts = new Set<string>([
      'localhost',
      '127.0.0.1',
      'bldr.store',
      'studyhub.eg',
      'app.studyhub.eg',
      'apexclasses.eg',
      'elhesa.eg',
      'careerhub.eg',
      ...(venture?.allowedOrigins || []),
      ...(venture?.domains ? venture.domains.map((d: any) => typeof d === 'string' ? d : d.host) : []),
    ]);

    for (const urlStr of [successUrl, cancelUrl]) {
      try {
        const parsed = new URL(urlStr);
        const host = parsed.hostname.toLowerCase();
        const isAllowed = Array.from(allowedHosts).some(allowed => {
          const a = allowed.toLowerCase().replace(/^https?:\/\//, '').split('/')[0].split(':')[0];
          return host === a || host.endsWith(`.${a}`);
        });

        if (!isAllowed) {
          throw new BadRequestException(
            `Redirect domain "${parsed.hostname}" is not authorized for this brand. Register authorized domains in Hub Venture Configuration to prevent open redirect vulnerabilities.`,
          );
        }
      } catch (err: any) {
        if (err instanceof BadRequestException) throw err;
        throw new BadRequestException(`Invalid redirect URL: "${urlStr}". Must be a valid absolute HTTP/HTTPS URL.`);
      }
    }
  }

  // ─── Refund & Dispute Webhook Notifications ─────────────────────────────────
  async dispatchRefundWebhook(ventureId: string, orderId: string, refundAmountPiasters: number, reason: string) {
    const venture = await this.prisma.provider.findFirst({ where: { slug: ventureId.toLowerCase() } });
    if (!venture?.externalWebhookUrl) return false;

    const payload = {
      id: `evt_rf_${Date.now()}_${randomBytes(4).toString('hex')}`,
      object: 'event',
      type: 'refund.created',
      event: 'refund.created',
      created_at: new Date().toISOString(),
      data: {
        order_id: orderId,
        refund_amount_piasters: refundAmountPiasters,
        refund_amount_egp: refundAmountPiasters / 100,
        currency: 'EGP',
        reason,
        status: 'refunded',
      },
    };
    return this.dispatchWebhookWithRetry(venture.externalWebhookUrl, payload, venture.externalWebhookSecret || 'whsec_test_bldr_pilot_2026');
  }

  async dispatchDisputeWebhook(ventureId: string, orderId: string, disputeRef: string, reason: string) {
    const venture = await this.prisma.provider.findFirst({ where: { slug: ventureId.toLowerCase() } });
    if (!venture?.externalWebhookUrl) return false;

    const payload = {
      id: `evt_dsp_${Date.now()}_${randomBytes(4).toString('hex')}`,
      object: 'event',
      type: 'dispute.created',
      event: 'dispute.created',
      created_at: new Date().toISOString(),
      data: {
        order_id: orderId,
        dispute_ref: disputeRef,
        reason,
        status: 'under_review',
      },
    };
    return this.dispatchWebhookWithRetry(venture.externalWebhookUrl, payload, venture.externalWebhookSecret || 'whsec_test_bldr_pilot_2026');
  }

  // ─── Format ──────────────────────────────────────────────────────────────────

  private formatSession(session: {
    id: string;
    status: string;
    amountPiasters: number;
    currency: string;
    expiresAt: Date;
    customerEmail: string;
    externalRef: string | null;
  }) {
    const env = session.id.startsWith('cs_live') ? 'live' : 'test';
    return {
      id: session.id,
      object: 'checkout.session',
      livemode: env === 'live',
      status: session.status,
      checkout_url: `${process.env.HUB_BASE_URL ?? 'http://localhost:3003'}/pay/${session.id}`,
      amount_piasters: session.amountPiasters,
      amount_display: `EGP ${(session.amountPiasters / 100).toFixed(2)}`,
      currency: session.currency,
      customer_email: session.customerEmail,
      external_ref: session.externalRef,
      expires_at: session.expiresAt.toISOString(),
    };
  }
}
