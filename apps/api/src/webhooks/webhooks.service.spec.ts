import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import * as crypto from 'crypto';
import { WebhooksService } from './webhooks.service';
import { GeideaAdapter } from '../payments/geidea.adapter';
import { FawryAdapter } from '../payments/fawry.adapter';
import { PaymobAdapter } from '../payments/paymob.adapter';
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
      findFirst: async () => null,
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
  const paymobSecret = 'paymob_secret_hmac_123';

  const createConfigMock = (env: Record<string, string> = {}) => ({
    get: (key: string) => {
      if (key === 'GEIDEA_API_PASSWORD') return geideaSecret;
      if (key === 'GEIDEA_MERCHANT_KEY') return geideaMerchantKey;
      if (key === 'FAWRY_SECURITY_KEY') return fawrySecret;
      if (key === 'FAWRY_MERCHANT_CODE') return fawryMerchantCode;
      if (key === 'PAYMOB_HMAC_SECRET') return paymobSecret;
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

  describe('Paymob Webhook Signature Security', () => {
    test('rejects Paymob webhook with invalid HMAC signature', async () => {
      const config = createConfigMock({ ALLOW_INSECURE_WEBHOOK_BYPASS: 'false' });
      const paymobAdapter = new PaymobAdapter(config);
      const mockGatewayFactory = {
        getAdapter: (t: GatewayType) => paymobAdapter,
      } as any;

      const svc = new WebhooksService(mockPrisma, mockGatewayFactory, mockOrdersService);

      const payload = {
        type: 'TRANSACTION',
        obj: {
          id: 998877,
          success: true,
          amount_cents: 150000,
          currency: 'EGP',
          order: { id: 1122, merchant_order_id: 'ord-paymob-tampered' },
        },
        hmac: 'invalid_tampered_hmac_hex',
      };

      await assert.rejects(
        async () => {
          await svc.handlePaymob(payload, Buffer.from(JSON.stringify(payload)), {});
        },
        (err: any) => {
          assert.match(err.message, /Paymob webhook rejected/);
          return true;
        }
      );

      assert.equal(markedPaidOrders.length, 0, 'Tampered webhook must NOT mark order paid');
    });

    test('accepts authentic Paymob webhook and processes payment', async () => {
      const config = createConfigMock({ ALLOW_INSECURE_WEBHOOK_BYPASS: 'false' });
      const paymobAdapter = new PaymobAdapter(config);
      const mockGatewayFactory = {
        getAdapter: (t: GatewayType) => paymobAdapter,
      } as any;

      const svc = new WebhooksService(mockPrisma, mockGatewayFactory, mockOrdersService);

      const obj = {
        amount_cents: 250000,
        created_at: '2026-10-01T12:00:00Z',
        currency: 'EGP',
        error_occured: false,
        has_parent_transaction: false,
        id: 1234567,
        integration_id: 4,
        is_3d_secure: true,
        is_auth: false,
        is_capture: false,
        is_refunded: false,
        is_standalone_payment: true,
        is_voided: false,
        order: { id: 89012, merchant_order_id: 'ord-paymob-valid' },
        owner: 55,
        pending: false,
        source_data: { pan: '01012345678', sub_type: 'wallet', type: 'wallet' },
        success: true,
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
      const validHmac = crypto.createHmac('sha512', paymobSecret).update(concatenated).digest('hex');

      const payload = {
        type: 'TRANSACTION',
        obj,
        hmac: validHmac,
      };

      const res = await svc.handlePaymob(payload, Buffer.from(JSON.stringify(payload)), {});
      assert.equal(res.received, true);
      assert.equal(markedPaidOrders.includes('ord-paymob-valid'), true);
    });
  });

  describe('Unified Webhook Idempotency & Replay', () => {
    test('deduplicates identical webhook deliveries without double-processing', async () => {
      const config = createConfigMock({ ALLOW_INSECURE_WEBHOOK_BYPASS: 'false' });
      const fawryAdapter = new FawryAdapter(config);
      const mockGatewayFactory = {
        getAdapter: (t: GatewayType) => fawryAdapter,
      } as any;

      const svc = new WebhooksService(mockPrisma, mockGatewayFactory, mockOrdersService);

      const fawryRef = 'fawry-dedup-999';
      const merchantRef = 'ord-dedup-test';
      const expectedInput = `${fawryRef}${merchantRef}100.00100.00PAIDPAYATFAWRY${fawrySecret}`;
      const validSignature = crypto.createHash('sha256').update(expectedInput).digest('hex');

      const payload = {
        fawryRefNumber: fawryRef,
        merchantRefNumber: merchantRef,
        paymentAmount: 100.0,
        orderAmount: 100.0,
        orderStatus: 'PAID',
        paymentMethod: 'PAYATFAWRY',
        messageSignature: validSignature,
      };

      // First delivery: processes order
      const res1 = await svc.handleFawry(payload, Buffer.from(JSON.stringify(payload)), {});
      assert.equal(res1.received, true);
      assert.equal(markedPaidOrders.length, 1);

      // Second identical delivery (gateway retry): returns idempotent 200 without second markPaid
      const res2 = await svc.handleFawry(payload, Buffer.from(JSON.stringify(payload)), {});
      assert.equal(res2.received, true);
      assert.equal(res2.idempotent, true);
      assert.equal(markedPaidOrders.length, 1, 'Duplicate webhook must NOT re-execute markPaid');
    });

    test('records inbound audit logs and supports replay', async () => {
      const config = createConfigMock({ ALLOW_INSECURE_WEBHOOK_BYPASS: 'false' });
      const fawryAdapter = new FawryAdapter(config);
      const mockGatewayFactory = {
        getAdapter: (t: GatewayType) => fawryAdapter,
      } as any;

      const svc = new WebhooksService(mockPrisma, mockGatewayFactory, mockOrdersService);

      const fawryRef = 'fawry-log-777';
      const merchantRef = 'ord-log-replay';
      const expectedInput = `${fawryRef}${merchantRef}100.00100.00PAIDPAYATFAWRY${fawrySecret}`;
      const validSignature = crypto.createHash('sha256').update(expectedInput).digest('hex');

      const payload = {
        fawryRefNumber: fawryRef,
        merchantRefNumber: merchantRef,
        paymentAmount: 100.0,
        orderAmount: 100.0,
        orderStatus: 'PAID',
        paymentMethod: 'PAYATFAWRY',
        messageSignature: validSignature,
      };

      await svc.handleFawry(payload, Buffer.from(JSON.stringify(payload)), {});

      const { logs } = svc.getInboundLogs();
      assert.equal(logs.length >= 1, true);
      const targetLog = logs.find((l) => l.orderId === merchantRef);
      assert.ok(targetLog);
      assert.equal(targetLog.status, 'PROCESSED');
      assert.equal(targetLog.signatureValid, true);

      // Test replay
      markedPaidOrders = [];
      const replayRes = await svc.replayInboundWebhook(targetLog.id);
      assert.equal(replayRes.received, true);
      assert.equal(markedPaidOrders.includes(merchantRef), true);
    });
  });
});
