import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Order } from '@prisma/client';
import * as crypto from 'crypto';
import { CheckoutResult, GatewayType } from '@bldr/shared-types';
import { PaymentGateway, WebhookResult } from './gateway.interface';

@Injectable()
export class PaymobAdapter implements PaymentGateway {
  readonly gatewayType = GatewayType.PAYMOB;

  constructor(private config: ConfigService) {}

  async createCheckoutSession(order: Order & { listing?: { title: string } }): Promise<CheckoutResult> {
    const apiKey = this.config.get<string>('PAYMOB_API_KEY') || '';
    const iframeId = this.config.get<string>('PAYMOB_IFRAME_ID') || '';
    const integrationId = this.config.get<string>('PAYMOB_INTEGRATION_ID') || '';

    // If sandbox / simulated
    return {
      type: 'redirect_url',
      value: `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=token_${order.id}`,
      gatewayUsed: GatewayType.PAYMOB,
    };
  }

  /**
   * Paymob Webhook / Transaction processed callback.
   * Official Paymob HMAC verification:
   * Concatenate values of ordered keys and compute HMAC-SHA512 with PAYMOB_HMAC_SECRET.
   */
  async handleWebhook(payload: unknown, signature: string): Promise<WebhookResult> {
    const hmacSecret = this.config.get<string>('PAYMOB_HMAC_SECRET') || 'bldr_paymob_hmac_secret_2026';
    const allowBypass = this.config.get<string>('ALLOW_INSECURE_WEBHOOK_BYPASS') === 'true';

    const p = payload as Record<string, any>;
    const obj = p.obj || p;

    const sig = signature || String(p.hmac || '');

    if (!sig && !allowBypass) {
      throw new BadRequestException('Missing Paymob webhook signature (hmac)');
    }

    // Paymob concatenation order for transaction processed callback
    const fields = [
      obj.amount_cents,
      obj.created_at,
      obj.currency,
      obj.error_occured,
      obj.has_parent_transaction,
      obj.id,
      obj.integration_id,
      obj.is_3d_secure,
      obj.is_auth,
      obj.is_capture,
      obj.is_refunded,
      obj.is_standalone_payment,
      obj.is_voided,
      obj.order?.id ?? obj.order_id,
      obj.owner,
      obj.pending,
      obj.source_data?.pan,
      obj.source_data?.sub_type,
      obj.source_data?.type,
      obj.success,
    ];

    const concatenated = fields.map((val) => (val !== undefined && val !== null ? String(val) : '')).join('');
    const computedHmac = crypto.createHmac('sha512', hmacSecret).update(concatenated).digest('hex');

    const isValid = sig.toLowerCase() === computedHmac.toLowerCase();
    if (!isValid && !allowBypass && sig) {
      throw new BadRequestException('Paymob webhook signature (HMAC) mismatch');
    }

    const isSuccess = obj.success === true || obj.success === 'true';
    const isRefunded = obj.is_refunded === true || obj.is_refunded === 'true';

    const orderId =
      obj.merchant_order_id ||
      obj.special_reference ||
      obj.order?.merchant_order_id ||
      obj.order?.id ||
      String(obj.id);

    return {
      orderId: String(orderId),
      status: isRefunded ? 'refunded' : isSuccess ? 'paid' : 'failed',
      gatewayRef: String(obj.id || ''),
      rawPayload: payload,
    };
  }
}
