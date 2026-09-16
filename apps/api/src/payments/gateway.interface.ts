import { Order } from '@prisma/client';
import { CheckoutResult, GatewayType } from '@bldr/shared-types';

export interface WebhookResult {
  orderId: string;
  status: 'paid' | 'failed' | 'refunded';
  gatewayRef: string;
  rawPayload: unknown;
}

/**
 * All payment gateway adapters implement this interface.
 * This keeps gateway-specific code entirely within each adapter —
 * the orders/webhooks modules only talk to this interface.
 */
export interface PaymentGateway {
  readonly gatewayType: GatewayType;

  /**
   * Create a checkout session for the given order.
   * - Geidea: returns { type: 'session_id', value: sessionId } — frontend calls startPayment()
   * - Fawry:  returns { type: 'redirect_url', value: url }    — frontend redirects user
   */
  createCheckoutSession(order: Order & { listing?: { title: string } }): Promise<CheckoutResult>;

  /**
   * Verify gateway webhook signature and parse the result.
   * MUST throw if signature is invalid — never trust unverified payloads.
   */
  handleWebhook(payload: unknown, signature: string): Promise<WebhookResult>;
}
