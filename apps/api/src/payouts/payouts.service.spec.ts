import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { PayoutsService } from './payouts.service';
import { PayoutsController } from './payouts.controller';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserRole } from '@bldr/shared-types';

describe('PayoutsService & Controller - Dual Control Settlement Security', () => {
  let payoutsService: PayoutsService;
  let payoutsController: PayoutsController;
  let batchesDb: Map<string, any>;
  let updatedBatches: any[];

  beforeEach(() => {
    batchesDb = new Map();
    updatedBatches = [];

    const mockPrisma = {
      payout: {
        findUnique: async ({ where }: { where: { id: string } }) => {
          return batchesDb.get(where.id) || null;
        },
        update: async ({ where, data }: { where: { id: string }; data: any }) => {
          const current = batchesDb.get(where.id);
          const updated = { ...current, ...data };
          batchesDb.set(where.id, updated);
          updatedBatches.push(updated);
          return updated;
        },
        create: async ({ data }: { data: any }) => {
          const created = { id: `payout-${Date.now()}`, ...data };
          batchesDb.set(created.id, created);
          return created;
        },
      },
      provider: {
        findUnique: async () => ({ id: 'prov-1', slug: 'studyhub', reservePct: 0.05 }),
      },
    } as any;

    payoutsService = new PayoutsService(mockPrisma);
    payoutsController = new PayoutsController(payoutsService);
  });

  test('creator cannot approve their own settlement batch (fails with 403 Forbidden)', async () => {
    const creatorId = 'fin_controller_samir@bldr.io';
    const batchId = 'batch-dual-001';

    batchesDb.set(batchId, {
      id: batchId,
      providerId: 'prov-1',
      grossAmount: 10000,
      netAmount: 9200,
      status: 'PENDING',
      note: JSON.stringify({
        batchRef: 'STL-2026-001',
        createdBy: creatorId,
        createdAt: new Date().toISOString(),
      }),
    });

    await assert.rejects(
      async () => {
        await payoutsService.approveAndPostSettlementBatch(batchId, creatorId);
      },
      (err: any) => {
        assert.ok(err instanceof ForbiddenException);
        assert.match(err.message, /creator of a settlement batch cannot approve/i);
        return true;
      },
    );
  });

  test('missing createdBy fails closed and is strictly rejected (fails with 403 Forbidden)', async () => {
    const approverId = 'super_admin@bldr.io';
    const batchId = 'batch-no-creator-002';

    // Batch without createdBy metadata
    batchesDb.set(batchId, {
      id: batchId,
      providerId: 'prov-1',
      grossAmount: 5000,
      netAmount: 4600,
      status: 'PENDING',
      note: JSON.stringify({
        batchRef: 'STL-2026-002',
        // createdBy omitted
      }),
    });

    await assert.rejects(
      async () => {
        await payoutsService.approveAndPostSettlementBatch(batchId, approverId);
      },
      (err: any) => {
        assert.ok(err instanceof ForbiddenException);
        assert.match(err.message, /missing creator information/i);
        return true;
      },
    );

    // Batch with empty or invalid JSON note
    const batchCorruptId = 'batch-corrupt-003';
    batchesDb.set(batchCorruptId, {
      id: batchCorruptId,
      providerId: 'prov-1',
      grossAmount: 5000,
      netAmount: 4600,
      status: 'PENDING',
      note: 'invalid-non-json',
    });

    await assert.rejects(
      async () => {
        await payoutsService.approveAndPostSettlementBatch(batchCorruptId, approverId);
      },
      (err: any) => {
        assert.ok(err instanceof ForbiddenException);
        assert.match(err.message, /missing creator information/i);
        return true;
      },
    );
  });

  test('body-supplied approverId is strictly ignored; approver is derived exclusively from JWT session', async () => {
    const creatorId = 'fin_officer_1@bldr.io';
    const legitimateApproverJwt = {
      sub: 'fin_approver_2@bldr.io',
      email: 'fin_approver_2@bldr.io',
      role: UserRole.APPROVER,
    };
    const batchId = 'batch-spoof-004';

    batchesDb.set(batchId, {
      id: batchId,
      providerId: 'prov-1',
      grossAmount: 25000,
      netAmount: 23000,
      status: 'PENDING',
      note: JSON.stringify({
        batchRef: 'STL-2026-004',
        createdBy: creatorId,
      }),
    });

    // An attacker passes a spoofed body attempting to set approverId to someone else
    const spoofedBody = {
      approverId: 'attacker_override@malicious.com',
      actorId: 'someone_else',
    };

    const result = await payoutsController.approveBatch(batchId, legitimateApproverJwt, spoofedBody);

    assert.equal(result.success, true);
    assert.equal(result.approvedBy, legitimateApproverJwt.sub);
    assert.notEqual(result.approvedBy, spoofedBody.approverId);

    // Verify stored note has the legitimate approver from JWT
    const updated = batchesDb.get(batchId);
    const parsedNote = JSON.parse(updated.note);
    assert.equal(parsedNote.approvedBy, legitimateApproverJwt.sub);
    assert.notEqual(parsedNote.approvedBy, spoofedBody.approverId);
  });

  test('second financial controller with APPROVER role can successfully approve and post journal', async () => {
    const creatorId = 'fin_officer_creator@bldr.io';
    const secondApproverId = 'vp_finance_approver@bldr.io';
    const batchId = 'batch-valid-005';

    batchesDb.set(batchId, {
      id: batchId,
      providerId: 'prov-1',
      grossAmount: 50000,
      netAmount: 46000,
      status: 'PENDING',
      note: JSON.stringify({
        batchRef: 'STL-2026-005',
        createdBy: creatorId,
      }),
    });

    const result = await payoutsService.approveAndPostSettlementBatch(batchId, secondApproverId);

    assert.equal(result.success, true);
    assert.equal(result.status, 'POSTED');
    assert.equal(result.approvedBy, secondApproverId);
    assert.ok(result.journalRef.startsWith('TR-INT-'));

    const updated = batchesDb.get(batchId);
    assert.equal(updated.status, 'PAID');
    const parsedNote = JSON.parse(updated.note);
    assert.equal(parsedNote.approvedBy, secondApproverId);
    assert.equal(parsedNote.journalRef, result.journalRef);

    // Check audit logs
    const auditLogs = payoutsService.getAuditLogs();
    assert.ok(auditLogs.length >= 2);
    assert.equal(auditLogs[0].action, 'APPROVE_BATCH');
    assert.equal(auditLogs[1].action, 'POST_JOURNAL');
    assert.equal(auditLogs[0].actorId, secondApproverId);
  });
});
