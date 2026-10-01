import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
  Optional,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GatewayFactory } from '../payments/gateway.factory';
import { OrdersService } from '../orders/orders.service';
import { CheckoutSessionsService } from '../checkout/checkout-sessions.service';
import { GatewayType } from '@bldr/shared-types';

export interface InboundWebhookRecord {
  id: string;
  gateway: 'GEIDEA' | 'PAYMOB' | 'FAWRY' | 'UNKNOWN';
  receivedAt: string;
  signatureValid: boolean;
  gatewayRef?: string;
  orderId?: string;
  status: 'PROCESSED' | 'DUPLICATE' | 'FAILED' | 'INVALID_SIGNATURE';
  error?: string;
  rawPayload: any;
  headers?: Record<string, string>;
}

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  // Inbound webhook forensic log store (capped at 200 recent events)
  private inboundLogs: InboundWebhookRecord[] = [];

  // Memory cache of processed gateway references for high-throughput deduplication
  private processedGatewayRefs = new Map<
    string,
    { status: string; processedAt: string; orderId: string }
  >();

  constructor(
    private prisma: PrismaService,
    private gatewayFactory: GatewayFactory,
    private ordersService: OrdersService,
    @Optional() private checkoutSessionsService?: CheckoutSessionsService,
  ) {}

  // ─── 1. Geidea Inbound Webhook ──────────────────────────────────────────────
  async handleGeidea(
    payload: unknown,
    rawBody: Buffer,
    headers: Record<string, string> = {},
  ) {
    const signature = headers['signature'] || headers['x-geidea-signature'] || '';
    const logId = `wh_in_geidea_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const logRecord: InboundWebhookRecord = {
      id: logId,
      gateway: 'GEIDEA',
      receivedAt: new Date().toISOString(),
      signatureValid: false,
      status: 'FAILED',
      rawPayload: payload,
      headers: { ...headers },
    };

    const adapter = this.gatewayFactory.getAdapter(GatewayType.GEIDEA);

    let result: {
      orderId: string;
      status: 'paid' | 'failed' | 'refunded';
      gatewayRef: string;
      rawPayload: unknown;
    };

    try {
      result = await adapter.handleWebhook(payload, signature);
      logRecord.signatureValid = true;
      logRecord.orderId = result.orderId;
      logRecord.gatewayRef = result.gatewayRef;
    } catch (err: any) {
      logRecord.status = 'INVALID_SIGNATURE';
      logRecord.error = err?.message || 'Invalid Geidea signature';
      this.recordInboundLog(logRecord);
      this.logger.warn(`[Webhook Security] Rejected Geidea webhook: ${logRecord.error}`);
      throw new BadRequestException(`Geidea webhook rejected: ${logRecord.error}`);
    }

    return this.processConsolidatedWebhook(result, logRecord);
  }

  // ─── 2. Paymob Inbound Webhook ──────────────────────────────────────────────
  async handlePaymob(
    payload: unknown,
    rawBody: Buffer,
    headers: Record<string, string> = {},
  ) {
    const p = payload as Record<string, any>;
    const signature = headers['hmac'] || headers['x-paymob-hmac'] || p?.hmac || '';
    const logId = `wh_in_paymob_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const logRecord: InboundWebhookRecord = {
      id: logId,
      gateway: 'PAYMOB',
      receivedAt: new Date().toISOString(),
      signatureValid: false,
      status: 'FAILED',
      rawPayload: payload,
      headers: { ...headers },
    };

    const adapter = this.gatewayFactory.getAdapter(GatewayType.PAYMOB);

    let result: {
      orderId: string;
      status: 'paid' | 'failed' | 'refunded';
      gatewayRef: string;
      rawPayload: unknown;
    };

    try {
      result = await adapter.handleWebhook(payload, signature);
      logRecord.signatureValid = true;
      logRecord.orderId = result.orderId;
      logRecord.gatewayRef = result.gatewayRef;
    } catch (err: any) {
      logRecord.status = 'INVALID_SIGNATURE';
      logRecord.error = err?.message || 'Invalid Paymob signature';
      this.recordInboundLog(logRecord);
      this.logger.warn(`[Webhook Security] Rejected Paymob webhook: ${logRecord.error}`);
      throw new BadRequestException(`Paymob webhook rejected: ${logRecord.error}`);
    }

    return this.processConsolidatedWebhook(result, logRecord);
  }

  // ─── 3. Fawry Inbound Webhook ───────────────────────────────────────────────
  async handleFawry(
    payload: unknown,
    rawBody: Buffer,
    headers: Record<string, string> = {},
  ) {
    const p = payload as Record<string, unknown>;
    const signature = String(p.messageSignature || headers['signature'] || '');
    const logId = `wh_in_fawry_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const logRecord: InboundWebhookRecord = {
      id: logId,
      gateway: 'FAWRY',
      receivedAt: new Date().toISOString(),
      signatureValid: false,
      status: 'FAILED',
      rawPayload: payload,
      headers: { ...headers },
    };

    const adapter = this.gatewayFactory.getAdapter(GatewayType.FAWRY);

    let result: {
      orderId: string;
      status: 'paid' | 'failed' | 'refunded';
      gatewayRef: string;
      rawPayload: unknown;
    };

    try {
      result = await adapter.handleWebhook(payload, signature);
      logRecord.signatureValid = true;
      logRecord.orderId = result.orderId;
      logRecord.gatewayRef = result.gatewayRef;
    } catch (err: any) {
      logRecord.status = 'INVALID_SIGNATURE';
      logRecord.error = err?.message || 'Invalid Fawry signature';
      this.recordInboundLog(logRecord);
      this.logger.warn(`[Webhook Security] Rejected Fawry webhook: ${logRecord.error}`);
      throw new BadRequestException(`Fawry webhook rejected: ${logRecord.error}`);
    }

    return this.processConsolidatedWebhook(result, logRecord);
  }

  // ─── 4. Unified Gateway Webhook Dispatcher ──────────────────────────────────
  async handleUnified(
    gatewayName: string | undefined,
    payload: unknown,
    rawBody: Buffer,
    headers: Record<string, string> = {},
  ) {
    const p = payload as Record<string, any>;
    const g = (gatewayName || headers['x-payment-gateway'] || '').toUpperCase();

    if (g === 'GEIDEA' || p?.order?.merchantReferenceId) {
      return this.handleGeidea(payload, rawBody, headers);
    }
    if (g === 'PAYMOB' || p?.obj?.integration_id || p?.hmac) {
      return this.handlePaymob(payload, rawBody, headers);
    }
    if (g === 'FAWRY' || p?.fawryRefNumber || p?.messageSignature) {
      return this.handleFawry(payload, rawBody, headers);
    }

    // Default fallback: Try Geidea
    return this.handleGeidea(payload, rawBody, headers);
  }

  // ─── 5. Consolidated Processing & Idempotency Pipeline ──────────────────────
  private async processConsolidatedWebhook(
    result: {
      orderId: string;
      status: 'paid' | 'failed' | 'refunded';
      gatewayRef: string;
      rawPayload: unknown;
    },
    logRecord: InboundWebhookRecord,
  ) {
    const dedupKey = `${result.orderId}_${result.gatewayRef}_${result.status}`;

    // A. Memory Idempotency Check
    if (this.processedGatewayRefs.has(dedupKey)) {
      this.logger.log(
        `[Webhook Idempotency] Duplicate callback detected for order ${result.orderId} (Ref: ${result.gatewayRef}). Skipping execution.`,
      );
      logRecord.status = 'DUPLICATE';
      this.recordInboundLog(logRecord);
      return { received: true, idempotent: true, orderId: result.orderId };
    }

    // B. Database Idempotency Check
    try {
      const existingTxn = await this.prisma.transaction.findFirst({
        where: {
          orderId: result.orderId,
          gatewayRef: result.gatewayRef,
        },
      });

      if (existingTxn) {
        this.logger.log(
          `[Webhook Idempotency] Transaction ${result.gatewayRef} already persisted for order ${result.orderId}. Returning idempotent 200.`,
        );
        this.processedGatewayRefs.set(dedupKey, {
          status: result.status,
          processedAt: new Date().toISOString(),
          orderId: result.orderId,
        });
        logRecord.status = 'DUPLICATE';
        this.recordInboundLog(logRecord);
        return { received: true, idempotent: true, orderId: result.orderId };
      }
    } catch (e) {
      // Non-blocking DB check error; proceed to process
    }

    // C. Persist Transaction Record in DB
    try {
      await this.prisma.transaction.create({
        data: {
          orderId: result.orderId,
          rawPayload: (result.rawPayload || {}) as object,
          signatureValid: true,
          gatewayRef: result.gatewayRef,
        },
      });
    } catch (err: any) {
      this.logger.warn(`Failed to create transaction record: ${err?.message}`);
    }

    // D. State Transition & Order Fulfillment
    try {
      if (result.status === 'paid') {
        await this.ordersService.markPaid(result.orderId);
        this.logger.log(`Order ${result.orderId} successfully marked PAID`);

        // If checkout session is active, complete it and dispatch signed outbound webhook
        if (this.checkoutSessionsService) {
          try {
            await this.checkoutSessionsService.completeSession(result.orderId);
          } catch (csErr) {
            // Might be a native order or already completed; non-fatal
          }
        }
      } else if (result.status === 'failed') {
        await this.ordersService.markFailed(result.orderId);
        this.logger.warn(`Order ${result.orderId} marked FAILED`);
      }

      this.processedGatewayRefs.set(dedupKey, {
        status: result.status,
        processedAt: new Date().toISOString(),
        orderId: result.orderId,
      });

      logRecord.status = 'PROCESSED';
      this.recordInboundLog(logRecord);

      return {
        received: true,
        orderId: result.orderId,
        status: result.status,
        gatewayRef: result.gatewayRef,
      };
    } catch (procErr: any) {
      logRecord.status = 'FAILED';
      logRecord.error = procErr?.message || 'Error executing order transition';
      this.recordInboundLog(logRecord);
      this.logger.error(`[Webhook Processing Error] ${logRecord.error}`, procErr?.stack);
      throw procErr;
    }
  }

  // ─── 6. Inbound Webhook Inspection & Replay (Section 3d) ───────────────────
  private recordInboundLog(record: InboundWebhookRecord) {
    this.inboundLogs.unshift(record);
    if (this.inboundLogs.length > 200) {
      this.inboundLogs.pop();
    }
  }

  getInboundLogs(filter?: { gateway?: string; status?: string }) {
    let logs = this.inboundLogs;
    if (filter?.gateway && filter.gateway !== 'ALL') {
      logs = logs.filter((l) => l.gateway.toUpperCase() === filter.gateway?.toUpperCase());
    }
    if (filter?.status && filter.status !== 'ALL') {
      logs = logs.filter((l) => l.status.toUpperCase() === filter.status?.toUpperCase());
    }
    return {
      total: logs.length,
      logs,
    };
  }

  async replayInboundWebhook(logId: string) {
    const log = this.inboundLogs.find((l) => l.id === logId);
    if (!log) {
      throw new NotFoundException(`Inbound webhook log ${logId} not found`);
    }

    this.logger.log(`[Webhook Replay] Re-executing inbound webhook ${logId} (${log.gateway})`);

    // Remove from in-memory dedup so replay can execute
    if (log.orderId && log.gatewayRef) {
      this.processedGatewayRefs.delete(`${log.orderId}_${log.gatewayRef}_paid`);
      this.processedGatewayRefs.delete(`${log.orderId}_${log.gatewayRef}_failed`);
    }

    const rawBuf = Buffer.from(JSON.stringify(log.rawPayload || {}));

    if (log.gateway === 'GEIDEA') {
      return this.handleGeidea(log.rawPayload, rawBuf, log.headers || {});
    }
    if (log.gateway === 'PAYMOB') {
      return this.handlePaymob(log.rawPayload, rawBuf, log.headers || {});
    }
    if (log.gateway === 'FAWRY') {
      return this.handleFawry(log.rawPayload, rawBuf, log.headers || {});
    }

    return this.handleUnified(log.gateway, log.rawPayload, rawBuf, log.headers || {});
  }
}
