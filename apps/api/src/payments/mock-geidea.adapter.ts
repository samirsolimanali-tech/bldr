import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Order } from '@prisma/client';
import * as crypto from 'crypto';
import { CheckoutResult, GatewayType } from '@bldr/shared-types';
import { PaymentGateway, WebhookResult } from './gateway.interface';

export const SIMULATION_DEV_SECRET = 'bldr_sim_dev_secret_key_2026';
export const SIMULATION_MERCHANT_KEY = 'sim_merchant_pub_key_001';

@Injectable()
export class MockGeideaAdapter implements PaymentGateway {
  readonly gatewayType = GatewayType.GEIDEA;

  constructor(private config: ConfigService) {}

  /**
   * Synchronous mock checkout session creation — zero external network requests.
   */
  async createCheckoutSession(order: Order & { listing?: { title: string } }): Promise<CheckoutResult> {
    const sessionId = `sim_geidea_sess_${order.id}`;
    return {
      type: 'session_id',
      value: sessionId,
      gatewayUsed: GatewayType.GEIDEA,
    };
  }

  /**
   * Helper that builds an authentic Geidea webhook payload signed with the real HMAC-SHA256 algorithm.
   */
  static buildSignedWebhook(params: {
    orderId: string;
    amount: number | string;
    currency?: string;
    status?: 'paid' | 'failed';
    merchantKey?: string;
    secretKey?: string;
    tamper?: boolean;
    timestamp?: string;
  }) {
    const merchantKey = params.merchantKey || SIMULATION_MERCHANT_KEY;
    const secretKey = params.secretKey || SIMULATION_DEV_SECRET;
    const orderAmount = Number(params.amount).toFixed(2);
    const orderCurrency = params.currency || 'USD';
    const geideaStatus = params.status === 'failed' ? 'Failed' : 'Success';
    const timestamp = params.timestamp || new Date().toISOString();
    const geideaOrderId = `sim_gid_${params.orderId.slice(-8)}`;

    const payload = {
      order: {
        id: geideaOrderId,
        totalAmount: parseFloat(orderAmount),
        currency: orderCurrency,
        status: geideaStatus,
        merchantReferenceId: params.orderId,
        updatedDate: timestamp,
      },
      responseCode: geideaStatus === 'Success' ? '000' : '100',
      detailedResponseCode: geideaStatus === 'Success' ? '000' : '100',
      timestamp,
    };

    // Canonical Geidea concatenation:
    // MerchantPublicKey + OrderAmount + OrderCurrency + Orderid + Status + MerchantReferenceId + timeStamp
    const concatenated = `${merchantKey}${orderAmount}${orderCurrency}${geideaOrderId}${geideaStatus}${params.orderId}${timestamp}`;
    let signature = crypto.createHmac('sha256', secretKey).update(concatenated).digest('base64');

    if (params.tamper) {
      signature = `tampered_invalid_sig_${signature.slice(0, 10)}`;
    }

    return { payload, signature };
  }

  /**
   * Executes the real Geidea signature verification against the simulation secret.
   * Throws BadRequestException on signature mismatch.
   */
  async handleWebhook(payload: unknown, signature: string): Promise<WebhookResult> {
    const merchantKey =
      this.config.get<string>('SIMULATION_MERCHANT_KEY') || SIMULATION_MERCHANT_KEY;
    const apiPassword =
      this.config.get<string>('SIMULATION_DEV_SECRET') || SIMULATION_DEV_SECRET;

    const p = payload as Record<string, unknown>;
    const sig = signature || String(p.signature || '');

    if (!sig) {
      throw new BadRequestException('Missing simulated Geidea webhook signature');
    }

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

    const isValid = sig === expectedBase64 || sig === expectedHex;

    if (!isValid) {
      throw new BadRequestException('Simulated Geidea webhook signature mismatch');
    }

    const isPaid =
      orderStatus.toLowerCase() === 'success' ||
      orderStatus.toLowerCase() === 'paid' ||
      (p.responseCode === '000' && p.detailedResponseCode === '000');

    return {
      orderId: merchantRefId || orderId,
      status: isPaid ? 'paid' : 'failed',
      gatewayRef: orderId,
      rawPayload: payload,
    };
  }
}
