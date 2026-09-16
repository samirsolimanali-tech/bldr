import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Order } from '@prisma/client';
import * as crypto from 'crypto';
import { CheckoutResult, GatewayType } from '@bldr/shared-types';
import { PaymentGateway, WebhookResult } from './gateway.interface';
import { SIMULATION_DEV_SECRET } from './mock-geidea.adapter';

export const SIMULATION_FAWRY_MERCHANT_CODE = 'sim_fawry_merchant_001';

@Injectable()
export class MockFawryAdapter implements PaymentGateway {
  readonly gatewayType = GatewayType.FAWRY;

  constructor(private config: ConfigService) {}

  /**
   * Synchronous mock checkout session creation — returns local simulated redirect page.
   */
  async createCheckoutSession(order: Order & { listing?: { title: string } }): Promise<CheckoutResult> {
    const storefrontUrl = this.config.get<string>('STOREFRONT_URL') || 'http://localhost:3000';
    const redirectUrl = `${storefrontUrl}/simulate/fawry-checkout/${order.id}`;

    return {
      type: 'redirect_url',
      value: redirectUrl,
      gatewayUsed: GatewayType.FAWRY,
    };
  }

  /**
   * Helper that builds an authentic Fawry IPN webhook payload signed with the real SHA256 scheme.
   */
  static buildSignedWebhook(params: {
    orderId: string;
    amount: number | string;
    fawryRef?: string;
    status?: 'PAID' | 'FAILED';
    orderAmount?: number | string;
    paymentMethod?: string;
    paymentReferenceNumber?: string;
    securityKey?: string;
    tamper?: boolean;
  }) {
    const securityKey = params.securityKey || SIMULATION_DEV_SECRET;
    const fawryRef = params.fawryRef || `sim_fawry_${params.orderId.slice(-8)}`;
    const paymentAmount = Number(params.amount).toFixed(2);
    const orderAmount = Number(
      params.orderAmount !== undefined ? params.orderAmount : params.amount,
    ).toFixed(2);
    const orderStatus = params.status || 'PAID';
    const paymentMethod = params.paymentMethod || 'PAYATFAWRY';
    const paymentRef = params.paymentReferenceNumber || '';

    // Official Fawry Server Notification / IPN concatenation formula:
    // SHA256(fawryRefNumber + merchantRefNum + paymentAmount(10.00) + orderAmount(10.00) + orderStatus + paymentMethod + paymentRefrenceNumber(if exists) + secureKey)
    // Source: https://developer.fawrystaging.com/docs/server-apis/payment-notifications/server-notification-v2
    const expectedInput = `${fawryRef}${params.orderId}${paymentAmount}${orderAmount}${orderStatus}${paymentMethod}${paymentRef}${securityKey}`;
    let signature = crypto.createHash('sha256').update(expectedInput).digest('hex');

    if (params.tamper) {
      signature = `tampered_invalid_sig_${signature.slice(0, 10)}`;
    }

    const payload = {
      requestId: `sim_req_${Date.now()}`,
      fawryRefNumber: fawryRef,
      merchantRefNumber: params.orderId,
      paymentAmount: parseFloat(paymentAmount),
      orderAmount: parseFloat(orderAmount),
      orderStatus,
      paymentMethod,
      paymentRefrenceNumber: paymentRef || undefined,
      messageSignature: signature,
    };

    return { payload, signature };
  }

  /**
   * Executes the real Fawry signature verification against the simulation secret.
   * Throws BadRequestException on signature mismatch.
   */
  async handleWebhook(payload: unknown, signature: string): Promise<WebhookResult> {
    const securityKey =
      this.config.get<string>('SIMULATION_DEV_SECRET') || SIMULATION_DEV_SECRET;

    const p = payload as Record<string, unknown>;
    const sig = signature || String(p.messageSignature || '');

    if (!sig) {
      throw new BadRequestException('Missing simulated Fawry webhook signature');
    }

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

    if (!isValid) {
      throw new BadRequestException('Simulated Fawry webhook signature mismatch');
    }

    return {
      orderId: merchantRef,
      status: orderStatus === 'PAID' ? 'paid' : 'failed',
      gatewayRef: fawryRef,
      rawPayload: payload,
    };
  }
}
