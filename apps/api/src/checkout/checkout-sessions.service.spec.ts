import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { CheckoutSessionsService } from './checkout-sessions.service';
import { ConflictException } from '@nestjs/common';

describe('CheckoutSessionsService - Idempotency Security', () => {
  let service: CheckoutSessionsService;
  let sessionsDb: Map<string, any>;
  let sessionsByIdempotencyKey: Map<string, any>;

  beforeEach(() => {
    sessionsDb = new Map();
    sessionsByIdempotencyKey = new Map();

    const mockPrisma = {
      provider: {
        findFirst: async () => ({
          id: 'prov-studyhub',
          slug: 'studyhub',
          maxTransactionAmountPiasters: 10000000,
          authorizedRedirectDomains: ['*'],
        }),
      },
      checkoutSession: {
        findUnique: async ({ where }: { where: { id?: string; idempotencyKey?: string } }) => {
          if (where.idempotencyKey) {
            return sessionsByIdempotencyKey.get(where.idempotencyKey) || null;
          }
          if (where.id) {
            return sessionsDb.get(where.id) || null;
          }
          return null;
        },
        create: async ({ data }: { data: any }) => {
          const session = {
            ...data,
            id: data.id || `cs_test_${Date.now()}`,
            createdAt: new Date(),
          };
          sessionsDb.set(session.id, session);
          if (session.idempotencyKey) {
            sessionsByIdempotencyKey.set(session.idempotencyKey, session);
          }
          return session;
        },
      },
      listing: {
        findUnique: async () => null,
        findFirst: async () => null,
      },
    } as any;

    service = new CheckoutSessionsService(mockPrisma);
  });

  const baseDto = {
    ventureId: 'SH',
    amountPiasters: 250000,
    currency: 'EGP',
    externalRef: 'order_1001',
    customer: {
      name: 'Youssef Ali',
      email: 'youssef@example.com',
      phone: '+201000000001',
    },
    lineItems: [
      { id: 'item_1', title: 'React Mastery', quantity: 1, unit_amount: 250000 },
    ],
    successUrl: 'https://studyhub.bldrmanagement.com/orders/success',
    cancelUrl: 'https://studyhub.bldrmanagement.com/orders/cancel',
    paymentMethodsAllowed: ['cards', 'wallets'],
  };

  test('same Idempotency-Key + same request body returns the existing session', async () => {
    const apiKey = 'sk_test_sh_bldr2026';
    const idempotencyKey = 'idem-uuid-unique-123';

    // 1st request
    const firstResult = await service.createSession(apiKey, baseDto as any, idempotencyKey);
    assert.ok(firstResult.id);
    assert.equal(firstResult.amount_piasters, 250000);

    // 2nd request with exact same payload and key
    const secondResult = await service.createSession(apiKey, { ...baseDto } as any, idempotencyKey);
    assert.equal(secondResult.id, firstResult.id);
    assert.equal(secondResult.amount_piasters, 250000);
  });

  test('same Idempotency-Key + different request body strictly rejects with 409 Conflict', async () => {
    const apiKey = 'sk_test_sh_bldr2026';
    const idempotencyKey = 'idem-uuid-conflict-456';

    // 1st request
    const firstResult = await service.createSession(apiKey, baseDto as any, idempotencyKey);
    assert.ok(firstResult.id);

    // 2nd request with altered amount
    const alteredDto = {
      ...baseDto,
      amountPiasters: 390000, // changed amount!
    };

    await assert.rejects(
      async () => {
        await service.createSession(apiKey, alteredDto as any, idempotencyKey);
      },
      (err: any) => {
        assert.ok(err instanceof ConflictException);
        assert.match(err.message, /different request payload/i);
        return true;
      },
    );

    // 3rd request with altered customer email
    const alteredCustomerDto = {
      ...baseDto,
      customer: {
        ...baseDto.customer,
        email: 'attacker@evil.com',
      },
    };

    await assert.rejects(
      async () => {
        await service.createSession(apiKey, alteredCustomerDto as any, idempotencyKey);
      },
      (err: any) => {
        assert.ok(err instanceof ConflictException);
        assert.match(err.message, /different request payload/i);
        return true;
      },
    );
  });

  test('price and catalog resolution strictly fails closed in production when product is missing', async () => {
    const origNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    try {
      await assert.rejects(
        async () => {
          await service.resolveCheckoutProduct({ productId: 'unregistered-or-tampered-id' });
        },
        (err: any) => {
          assert.match(err.message, /not found in authoritative database catalog\. Checkout refused\./i);
          return true;
        },
      );
    } finally {
      process.env.NODE_ENV = origNodeEnv;
    }
  });
});

