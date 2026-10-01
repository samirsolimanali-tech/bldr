import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import * as crypto from 'crypto';
import { GeideaAdapter } from './geidea.adapter';
import { FawryAdapter } from './fawry.adapter';
import { BadRequestException } from '@nestjs/common';

describe('Real Payment Gateway Adapters — Official Specification Verification', () => {
  describe('Real GeideaAdapter — Spec: https://docs.geidea.net/docs/geidea-checkout-v2', () => {
    let adapter: GeideaAdapter;
    const merchantKey = 'geidea-pub-key-test-84920';
    const apiPassword = 'geidea-secret-password-xyz99';
    const baseUrl = 'https://api.merchant.geidea.net';
    const apiBaseUrl = 'https://api.bldr.dev';
    const storefrontUrl = 'https://bldr.store';

    beforeEach(() => {
      const mockConfig = {
        get: (key: string) => {
          switch (key) {
            case 'GEIDEA_MERCHANT_KEY': return merchantKey;
            case 'GEIDEA_API_PASSWORD': return apiPassword;
            case 'GEIDEA_BASE_URL': return baseUrl;
            case 'API_BASE_URL': return apiBaseUrl;
            case 'STOREFRONT_URL': return storefrontUrl;
            case 'NODE_ENV': return 'test';
            case 'ALLOW_INSECURE_WEBHOOK_BYPASS': return 'false';
            default: return undefined;
          }
        },
      } as any;
      adapter = new GeideaAdapter(mockConfig);
    });

    test('request signature matches official HMAC-SHA256 Base64 formula', () => {
      const amount = '150.00';
      const currency = 'EGP';
      const merchantRef = 'ord-geidea-official-001';
      const timestamp = '2026-10-01T12:30:00.000Z';

      // Geidea v2 request signature specification:
      // HMAC-SHA256(publicKey + amount2dp + currency + merchantReferenceId + timestamp)
      // Keyed by apiPassword, encoded as Base64
      const expectedMessage = merchantKey + amount + currency + merchantRef + timestamp;
      const expectedSignature = crypto
        .createHmac('sha256', apiPassword)
        .update(expectedMessage)
        .digest('base64');

      // Access private buildRequestSignature via indexing for test verification
      const actualSignature = (adapter as any).buildRequestSignature(
        amount,
        currency,
        merchantRef,
        timestamp,
      );

      assert.equal(actualSignature, expectedSignature);
      assert.ok(actualSignature.length > 20, 'Signature must be a non-trivial base64 string');
    });

    test('callback signature matches official HMAC-SHA256 Base64 formula', () => {
      const orderAmount = '150.00';
      const orderCurrency = 'EGP';
      const orderId = 'geidea-tx-998877';
      const orderStatus = 'Success';
      const merchantRef = 'ord-geidea-official-001';
      const timestamp = '2026-10-01T12:31:00.000Z';

      // Geidea v2 callback signature specification:
      // HMAC-SHA256(publicKey + orderAmount + orderCurrency + orderId + orderStatus + merchantReferenceId + timestamp)
      // Keyed by apiPassword, encoded as Base64
      const expectedMessage =
        merchantKey + orderAmount + orderCurrency + orderId + orderStatus + merchantRef + timestamp;
      const expectedSignature = crypto
        .createHmac('sha256', apiPassword)
        .update(expectedMessage)
        .digest('base64');

      const actualSignature = (adapter as any).buildCallbackSignature(
        orderAmount,
        orderCurrency,
        orderId,
        orderStatus,
        merchantRef,
        timestamp,
      );

      assert.equal(actualSignature, expectedSignature);
    });

    test('callback verification succeeds with authentic signature and marks status paid', async () => {
      const orderAmount = '250.00';
      const orderCurrency = 'EGP';
      const orderId = 'geidea-tx-12345';
      const orderStatus = 'Success';
      const merchantRef = 'ord-pay-101';
      const timestamp = '2026-10-01T14:00:00.000Z';

      const validSig = (adapter as any).buildCallbackSignature(
        orderAmount,
        orderCurrency,
        orderId,
        orderStatus,
        merchantRef,
        timestamp,
      );

      const payload = {
        order: {
          totalAmount: 250.0,
          currency: orderCurrency,
          id: orderId,
          status: orderStatus,
          merchantReferenceId: merchantRef,
          updatedDate: timestamp,
        },
        signature: validSig,
      };

      const result = await adapter.handleWebhook(payload, validSig);
      assert.equal(result.orderId, merchantRef);
      assert.equal(result.status, 'paid');
      assert.equal(result.gatewayRef, orderId);
    });

    test('callback verification strictly throws BadRequestException on tampered signature', async () => {
      const payload = {
        order: {
          totalAmount: 250.0,
          currency: 'EGP',
          id: 'geidea-tx-12345',
          status: 'Success',
          merchantReferenceId: 'ord-pay-101',
          updatedDate: '2026-10-01T14:00:00.000Z',
        },
        signature: 'tampered-signature-attempt-xyz',
      };

      await assert.rejects(
        async () => {
          await adapter.handleWebhook(payload, 'tampered-signature-attempt-xyz');
        },
        (err: any) => {
          assert.ok(err instanceof BadRequestException);
          assert.match(err.message, /signature mismatch/i);
          return true;
        },
      );
    });

    test('callback verification strictly throws BadRequestException on missing signature', async () => {
      const payload = {
        order: {
          totalAmount: 250.0,
          currency: 'EGP',
          id: 'geidea-tx-12345',
          status: 'Success',
          merchantReferenceId: 'ord-pay-101',
        },
      };

      await assert.rejects(
        async () => {
          await adapter.handleWebhook(payload, '');
        },
        (err: any) => {
          assert.ok(err instanceof BadRequestException);
          assert.match(err.message, /Missing Geidea callback signature/i);
          return true;
        },
      );
    });
  });

  describe('Real FawryAdapter — Official Spec (Server Notification v2)', () => {
    let adapter: FawryAdapter;
    const merchantCode = 'FAWRY_MERCH_77001';
    const securityKey = 'FAWRY_SEC_KEY_SECRET_99';
    const baseUrl = 'https://atfawry.fawrystaging.com';
    const storefrontUrl = 'https://bldr.store';

    beforeEach(() => {
      const mockConfig = {
        get: (key: string) => {
          switch (key) {
            case 'FAWRY_MERCHANT_CODE': return merchantCode;
            case 'FAWRY_SECURITY_KEY': return securityKey;
            case 'FAWRY_BASE_URL': return baseUrl;
            case 'STOREFRONT_URL': return storefrontUrl;
            case 'ALLOW_INSECURE_WEBHOOK_BYPASS': return 'false';
            default: return undefined;
          }
        },
      } as any;
      adapter = new FawryAdapter(mockConfig);
    });

    test('session creation generates signed redirect URL per Fawry hosted checkout spec', async () => {
      const order = {
        id: 'ord-fawry-ref-001',
        amount: 350.0,
        currency: 'EGP',
        customerEmail: 'student@studyhub.eg',
        customerName: 'Kareem Tarek',
      } as any;

      const result = await adapter.createCheckoutSession(order);
      assert.equal(result.type, 'redirect_url');
      assert.ok(result.value.startsWith(baseUrl));

      const parsedUrl = new URL(result.value);
      const params = parsedUrl.searchParams;

      assert.equal(params.get('merchantCode'), merchantCode);
      assert.equal(params.get('merchantRefNum'), order.id);
      assert.equal(params.get('amount'), '350.00');
      assert.equal(params.get('currencyCode'), 'EGP');

      // Verify signature calculation:
      // SHA256(merchantCode + referenceNumber + customerProfileId + returnUrl + cartTotal + currency + lang + securityKey)
      const returnUrl = `${storefrontUrl}/checkout/confirm?order_id=${order.id}`;
      const lang = 'en-gb';
      const expectedInput = `${merchantCode}${order.id}${order.customerEmail}${returnUrl}350.00EGP${lang}${securityKey}`;
      const expectedSig = crypto.createHash('sha256').update(expectedInput).digest('hex');

      assert.equal(params.get('signature'), expectedSig);
    });

    test('callback verification succeeds with authentic Fawry IPN SHA256 signature', async () => {
      const fawryRef = '991283741';
      const merchantRef = 'ord-fawry-ref-001';
      const paymentAmount = '350.00';
      const orderAmount = '350.00';
      const orderStatus = 'PAID';
      const paymentMethod = 'PAYATFAWRY';
      const paymentRef = 'REF-887766';

      // Official Fawry IPN signature formula:
      // SHA256(fawryRefNumber + merchantRefNum + paymentAmount + orderAmount + orderStatus + paymentMethod + paymentRefrenceNumber + securityKey)
      const rawInput = `${fawryRef}${merchantRef}${paymentAmount}${orderAmount}${orderStatus}${paymentMethod}${paymentRef}${securityKey}`;
      const validSig = crypto.createHash('sha256').update(rawInput).digest('hex');

      const payload = {
        fawryRefNumber: fawryRef,
        merchantRefNumber: merchantRef,
        paymentAmount: 350.0,
        orderAmount: 350.0,
        orderStatus,
        paymentMethod,
        paymentRefrenceNumber: paymentRef,
        messageSignature: validSig,
      };

      const result = await adapter.handleWebhook(payload, validSig);
      assert.equal(result.orderId, merchantRef);
      assert.equal(result.status, 'paid');
      assert.equal(result.gatewayRef, fawryRef);
    });

    test('callback verification strictly throws BadRequestException on tampered Fawry signature', async () => {
      const payload = {
        fawryRefNumber: '991283741',
        merchantRefNumber: 'ord-fawry-ref-001',
        paymentAmount: 350.0,
        orderStatus: 'PAID',
        paymentMethod: 'PAYATFAWRY',
        messageSignature: 'bad_tampered_signature_hex_12345',
      };

      await assert.rejects(
        async () => {
          await adapter.handleWebhook(payload, 'bad_tampered_signature_hex_12345');
        },
        (err: any) => {
          assert.ok(err instanceof BadRequestException);
          assert.match(err.message, /Fawry webhook signature mismatch/i);
          return true;
        },
      );
    });

    test('callback verification strictly throws BadRequestException on missing Fawry signature', async () => {
      const payload = {
        fawryRefNumber: '991283741',
        merchantRefNumber: 'ord-fawry-ref-001',
        paymentAmount: 350.0,
      };

      await assert.rejects(
        async () => {
          await adapter.handleWebhook(payload, '');
        },
        (err: any) => {
          assert.ok(err instanceof BadRequestException);
          assert.match(err.message, /Missing Fawry webhook signature/i);
          return true;
        },
      );
    });
  });
});
