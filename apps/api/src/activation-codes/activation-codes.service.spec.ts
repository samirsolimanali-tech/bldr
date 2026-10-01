import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { ActivationCodesService } from './activation-codes.service';
import { EnrollmentCodeStatus, EnrollmentCodeSource } from '@prisma/client';
import { HttpException, ConflictException, NotFoundException } from '@nestjs/common';

describe('ActivationCodesService - Security, Hashing, Race Safety & Rate Limiting', () => {
  let service: ActivationCodesService;
  let codesDb: Map<string, any>;
  let mockPrisma: any;

  beforeEach(() => {
    codesDb = new Map();

    const attemptsDb: Array<{ id: string; ipAddress: string; ventureId: string; attemptedAt: Date }> = [];

    mockPrisma = {
      activationAttempt: {
        create: async ({ data }: any) => {
          const item = {
            id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            attemptedAt: new Date(),
            ...data,
          };
          attemptsDb.push(item);
          return item;
        },
        count: async ({ where }: any) => {
          return attemptsDb.filter((att) => {
            if (where.ipAddress && att.ipAddress !== where.ipAddress) return false;
            if (where.ventureId && att.ventureId !== where.ventureId) return false;
            if (where.attemptedAt?.gte && att.attemptedAt < where.attemptedAt.gte) return false;
            return true;
          }).length;
        },
        deleteMany: async () => ({ count: 0 }),
      },
      provider: {
        findFirst: async ({ where }: any) => {
          return { id: 'prov-studyhub', slug: 'studyhub' };
        },
      },
      enrollmentCode: {
        create: async ({ data }: any) => {
          const item = {
            id: `ec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            ...data,
          };
          codesDb.set(item.id, item);
          return item;
        },
        updateMany: async ({ where, data }: any) => {
          let updatedCount = 0;
          for (const [id, code] of codesDb.entries()) {
            if (
              code.ventureId === where.ventureId &&
              code.codeHash === where.codeHash &&
              code.status === where.status
            ) {
              codesDb.set(id, { ...code, ...data });
              updatedCount++;
            }
          }
          return { count: updatedCount };
        },
        findFirst: async ({ where }: any) => {
          for (const code of codesDb.values()) {
            if (code.ventureId === where.ventureId && code.codeHash === where.codeHash) {
              return code;
            }
          }
          return null;
        },
      },
    } as any;

    service = new ActivationCodesService(mockPrisma);
  });

  test('codes are stored hashed, never plaintext in database', async () => {
    const rawCode = 'SH-2026-SECRET-991';
    const created = await service.createCode({
      ventureId: 'prov-studyhub',
      code: rawCode,
      productName: 'Full-Stack Bootcamp',
      source: EnrollmentCodeSource.CENTER,
    });

    assert.ok(created.id);
    assert.notEqual(created.maskedCode, rawCode);
    assert.match(created.maskedCode, /SH-\*\*\*-.*991/);

    // Verify stored record in DB
    const stored = codesDb.get(created.id);
    assert.equal(stored.code, created.maskedCode);
    assert.notEqual(stored.code, rawCode); // Never stored raw!
    assert.equal(stored.codeHash, ActivationCodesService.hashCode(rawCode));
  });

  test('redeems atomically (single-use, race-safe) and prevents double redemption', async () => {
    const rawCode = 'SH-ATOMIC-RACE-001';
    await service.createCode({
      ventureId: 'prov-studyhub',
      code: rawCode,
      productName: 'Full-Stack Bootcamp',
    });

    // 1st redemption succeeds
    const result1 = await service.redeemCode({
      ventureId: 'studyhub',
      code: rawCode,
      studentName: 'Ahmad Taha',
      studentEmail: 'ahmad@example.com',
      ipAddress: '197.100.1.1',
    });

    assert.equal(result1.success, true);
    assert.equal(result1.code.redeemedByName, 'Ahmad Taha');

    // 2nd redemption with same code fails with 409 Conflict
    await assert.rejects(
      async () => {
        await service.redeemCode({
          ventureId: 'studyhub',
          code: rawCode,
          studentName: 'Second Student',
          studentEmail: 'second@example.com',
          ipAddress: '197.100.1.2',
        });
      },
      (err: any) => {
        assert.ok(err instanceof ConflictException);
        assert.match(err.message, /already been redeemed/i);
        return true;
      },
    );
  });

  test('rate-limits redemption attempts per IP address', async () => {
    const ip = '196.205.10.50';

    // 5 attempts from this IP (all fail or succeed)
    for (let i = 0; i < 5; i++) {
      try {
        await service.redeemCode({
          ventureId: 'studyhub',
          code: `NON-EXISTENT-${i}`,
          studentName: 'Student',
          studentEmail: 'student@example.com',
          ipAddress: ip,
        });
      } catch (err: any) {
        assert.ok(err instanceof NotFoundException);
      }
    }

    // 6th attempt from the exact same IP must be blocked with HTTP 429
    await assert.rejects(
      async () => {
        await service.redeemCode({
          ventureId: 'studyhub',
          code: 'ANOTHER-CODE',
          studentName: 'Student',
          studentEmail: 'student@example.com',
          ipAddress: ip,
        });
      },
      (err: any) => {
        assert.ok(err instanceof HttpException);
        assert.equal(err.getStatus(), 429);
        assert.match(err.message, /too many redemption attempts from this ip/i);
        return true;
      },
    );
  });

  test('rate-limits redemption attempts per brand', async () => {
    // 20 attempts from distinct IPs against the same brand
    for (let i = 0; i < 20; i++) {
      try {
        await service.redeemCode({
          ventureId: 'studyhub',
          code: `ATTEMPT-BRAND-${i}`,
          studentName: 'Student',
          studentEmail: 'student@example.com',
          ipAddress: `10.0.1.${i}`,
        });
      } catch (err: any) {
        assert.ok(err instanceof NotFoundException);
      }
    }

    // 21st attempt for the same brand must be blocked with HTTP 429
    await assert.rejects(
      async () => {
        await service.redeemCode({
          ventureId: 'studyhub',
          code: 'BRAND-OVERFLOW',
          studentName: 'Student',
          studentEmail: 'student@example.com',
          ipAddress: '10.0.2.99',
        });
      },
      (err: any) => {
        assert.ok(err instanceof HttpException);
        assert.equal(err.getStatus(), 429);
        assert.match(err.message, /too many redemption attempts for this brand/i);
        return true;
      },
    );
  });

  test('logs all failures for forensic security audit', async () => {
    const ip = '41.238.10.15';
    try {
      await service.redeemCode({
        ventureId: 'studyhub',
        code: 'INVALID-CODE-FAIL',
        studentName: 'Fail Test',
        studentEmail: 'fail@test.com',
        ipAddress: ip,
      });
    } catch {}

    const logs = service.getFailureLogs();
    assert.ok(logs.length >= 1);
    assert.equal(logs[0].reason, 'CODE_NOT_FOUND');
    assert.equal(logs[0].ipAddress, ip);
    assert.equal(logs[0].ventureId, 'studyhub');
    assert.ok(logs[0].maskedCode.includes('***'));
  });

  test('rate-limit state persists across service instances (DB-backed, survives service restart)', async () => {
    const ip = '197.200.50.99';

    // 5 attempts on first service pod/instance
    for (let i = 0; i < 5; i++) {
      try {
        await service.redeemCode({
          ventureId: 'studyhub',
          code: `RESTART-CODE-${i}`,
          studentName: 'Student',
          studentEmail: 'student@example.com',
          ipAddress: ip,
        });
      } catch (err: any) {
        assert.ok(err instanceof NotFoundException);
      }
    }

    // Simulate pod restart or second API pod instance with fresh in-memory state, sharing same mockPrisma DB
    const serviceInstance2 = new ActivationCodesService(mockPrisma);

    // 6th attempt on new instance must still be blocked by DB rate limit
    await assert.rejects(
      async () => {
        await serviceInstance2.redeemCode({
          ventureId: 'studyhub',
          code: 'RESTART-CODE-BLOCKED',
          studentName: 'Student',
          studentEmail: 'student@example.com',
          ipAddress: ip,
        });
      },
      (err: any) => {
        assert.ok(err instanceof HttpException);
        assert.equal(err.getStatus(), 429);
        assert.match(err.message, /too many redemption attempts from this ip/i);
        return true;
      },
    );
  });
});
