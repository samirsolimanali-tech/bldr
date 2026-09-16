import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Order } from '@prisma/client';
import { CheckoutResult, GatewayType } from '@bldr/shared-types';
import { PaymentGateway, WebhookResult } from './gateway.interface';

/**
 * FawryAdapter — Phase 1 (Hosted Checkout Link)
 *
 * Flow:
 * 1. Build a signed Fawry hosted-checkout URL
 * 2. Return { type: 'redirect_url', value: url } to frontend
 * 3. Frontend redirects user to Fawry's payment page (no PCI scope on our end)
 * 4. Fawry sends signed IPN (Instant Payment Notification) to /webhooks/fawry
 *
 * Phase 2 option: Replace with Fawry's self-hosted button (requires PCI-DSS approval).
 * The interface stays identical — only this adapter changes.
 */
@Injectable()
export class FawryAdapter implements PaymentGateway {
  readonly gatewayType = GatewayType.FAWRY;

  constructor(private config: ConfigService) {}

  async createCheckoutSession(
    order: Order & { listing?: { title?: string } },
  ): Promise<CheckoutResult> {
    const merchantCode = this.config.get<string>('FAWRY_MERCHANT_CODE') || '';
    const securityKey = this.config.get<string>('FAWRY_SECURITY_KEY') || '';
    const baseUrl =
      this.config.get<string>('FAWRY_BASE_URL') || 'https://atfawry.fawrystaging.com';
    const storefrontUrl = this.config.get<string>('STOREFRONT_URL') || 'http://localhost:3000';

    const amount = Number(order.amount).toFixed(2);
    const referenceNumber = order.id;

    // Fawry signature: SHA256(merchantCode + referenceNumber + customerProfileId + returnUrl + cartTotal + currency + lang + securityKey)
    // For hosted link, customerProfileId can be empty or customer email
    const returnUrl = `${storefrontUrl}/checkout/confirm?order_id=${order.id}`;
    const lang = 'en-gb';
    const signatureInput = `${merchantCode}${referenceNumber}${order.customerEmail}${returnUrl}${amount}${order.currency}${lang}${securityKey}`;
    const signature = crypto.createHash('sha256').update(signatureInput).digest('hex');

    const params = new URLSearchParams({
      merchantCode,
      merchantRefNum: referenceNumber,
      customerName: order.customerName || order.customerEmail,
      customerEmail: order.customerEmail,
      amount,
      currencyCode: order.currency,
      language: lang,
      returnUrl,
      paymentMethod: 'ALL',
      signature,
    });

    const redirectUrl = `${baseUrl}/ECommerceWeb/Fawry/payments/charge?${params.toString()}`;

    return {
      type: 'redirect_url',
      value: redirectUrl,
      gatewayUsed: GatewayType.FAWRY,
    };
  }

  async handleWebhook(payload: unknown, signature: string): Promise<WebhookResult> {
    const securityKey = this.config.get<string>('FAWRY_SECURITY_KEY') || '';
    const allowBypass = this.config.get<string>('ALLOW_INSECURE_WEBHOOK_BYPASS') === 'true';

    const p = payload as Record<string, unknown>;
    const sig = signature || String(p.messageSignature || '');

    if (!sig) {
      if (allowBypass) {
        // Development bypass explicitly enabled
      } else {
        throw new BadRequestException('Missing Fawry webhook signature');
      }
    }

    // Official Fawry Server Notification / IPN signature formula:
    // SHA256(fawryRefNumber + merchantRefNum + paymentAmount(10.00) + orderAmount(10.00) + orderStatus + paymentMethod + paymentRefrenceNumber(if exists) + secureKey)
    // Source: https://developer.fawrystaging.com/docs/server-apis/payment-notifications/server-notification-v2
    const fawryRef = String(p.fawryRefNumber || '');
    const merchantRef = String(p.merchantRefNumber ?? p.merchantRefNum ?? '');
    const paymentAmount = Number(p.paymentAmount || 0).toFixed(2);
    const orderAmount = Number(
      p.orderAmount !== undefined && p.orderAmount !== null ? p.orderAmount : p.paymentAmount || 0,
    ).toFixed(2);
    const orderStatus = String(p.orderStatus || '');
    const paymentMethod = String(p.paymentMethod || '');
    const paymentRef = String(p.paymentRefrenceNumber ?? p.paymentReferenceNumber ?? '');

    const expectedInput = `${fawryRef}${merchantRef}${paymentAmount}${orderAmount}${orderStatus}${paymentMethod}${paymentRef}${securityKey}`;
    const expectedSha256 = crypto.createHash('sha256').update(expectedInput).digest('hex');

    const isValid = sig.toLowerCase() === expectedSha256.toLowerCase();

    if (!isValid && !allowBypass) {
      throw new BadRequestException('Fawry webhook signature mismatch');
    }

    const status =
      orderStatus === 'PAID' ? 'paid' : orderStatus === 'FAILED' ? 'failed' : 'failed';

    return {
      orderId: merchantRef,
      status,
      gatewayRef: fawryRef,
      rawPayload: payload,
    };
  }
}
