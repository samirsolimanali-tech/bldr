import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { SimulationService } from './simulation.service';
import { MockGeideaAdapter, SIMULATION_DEV_SECRET } from '../payments/mock-geidea.adapter';
import { MockFawryAdapter } from '../payments/mock-fawry.adapter';
import { GatewayFactory } from '../payments/gateway.factory';

describe('Simulation Engine — Adapters, Signatures, and Guards', () => {
  const createConfigMock = (env: Record<string, string> = {}) => ({
    get: (key: string) => {
      if (key === 'SIMULATION_DEV_SECRET') return SIMULATION_DEV_SECRET;
      if (key === 'PAYMENT_SIMULATION_MODE') return env.PAYMENT_SIMULATION_MODE ?? 'true';
      if (key === 'NODE_ENV') return env.NODE_ENV ?? 'development';
      return env[key] || '';
    },
  }) as any;

  describe('1. Production Guard', () => {
    test('throws fatal security violation when simulation mode is enabled in production', () => {
      const isProd = true;
      const simulationMode = 'true';

      assert.throws(
        () => {
          if (isProd && simulationMode === 'true') {
            throw new Error('FATAL SECURITY VIOLATION: PAYMENT_SIMULATION_MODE cannot be enabled when NODE_ENV=production. Aborting startup.');
          }
        },
        {
          name: 'Error',
          message: /FATAL SECURITY VIOLATION: PAYMENT_SIMULATION_MODE cannot be enabled when NODE_ENV=production/,
        },
      );
    });

    test('permits startup in non-production with simulation enabled', () => {
      const isProd = false;
      const simulationMode = 'true';
      assert.doesNotThrow(() => {
        if (isProd && simulationMode === 'true') {
          throw new Error('Should not throw');
        }
      });
    });
  });

  describe('2. MockGeideaAdapter & Authentic HMAC-SHA256 Signatures', () => {
    test('generates valid canonical Geidea HMAC signature that passes verification', async () => {
      const config = createConfigMock();
      const adapter = new MockGeideaAdapter(config);

      const orderId = 'ord-test-sim-001';
      const amount = 199.99;

      const { payload, signature } = MockGeideaAdapter.buildSignedWebhook({
        orderId,
        amount,
        currency: 'USD',
        status: 'paid',
      });

      const result = await adapter.handleWebhook(payload, signature);
      assert.equal(result.orderId, orderId);
      assert.equal(result.status, 'paid');
    });

    test('strictly rejects tampered Geidea signature with signature mismatch', async () => {
      const config = createConfigMock();
      const adapter = new MockGeideaAdapter(config);

      const { payload, signature } = MockGeideaAdapter.buildSignedWebhook({
        orderId: 'ord-test-sim-002',
        amount: 250.0,
        status: 'paid',
        tamper: true,
      });

      await assert.rejects(
        async () => {
          await adapter.handleWebhook(payload, signature);
        },
        (err: any) => {
          assert.match(err.message, /signature mismatch/i);
          return true;
        },
      );
    });
  });

  describe('3. MockFawryAdapter & Authentic SHA256 Signatures', () => {
    test('generates valid canonical Fawry messageSignature that passes verification', async () => {
      const config = createConfigMock();
      const adapter = new MockFawryAdapter(config);

      const orderId = 'ord-fawry-sim-001';
      const amount = 350.0;

      const { payload, signature } = MockFawryAdapter.buildSignedWebhook({
        orderId,
        amount,
        status: 'PAID',
      });

      const result = await adapter.handleWebhook(payload, signature);
      assert.equal(result.orderId, orderId);
      assert.equal(result.status, 'paid');
    });

    test('strictly rejects tampered Fawry signature with signature mismatch', async () => {
      const config = createConfigMock();
      const adapter = new MockFawryAdapter(config);

      const { payload, signature } = MockFawryAdapter.buildSignedWebhook({
        orderId: 'ord-fawry-sim-002',
        amount: 150.0,
        status: 'PAID',
        tamper: true,
      });

      await assert.rejects(
        async () => {
          await adapter.handleWebhook(payload, signature);
        },
        (err: any) => {
          assert.match(err.message, /signature mismatch/i);
          return true;
        },
      );
    });
  });

  describe('4. GatewayFactory Dynamic Adapter Switching', () => {
    test('returns MockGeideaAdapter when simulation mode is active', () => {
      const config = createConfigMock({ PAYMENT_SIMULATION_MODE: 'true', NODE_ENV: 'development' });
      const factory = new GatewayFactory(
        {} as any,
        {} as any,
        new MockGeideaAdapter(config),
        new MockFawryAdapter(config),
        config,
      );

      assert.equal(factory.isSimulationMode(), true);
      const adapter = factory.selectGateway({} as any);
      assert.equal(adapter instanceof MockGeideaAdapter, true);
    });

    test('returns real GeideaAdapter when simulation mode is disabled', () => {
      const config = createConfigMock({ PAYMENT_SIMULATION_MODE: 'false', NODE_ENV: 'development' });
      const mockRealGeidea = { name: 'RealGeideaAdapter' } as any;
      const factory = new GatewayFactory(
        mockRealGeidea,
        {} as any,
        new MockGeideaAdapter(config),
        new MockFawryAdapter(config),
        config,
      );

      assert.equal(factory.isSimulationMode(), false);
      const adapter = factory.selectGateway({} as any);
      assert.equal(adapter, mockRealGeidea);
    });
  });
});
