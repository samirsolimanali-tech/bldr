import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { CommissionService } from './commission.service';

describe('CommissionService - Precision & Hierarchy', () => {
  const mockPrisma = {
    commissionRule: {
      findUnique: async ({ where }: { where: { providerId?: string } }) => {
        if (where.providerId === 'provider-custom') {
          return { id: 'rule-custom', providerId: 'provider-custom', rate: 0.15 };
        }
        return null;
      },
      findFirst: async ({ where }: { where: { providerId: null } }) => {
        return { id: 'rule-global', providerId: null, rate: 0.10 };
      },
    },
  } as any;

  const svc = new CommissionService(mockPrisma);

  describe('calculateCommission integer-cents precision', () => {
    test('exact calculation for $199.99 @ 15%', () => {
      const result = svc.calculateCommission(199.99, 0.15);
      // grossCents = 19999
      // commissionCents = Math.round(19999 * 0.15) = Math.round(2999.85) = 3000 ($30.00)
      // netCents = 19999 - 3000 = 16999 ($169.99)
      assert.equal(result.grossCents, 19999);
      assert.equal(result.commissionCents, 3000);
      assert.equal(result.netCents, 16999);
      assert.equal(result.grossAmount, 199.99);
      assert.equal(result.commissionAmount, 30.00);
      assert.equal(result.netAmount, 169.99);
      // Zero floating point drift:
      assert.equal(result.grossAmount, Number((result.commissionAmount + result.netAmount).toFixed(2)));
      assert.equal(result.grossCents, result.commissionCents + result.netCents);
    });

    test('exact calculation for $1234.56 @ 7.5%', () => {
      const result = svc.calculateCommission(1234.56, 0.075);
      // grossCents = 123456
      // commissionCents = Math.round(123456 * 0.075) = Math.round(9259.2) = 9259 ($92.59)
      // netCents = 123456 - 9259 = 114197 ($1141.97)
      assert.equal(result.grossCents, 123456);
      assert.equal(result.commissionCents, 9259);
      assert.equal(result.netCents, 114197);
      assert.equal(result.grossAmount, 1234.56);
      assert.equal(result.commissionAmount, 92.59);
      assert.equal(result.netAmount, 1141.97);
      assert.equal(result.grossAmount, Number((result.commissionAmount + result.netAmount).toFixed(2)));
      assert.equal(result.grossCents, result.commissionCents + result.netCents);
    });

    test('exact calculation for $100.00 @ 10%', () => {
      const result = svc.calculateCommission(100.00, 0.10);
      assert.equal(result.grossCents, 10000);
      assert.equal(result.commissionCents, 1000);
      assert.equal(result.netCents, 9000);
      assert.equal(result.grossAmount, 100.00);
      assert.equal(result.commissionAmount, 10.00);
      assert.equal(result.netAmount, 90.00);
      assert.equal(result.grossCents, result.commissionCents + result.netCents);
    });

    test('handles small amounts and edge cases without negative or fractional cents', () => {
      const result = svc.calculateCommission(0.01, 0.10);
      assert.equal(result.grossCents, 1);
      assert.equal(result.commissionCents, 0);
      assert.equal(result.netCents, 1);
      assert.equal(result.grossCents, result.commissionCents + result.netCents);
    });
  });

  describe('getRate priority', () => {
    test('returns provider-specific rate when defined', async () => {
      const res = await svc.getRate('provider-custom');
      assert.equal(res.rate, 0.15);
      assert.equal(res.source, 'provider');
    });

    test('falls back to global rate when provider has no override', async () => {
      const res = await svc.getRate('provider-other');
      assert.equal(res.rate, 0.10);
      assert.equal(res.source, 'global');
    });
  });
});
