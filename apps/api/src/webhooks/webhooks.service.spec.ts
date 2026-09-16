import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import * as crypto from 'crypto';
import { WebhooksService } from './webhooks.service';
import { GeideaAdapter } from '../payments/geidea.adapter';
import { FawryAdapter } from '../payments/fawry.adapter';
import { GatewayType } from '@bldr/shared-types';

describe('WebhooksService - Signature Verification & Security', () => {
  let createdTransactions: any[] = [];
  let markedPaidOrders: string[] = [];
  let markedFailedOrders: string[] = [];

  const mockPrisma = {
    transaction: {
      create: async (args: any) => {
        createdTransactions.push(args.data);
        return { id: 'tx-1', ...args.data };
      },
    },
  } as any;

  const mockOrdersService = {
    markPaid: async (orderId: string) => {
      markedPaidOrders.push(orderId);
    },
    markFailed: async (orderId: string) => {
      markedFailedOrders.push(orderId);
    },
  } as any;

  const geideaSecret = 'geidea_secret_pass_123';
  const geideaMerchantKey = 'geidea_pub_key_456';
  const fawrySecret = 'fawry_secret_key_789';
  const fawryMerchantCode = 'fawry_merchant_001';

  const createConfigMock = (env: Record<string, string> = {}) => ({
    get: (key: string) => {
      if (key === 'GEIDEA_API_PASSWORD') return geideaSecret;
      if (key === 'GEIDEA_MERCHANT_KEY') return geideaMerchantKey;
      if (key === 'FAWRY_SECURITY_KEY') return fawrySecret;
      if (key === 'FAWRY_MERCHANT_CODE') return fawryMerchantCode;
      return env[key] || '';
    },
  }) as any;

  beforeEach(() => {
    createdTransactions = [];
    markedPaidOrders = [];
    markedFailedOrders = [];
  });

  describe('Geidea Webhook Signature Security', () => {
    test('rejects webhook with missing signature without side effects', async () => {
      const config = createConfigMock({ ALLOW_INSECURE_WEBHOOK_BYPASS: 'false' });
      const geideaAdapter = new GeideaAdapter(config);
      const mockGatewayFactory = {
        getAdapter: (t: GatewayType) => geideaAdapter,
      } as any;

      const svc = new WebhooksService(mockPrisma, mockGatewayFactory, mockOrdersService);

      const payload = {
        order: { id: 'ord-123', totalAmount: 100, currency: 'USD', status: 'Success' },
      };

      await assert.rejects(
        async () => {
          await svc.handleGeidea(payload, Buffer.from(JSON.stringify(payload)), {});
        },
        (err: any) => {
          assert.match(err.message, /Geidea webhook rejected/);
          return true;
        }
      );

      // Assert zero side effects
      assert.equal(createdTransactions.length, 0, 'No transaction should be created');
      assert.equal(markedPaidOrders.length, 0, 'Order should NOT be marked paid');
    });

    test('rejects webhook with tampered / invalid signature without side effects', async () => {
      const config = createConfigMock({ ALLOW_INSECURE_WEBHOOK_BYPASS: 'false' });
      const geideaAdapter = new GeideaAdapter(config);
      const mockGatewayFactory = {
        getAdapter: (t: GatewayType) => geideaAdapter,
      } as any;

      const svc = new WebhooksService(mockPrisma, mockGatewayFactory, mockOrdersService);

      const payload = {
        order: { id: 'ord-123', totalAmount: 100, currency: 'USD', status: 'Success' },
      };

      await assert.rejects(
        async () => {
          await svc.handleGeidea(payload, Buffer.from(JSON.stringify(payload)), {
            signature: 'fake_tampered_signature_xyz',
          });
        },
        (err: any) => {
          assert.match(err.message, /signature mismatch/i);
          return true;
        }
      );

      // Assert zero side effects
      assert.equal(createdTransactions.length, 0);
      assert.equal(markedPaidOrders.length, 0);
    });

    test('accepts webhook with valid HMAC-SHA256 signature and marks order paid', async () => {
      const config = createConfigMock({ ALLOW_INSECURE_WEBHOOK_BYPASS: 'false' });
      const geideaAdapter = new GeideaAdapter(config);
      const mockGatewayFactory = {
        getAdapter: (t: GatewayType) => geideaAdapter,
      } as any;

      const svc = new WebhooksService(mockPrisma, mockGatewayFactory, mockOrdersService);

      const orderId = 'ord-geidea-valid';
      const orderAmount = '150.00';
      const orderCurrency = 'USD';
      const orderStatus = 'Success';
      const merchantRefId = 'ord-ref-999';
      const timeStamp = '2026-09-13T12:00:00Z';

      const concatenated = `${geideaMerchantKey}${orderAmount}${orderCurrency}${orderId}${orderStatus}${merchantRefId}${timeStamp}`;
      const validSignature = crypto.createHmac('sha256', geideaSecret).update(concatenated).digest('base64');

      const payload = {
        order: {
          id: orderId,
          totalAmount: 150.0,
          currency: orderCurrency,
          status: orderStatus,
          merchantReferenceId: merchantRefId,
          updatedDate: timeStamp,
        },
      };

      const result = await svc.handleGeidea(payload, Buffer.from(JSON.stringify(payload)), {
        signature: validSignature,
      });

      assert.equal(result.received, true);
      assert.equal(createdTransactions.length, 1);
      assert.equal(createdTransactions[0].signatureValid, true);
      assert.equal(markedPaidOrders.length, 1);
      assert.equal(markedPaidOrders[0], merchantRefId);
    });
  });

  describe('Fawry Webhook Signature Security', () => {
    test('rejects webhook with missing signature without side effects', async () => {
      const config = createConfigMock({ ALLOW_INSECURE_WEBHOOK_BYPASS: 'false' });
      const fawryAdapter = new FawryAdapter(config);
      const mockGatewayFactory = {
        getAdapter: (t: GatewayType) => fawryAdapter,
      } as any;

      const svc = new WebhooksService(mockPrisma, mockGatewayFactory, mockOrdersService);

      const payload = {
        fawryRefNumber: 'fawry-999',
        merchantRefNumber: 'ord-fawry-missing',
        paymentAmount: '200.00',
        orderStatus: 'PAID',
        // messageSignature explicitly omitted
      };

      await assert.rejects(
        async () => {
          await svc.handleFawry(payload, Buffer.from(JSON.stringify(payload)), {});
        },
        (err: any) => {
          assert.match(err.message, /missing fawry webhook signature/i);
          return true;
        },
      );

      assert.equal(createdTransactions.length, 0);
      assert.equal(markedPaidOrders.length, 0);
    });

    test('rejects webhook with tampered / invalid signature without side effects', async () => {
      const config = createConfigMock({ ALLOW_INSECURE_WEBHOOK_BYPASS: 'false' });
      const fawryAdapter = new FawryAdapter(config);
      const mockGatewayFactory = {
        getAdapter: (t: GatewayType) => fawryAdapter,
      } as any;

      const svc = new WebhooksService(mockPrisma, mockGatewayFactory, mockOrdersService);

      const payload = {
        fawryRefNumber: 'fawry-999',
        merchantRefNumber: 'ord-fawry-tampered',
        paymentAmount: '200.00',
        orderStatus: 'PAID',
        messageSignature: 'bad_tampered_signature_abc123',
      };

      await assert.rejects(
        async () => {
          await svc.handleFawry(payload, Buffer.from(JSON.stringify(payload)), {});
        },
        (err: any) => {
          assert.match(err.message, /signature mismatch/i);
          return true;
        },
      );

      assert.equal(createdTransactions.length, 0);
      assert.equal(markedPaidOrders.length, 0);
    });

    test('accepts webhook with valid SHA256 signature and marks order paid', async () => {
      const config = createConfigMock({ ALLOW_INSECURE_WEBHOOK_BYPASS: 'false' });
      const fawryAdapter = new FawryAdapter(config);
      const mockGatewayFactory = {
        getAdapter: (t: GatewayType) => fawryAdapter,
      } as any;

      const svc = new WebhooksService(mockPrisma, mockGatewayFactory, mockOrdersService);

      const fawryRef = 'fawry-ref-12345';
      const merchantRef = 'ord-fawry-valid';
      const paymentAmount = '200.00';
      const orderAmount = '200.00';
      const orderStatus = 'PAID';
      const paymentMethod = 'PAYATFAWRY';
      const paymentRef = '';

      // Official Fawry Server Notification concatenation:
      // fawryRefNumber + merchantRefNum + paymentAmount(10.00) + orderAmount(10.00) + orderStatus + paymentMethod + paymentRefrenceNumber(if exists) + secureKey
      const expectedInput = `${fawryRef}${merchantRef}${paymentAmount}${orderAmount}${orderStatus}${paymentMethod}${paymentRef}${fawrySecret}`;
      const validSignature = crypto.createHash('sha256').update(expectedInput).digest('hex');

      const payload = {
        requestId: 'req-fawry-123',
        fawryRefNumber: fawryRef,
        merchantRefNumber: merchantRef,
        paymentAmount: 200.0,
        orderAmount: 200.0,
        orderStatus: orderStatus,
        paymentMethod: paymentMethod,
        messageSignature: validSignature,
      };

      const result = await svc.handleFawry(payload, Buffer.from(JSON.stringify(payload)), {});

      assert.equal(result.received, true);
      assert.equal(createdTransactions.length, 1);
      assert.equal(createdTransactions[0].signatureValid, true);
      assert.equal(markedPaidOrders.length, 1);
      assert.equal(markedPaidOrders[0], merchantRef);
    });
  });
});
