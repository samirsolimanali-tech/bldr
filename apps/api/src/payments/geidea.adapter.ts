import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Order } from '@prisma/client';
import { CheckoutResult, GatewayType } from '@bldr/shared-types';
import { PaymentGateway, WebhookResult } from './gateway.interface';

/**
 * GeideaAdapter — Phase 1 (modal flow)
 *
 * Flow:
 * 1. POST /api/ams/v1/checkout/session  → returns { session: { id } }
 * 2. Return session.id to frontend
 * 3. Frontend loads geideaCheckout.min.js and calls:
 *    payment.startPayment({ sessionId, onSuccess, onError, onCancel })
 *    which opens the Geidea payment modal on the page (no redirect)
 * 4. Geidea POSTs signed webhook to /webhooks/geidea
 */
@Injectable()
export class GeideaAdapter implements PaymentGateway {
  readonly gatewayType = GatewayType.GEIDEA;

  constructor(private config: ConfigService) {}

  async createCheckoutSession(
    order: Order & { listing?: { title?: string } },
  ): Promise<CheckoutResult> {
    const merchantKey = this.config.get<string>('GEIDEA_MERCHANT_KEY') || '';
    const apiPassword = this.config.get<string>('GEIDEA_API_PASSWORD') || '';
    const baseUrl = this.config.get<string>('GEIDEA_BASE_URL') || 'https://api.merchant.geidea.net';

    // Build Geidea request signature: SHA256(merchantKey + amount2dp + currency + timestamp + apiPassword)
    const amount = Number(order.amount).toFixed(2);
    const timestamp = new Date().toISOString();
    const signatureInput = `${merchantKey}${amount}${order.currency}${timestamp}${apiPassword}`;
    const signature = crypto.createHash('sha256').update(signatureInput).digest('hex');

    const body = {
      amount: Number(amount),
      currency: order.currency,
      timestamp,
      merchantReferenceId: order.id,
      signature,
      language: 'en',
      callbackUrl: `${this.config.get('API_BASE_URL')}/webhooks/geidea`,
      returnUrl: `${this.config.get('STOREFRONT_URL')}/checkout/confirm?order_id=${order.id}`,
      customerEmail: order.customerEmail,
      paymentOperation: 'Pay',
      tokenizationEnabled: false,
    };

    const response = await fetch(`${baseUrl}/api/ams/v1/checkout/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${merchantKey}:${apiPassword}`).toString('base64')}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new BadRequestException(`Geidea session error: ${err}`);
    }

    const data = await response.json() as { session?: { id: string }; responseCode?: string; detailedResponseMessage?: string };

    if (!data.session?.id) {
      throw new BadRequestException(
        `Geidea did not return a session ID: ${data.detailedResponseMessage || JSON.stringify(data)}`,
      );
    }

    return {
      type: 'session_id',
      value: data.session.id,
      gatewayUsed: GatewayType.GEIDEA,
    };
  }

  async handleWebhook(payload: unknown, signature: string): Promise<WebhookResult> {
    const merchantKey = this.config.get<string>('GEIDEA_MERCHANT_KEY') || '';
    const apiPassword = this.config.get<string>('GEIDEA_API_PASSWORD') || '';
    const allowBypass = this.config.get<string>('ALLOW_INSECURE_WEBHOOK_BYPASS') === 'true';

    const p = payload as Record<string, unknown>;
    const sig = signature || String(p.signature || '');

    if (!sig) {
      if (allowBypass) {
        // Development bypass explicitly enabled
      } else {
        throw new BadRequestException('Missing Geidea webhook signature');
      }
    }

    // Official Geidea Callback Signature Scheme:
    // 1. Concatenate { MerchantPublicKey, OrderAmount, OrderCurrency, Orderid, Status, MerchantReferenceId, timeStamp }
    // 2. HMAC-SHA256 hash using MerchantAPIPassword
    // 3. Convert to Base64 (support hex comparison as well)
    const orderObj = (p.order as Record<string, unknown>) || {};
    const orderAmount = String(Number(orderObj.totalAmount ?? p.amount ?? p.orderAmount ?? 0).toFixed(2));
    const orderCurrency = String(orderObj.currency ?? p.currency ?? p.orderCurrency ?? '');
    const orderId = String(orderObj.id ?? p.orderId ?? '');
    const orderStatus = String(orderObj.status ?? p.status ?? p.orderStatus ?? '');
    const merchantRefId = String(p.merchantReferenceId ?? p.merchantRefId ?? orderObj.merchantReferenceId ?? '');
    const timeStamp = String(orderObj.updatedDate ?? p.timestamp ?? p.timeStamp ?? orderObj.creationDate ?? '');

    const concatenated = `${merchantKey}${orderAmount}${orderCurrency}${orderId}${orderStatus}${merchantRefId}${timeStamp}`;
    const expectedBase64 = crypto.createHmac('sha256', apiPassword).update(concatenated).digest('base64');
    const expectedHex = crypto.createHmac('sha256', apiPassword).update(concatenated).digest('hex');

    // Also support fallback canonical string without timestamp if timestamp was omitted by proxy
    const fallbackConcat = `${merchantKey}${orderAmount}${orderCurrency}${merchantRefId}${orderStatus}${apiPassword}`;
    const fallbackHash = crypto.createHash('sha256').update(fallbackConcat).digest('hex');

    const isValid = sig === expectedBase64 || sig === expectedHex || sig === fallbackHash;

    if (!isValid && !allowBypass) {
      throw new BadRequestException('Geidea webhook signature mismatch');
    }

    const isPaid =
      orderStatus.toLowerCase() === 'success' ||
      orderStatus.toLowerCase() === 'paid' ||
      (p.responseCode === '000' && p.detailedResponseCode === '000');

    const status = isPaid ? 'paid' : 'failed';

    return {
      orderId: merchantRefId || orderId,
      status,
      gatewayRef: orderId,
      rawPayload: payload,
    };
  }
}
