import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GatewayFactory } from '../payments/gateway.factory';
import { OrdersService } from '../orders/orders.service';
import { GatewayType } from '@bldr/shared-types';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private prisma: PrismaService,
    private gatewayFactory: GatewayFactory,
    private ordersService: OrdersService,
  ) {}

  async handleGeidea(payload: unknown, rawBody: Buffer, headers: Record<string, string>) {
    // Geidea sends the signature in the Signature header
    const signature = headers['signature'] || headers['x-geidea-signature'] || '';

    const adapter = this.gatewayFactory.getAdapter(GatewayType.GEIDEA);

    let result: { orderId: string; status: 'paid' | 'failed' | 'refunded'; gatewayRef: string; rawPayload: unknown };
    try {
      result = await adapter.handleWebhook(payload, signature);
    } catch (err: any) {
      this.logger.warn(`[Webhook Security] Rejected Geidea webhook: ${err?.message || err}`);
      throw new BadRequestException(`Geidea webhook rejected: ${err?.message || 'Invalid signature'}`);
    }

    // Log raw transaction
    await this.prisma.transaction.create({
      data: {
        orderId: result.orderId,
        rawPayload: payload as object,
        signatureValid: true,
        gatewayRef: result.gatewayRef,
      },
    });

    await this.processResult(result);
    return { received: true };
  }

  async handleFawry(payload: unknown, rawBody: Buffer, headers: Record<string, string>) {
    // Fawry sends the signature in the messageSignature field of the body
    const p = payload as Record<string, unknown>;
    const signature = String(p.messageSignature || headers['signature'] || '');

    const adapter = this.gatewayFactory.getAdapter(GatewayType.FAWRY);

    let result: { orderId: string; status: 'paid' | 'failed' | 'refunded'; gatewayRef: string; rawPayload: unknown };
    try {
      result = await adapter.handleWebhook(payload, signature);
    } catch (err: any) {
      this.logger.warn(`[Webhook Security] Rejected Fawry webhook: ${err?.message || err}`);
      throw new BadRequestException(`Fawry webhook rejected: ${err?.message || 'Invalid signature'}`);
    }

    await this.prisma.transaction.create({
      data: {
        orderId: result.orderId,
        rawPayload: payload as object,
        signatureValid: true,
        gatewayRef: result.gatewayRef,
      },
    });

    await this.processResult(result);
    return { received: true };
  }

  private async processResult(result: { orderId: string; status: 'paid' | 'failed' | 'refunded' }) {
    if (result.status === 'paid') {
      await this.ordersService.markPaid(result.orderId);
      this.logger.log(`Order ${result.orderId} marked PAID`);
    } else {
      await this.ordersService.markFailed(result.orderId);
      this.logger.warn(`Order ${result.orderId} marked FAILED`);
    }
  }
}
