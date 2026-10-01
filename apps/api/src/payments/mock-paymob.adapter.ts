import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Order } from '@prisma/client';
import * as crypto from 'crypto';
import { CheckoutResult, GatewayType } from '@bldr/shared-types';
import { PaymentGateway, WebhookResult } from './gateway.interface';

export const SIMULATION_PAYMOB_HMAC = 'sim_paymob_hmac_secret_2026';

@Injectable()
export class MockPaymobAdapter implements PaymentGateway {
  readonly gatewayType = GatewayType.PAYMOB;

  constructor(private config: ConfigService) {}

  async createCheckoutSession(order: Order & { listing?: { title: string } }): Promise<CheckoutResult> {
    return {
      type: 'redirect_url',
      value: `https://accept.paymob.com/api/acceptance/iframes/mock_iframe?payment_token=sim_paymob_${order.id}`,
      gatewayUsed: GatewayType.PAYMOB,
    };
  }

  static buildSignedWebhook(params: {
    orderId: string;
    amountCents: number;
    currency?: string;
    success?: boolean;
    secret?: string;
  }) {
    const secret = params.secret || SIMULATION_PAYMOB_HMAC;
    const isSuccess = params.success !== false;
    const txnId = Math.floor(10000000 + Math.random() * 90000000);

    const obj = {
      id: txnId,
      pending: false,
      amount_cents: params.amountCents,
      success: isSuccess,
      is_auth: false,
      is_capture: false,
      is_standalone_payment: true,
      is_voided: false,
      is_refunded: false,
      is_3d_secure: true,
      integration_id: 4,
      currency: params.currency || 'EGP',
      error_occured: false,
      has_parent_transaction: false,
      created_at: new Date().toISOString(),
      owner: 1001,
      order: {
        id: txnId + 10,
        merchant_order_id: params.orderId,
      },
      source_data: {
        type: 'wallet',
        pan: '01012345678',
        sub_type: 'wallet',
      },
    };

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
      obj.order.id,
      obj.owner,
      obj.pending,
      obj.source_data.pan,
      obj.source_data.sub_type,
      obj.source_data.type,
      obj.success,
    ];

    const concatenated = fields.map((v) => String(v)).join('');
    const hmac = crypto.createHmac('sha512', secret).update(concatenated).digest('hex');

    return {
      type: 'TRANSACTION',
      obj,
      hmac,
    };
  }

  async handleWebhook(payload: unknown, signature: string): Promise<WebhookResult> {
    const p = payload as Record<string, any>;
    const obj = p.obj || p;
    const isSuccess = obj.success === true || obj.success === 'true';
    const isRefunded = obj.is_refunded === true || obj.is_refunded === 'true';

    const orderId =
      obj.merchant_order_id ||
      obj.order?.merchant_order_id ||
      obj.special_reference ||
      obj.order?.id ||
      String(obj.id);

    return {
      orderId: String(orderId),
      status: isRefunded ? 'refunded' : isSuccess ? 'paid' : 'failed',
      gatewayRef: String(obj.id || `sim_pm_${Date.now()}`),
      rawPayload: payload,
    };
  }
}
