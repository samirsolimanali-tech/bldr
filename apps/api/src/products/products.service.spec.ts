import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { ProductsService, CreateProductDto } from './products.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('ProductsService — Catalog Single Source of Truth & Brand Isolation', () => {
  let service: ProductsService;
  let productsDb: Map<string, any>;
  let auditLogsDb: any[];
  let providersDb: Map<string, any>;

  beforeEach(() => {
    productsDb = new Map();
    auditLogsDb = [];
    providersDb = new Map();

    providersDb.set('prov-studyhub', {
      id: 'prov-studyhub',
      slug: 'studyhub',
      name: 'StudyHub',
    });
    providersDb.set('prov-apex', {
      id: 'prov-apex',
      slug: 'apexclasses',
      name: 'Apex Classes',
    });

    const mockPrisma = {
      provider: {
        findFirst: async ({ where }: any) => {
          if (where?.slug) {
            for (const p of providersDb.values()) {
              if (p.slug === where.slug) return p;
            }
          }
          if (where?.OR) {
            for (const orCond of where.OR) {
              if (orCond.id && providersDb.has(orCond.id)) return providersDb.get(orCond.id);
              if (orCond.slug) {
                for (const p of providersDb.values()) {
                  if (p.slug === orCond.slug) return p;
                }
              }
            }
          }
          return null;
        },
      },
      product: {
        create: async ({ data }: any) => {
          const product = {
            id: `prod_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          productsDb.set(product.id, product);
          return product;
        },
        findMany: async ({ where }: any) => {
          let list = Array.from(productsDb.values());
          if (where?.ventureId) {
            list = list.filter((p) => p.ventureId === where.ventureId);
          }
          if (where?.status) {
            list = list.filter((p) => p.status === where.status);
          }
          return list;
        },
        findFirst: async ({ where }: any) => {
          if (where?.OR) {
            for (const cond of where.OR) {
              if (cond.id && productsDb.has(cond.id)) return productsDb.get(cond.id);
              for (const p of productsDb.values()) {
                if (p.slug === cond.slug) return p;
              }
            }
          }
          return null;
        },
        findUnique: async ({ where }: any) => {
          return productsDb.get(where.id) || null;
        },
        update: async ({ where, data }: any) => {
          const current = productsDb.get(where.id);
          if (!current) throw new Error('Not found');
          const updated = { ...current, ...data, updatedAt: new Date() };
          productsDb.set(where.id, updated);
          return updated;
        },
        delete: async ({ where }: any) => {
          const current = productsDb.get(where.id);
          if (!current) throw new Error('Not found');
          productsDb.delete(where.id);
          return current;
        },
      },
      auditLog: {
        create: async ({ data }: any) => {
          const entry = { id: `aud_${Date.now()}`, ...data, createdAt: new Date() };
          auditLogsDb.unshift(entry);
          return entry;
        },
      },
    } as any;

    service = new ProductsService(mockPrisma);
  });

  const baseProductDto: CreateProductDto = {
    ventureId: 'prov-studyhub',
    slug: 'sh-react-bootcamp',
    title_en: 'Full-Stack React Bootcamp',
    title_ar: 'معسكر رياكت الشامل',
    description: 'Learn modern web engineering.',
    priceMinor: 480000, // 4,800.00 EGP
    currency: 'EGP',
    saleMode: 'DIRECT',
    status: 'ACTIVE',
  };

  test('successfully creates product and logs CREATE action in audit log', async () => {
    const actorId = 'admin@bldr.io';
    const product = await service.createProduct(baseProductDto, actorId, 'ADMIN');

    assert.ok(product.id);
    assert.equal(product.slug, 'sh-react-bootcamp');
    assert.equal(product.priceMinor, 480000);
    assert.equal(product.currency, 'EGP');

    assert.equal(auditLogsDb.length, 1);
    assert.equal(auditLogsDb[0].entity, 'PRODUCT');
    assert.equal(auditLogsDb[0].action, 'CREATE');
    assert.equal(auditLogsDb[0].actorId, actorId);
  });

  test('price modification triggers UPDATE_PRICE forensic audit entry with diff', async () => {
    const actorId = 'studyhub_manager@studyhub.eg';
    const product = await service.createProduct(baseProductDto, actorId, 'PROVIDER', 'prov-studyhub');

    // Update price from 480000 to 520000
    const updated = await service.updateProduct(
      product.id,
      { priceMinor: 520000 },
      actorId,
      'PROVIDER',
      'prov-studyhub',
    );

    assert.equal(updated.priceMinor, 520000);

    const priceAudit = auditLogsDb.find((a) => a.action === 'UPDATE_PRICE');
    assert.ok(priceAudit, 'Must record UPDATE_PRICE audit entry');
    assert.equal(priceAudit.diff.oldPriceMinor, 480000);
    assert.equal(priceAudit.diff.newPriceMinor, 520000);
  });

  test('status change triggers UPDATE_STATUS forensic audit entry with diff', async () => {
    const actorId = 'studyhub_manager@studyhub.eg';
    const product = await service.createProduct(baseProductDto, actorId, 'PROVIDER', 'prov-studyhub');

    const updated = await service.updateProduct(
      product.id,
      { status: 'INACTIVE' },
      actorId,
      'PROVIDER',
      'prov-studyhub',
    );

    assert.equal(updated.status, 'INACTIVE');

    const statusAudit = auditLogsDb.find((a) => a.action === 'UPDATE_STATUS');
    assert.ok(statusAudit, 'Must record UPDATE_STATUS audit entry');
    assert.equal(statusAudit.diff.oldStatus, 'ACTIVE');
    assert.equal(statusAudit.diff.newStatus, 'INACTIVE');
  });

  // ─── Brand Isolation Security Tests ──────────────────────────────────────────
  test('brand isolation: StudyHub manager cannot create product for Apex Classes', async () => {
    const actorId = 'studyhub_manager@studyhub.eg';
    const crossBrandDto: CreateProductDto = {
      ...baseProductDto,
      ventureId: 'prov-apex', // Attacking or misconfiguring venture!
    };

    await assert.rejects(
      async () => {
        await service.createProduct(crossBrandDto, actorId, 'PROVIDER', 'prov-studyhub');
      },
      (err: any) => {
        assert.ok(err instanceof ForbiddenException);
        assert.match(err.message, /Brand isolation violation/i);
        return true;
      },
    );
  });

  test('brand isolation: StudyHub manager cannot update Apex Classes product', async () => {
    const adminActor = 'admin@bldr.io';
    // Create Apex Classes product
    const apexProduct = await service.createProduct(
      {
        ...baseProductDto,
        ventureId: 'prov-apex',
        slug: 'ac-physics-cohort',
      },
      adminActor,
      'ADMIN',
    );

    // StudyHub manager attempts to tamper with Apex product price
    const intruderActor = 'studyhub_manager@studyhub.eg';
    await assert.rejects(
      async () => {
        await service.updateProduct(
          apexProduct.id,
          { priceMinor: 1000 },
          intruderActor,
          'PROVIDER',
          'prov-studyhub',
        );
      },
      (err: any) => {
        assert.ok(err instanceof ForbiddenException);
        assert.match(err.message, /Brand isolation violation/i);
        return true;
      },
    );
  });

  test('brand isolation: StudyHub manager cannot delete Apex Classes product', async () => {
    const adminActor = 'admin@bldr.io';
    const apexProduct = await service.createProduct(
      {
        ...baseProductDto,
        ventureId: 'prov-apex',
        slug: 'ac-delete-target',
      },
      adminActor,
      'ADMIN',
    );

    const intruderActor = 'studyhub_manager@studyhub.eg';
    await assert.rejects(
      async () => {
        await service.deleteProduct(
          apexProduct.id,
          intruderActor,
          'PROVIDER',
          'prov-studyhub',
        );
      },
      (err: any) => {
        assert.ok(err instanceof ForbiddenException);
        assert.match(err.message, /Brand isolation violation/i);
        return true;
      },
    );
  });

  test('brand isolation: list query strictly filters by ventureId for venture-scoped users', async () => {
    const adminActor = 'admin@bldr.io';
    await service.createProduct(baseProductDto, adminActor, 'ADMIN');
    await service.createProduct(
      {
        ...baseProductDto,
        ventureId: 'prov-apex',
        slug: 'ac-isolated-course',
      },
      adminActor,
      'ADMIN',
    );

    // StudyHub provider list query
    const shProducts = await service.findAll('PROVIDER', 'prov-studyhub');
    assert.equal(shProducts.length, 1);
    assert.equal(shProducts[0].ventureId, 'prov-studyhub');

    // Admin sees all
    const allProducts = await service.findAll('ADMIN');
    assert.equal(allProducts.length, 2);
  });
});
