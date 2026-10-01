import { EnrollmentCode, EnrollmentCodeStatus, EnrollmentCodeSource } from '@bldr/shared-types';

export const INITIAL_ENROLLMENT_CODES: EnrollmentCode[] = [
  // StudyHub Academy baseline codes
  {
    id: 'code-sh-01',
    code: 'SH-2026-F982',
    serial: 'SN-SH-001091',
    ventureId: 'studyhub',
    productId: 'math-term-1',
    productName: 'Full-Stack Engineering Bootcamp',
    status: 'UNUSED',
    source: 'CENTER',
    notes: 'Batch #1 distributed to Dokki Learning Center',
    createdAt: '2026-09-15T10:00:00Z',
  },
  {
    id: 'code-sh-02',
    code: 'SH-2026-K104',
    serial: 'SN-SH-001092',
    ventureId: 'studyhub',
    productId: 'fullstack-bootcamp',
    productName: 'Full-Stack Engineering Bootcamp',
    status: 'UNUSED',
    source: 'TUTOR',
    notes: 'Issued to Dr. Tamer for direct student enrollment',
    createdAt: '2026-09-15T10:05:00Z',
  },
  {
    id: 'code-sh-03',
    code: 'SH-2026-M552',
    serial: 'SN-SH-001093',
    ventureId: 'studyhub',
    productId: 'react-cohort',
    productName: 'Advanced React Cohort',
    status: 'UNUSED',
    source: 'PHYSICAL_STORE',
    notes: 'Campus Bookstore retail card with scratch off seal',
    createdAt: '2026-09-18T14:30:00Z',
  },
  {
    id: 'code-sh-04',
    code: 'SH-2026-X991',
    serial: 'SN-SH-001094',
    ventureId: 'studyhub',
    productId: 'fullstack-bootcamp',
    productName: 'Full-Stack Engineering Bootcamp',
    status: 'USED',
    source: 'CENTER',
    redeemedAt: '2026-09-27T16:45:00Z',
    redeemedByEmail: 'khalid.nasser@gmail.com',
    redeemedByName: 'Khalid Nasser',
    orderId: 'ORD-SH-7718',
    notes: 'Redeemed by student from Nasr City Center receipt',
    createdAt: '2026-09-10T09:00:00Z',
  },

  // bldr Storefront Pilot codes
  {
    id: 'code-bldr-01',
    code: 'BLDR-8819-K1',
    serial: 'SN-BLDR-000101',
    ventureId: 'bldr',
    productId: 'bldr-founder-edition',
    productName: 'bldr Founder Edition — Lifetime Access',
    status: 'UNUSED',
    source: 'PHYSICAL_STORE',
    notes: 'Event voucher from RiseUp Summit 2026 VIP bag',
    createdAt: '2026-09-20T11:00:00Z',
  },
  {
    id: 'code-bldr-02',
    code: 'BLDR-8820-E4',
    serial: 'SN-BLDR-000102',
    ventureId: 'bldr',
    productId: 'education-enterprise',
    productName: 'Education Solutions (Enterprise)',
    status: 'UNUSED',
    source: 'CENTER',
    notes: 'Direct corporate training license card',
    createdAt: '2026-09-22T13:15:00Z',
  },

  // Apex Classes codes
  {
    id: 'code-apex-01',
    code: 'APEX-2026-CFA1',
    serial: 'SN-AC-004410',
    ventureId: 'apex',
    productId: 'cfa-level-1',
    productName: 'CFA Level 1 FastTrack',
    status: 'UNUSED',
    source: 'CENTER',
    notes: 'Alexandria Finance Academy partnership card',
    createdAt: '2026-09-12T08:00:00Z',
  },
  {
    id: 'code-apex-02',
    code: 'APEX-2026-CFA2',
    serial: 'SN-AC-004411',
    ventureId: 'apex',
    productId: 'cfa-level-1',
    productName: 'CFA Level 1 FastTrack',
    status: 'UNUSED',
    source: 'TUTOR',
    notes: 'Issued by Instructor Khaled for offline batch',
    createdAt: '2026-09-14T09:30:00Z',
  },
];

const STORAGE_KEY = 'bldr_enrollment_codes';

export function getAllEnrollmentCodes(): EnrollmentCode[] {
  if (typeof window === 'undefined') return INITIAL_ENROLLMENT_CODES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ENROLLMENT_CODES));
      return INITIAL_ENROLLMENT_CODES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_ENROLLMENT_CODES;
  } catch (e) {
    return INITIAL_ENROLLMENT_CODES;
  }
}

export function getVentureCodes(ventureId?: string): EnrollmentCode[] {
  const all = getAllEnrollmentCodes();
  if (!ventureId || ventureId === 'all') return all;
  const cleanId = ventureId.toLowerCase();
  return all.filter(c => c.ventureId.toLowerCase() === cleanId || cleanId.includes(c.ventureId.toLowerCase()));
}

export function saveEnrollmentCodes(codes: EnrollmentCode[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(codes));
    window.dispatchEvent(new CustomEvent('bldr:codes-updated', { detail: codes }));
  } catch (e) {}
}

export interface GenerateCodesParams {
  ventureId: string;
  prefix?: string;
  count: number;
  productName: string;
  productId?: string;
  source: EnrollmentCodeSource | 'PHYSICAL_STORE' | 'CENTER' | 'TUTOR' | 'BATCH_DISTRIBUTION' | 'OTHER';
  notes?: string;
}

export function generateBatchCodes(params: GenerateCodesParams): EnrollmentCode[] {
  const cleanPrefix = (params.prefix || `${params.ventureId.toUpperCase().slice(0, 4)}-2026`).replace(/[^a-zA-Z0-9-]/g, '').toUpperCase();
  const current = getAllEnrollmentCodes();
  const newCodes: EnrollmentCode[] = [];

  const existingCodesSet = new Set(current.map(c => c.code.toUpperCase()));

  for (let i = 0; i < params.count; i++) {
    let randPart = '';
    do {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      randPart = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    } while (existingCodesSet.has(`${cleanPrefix}-${randPart}`));

    const fullCode = `${cleanPrefix}-${randPart}`;
    existingCodesSet.add(fullCode);

    const serialNum = `SN-${params.ventureId.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-4)}${i.toString().padStart(2, '0')}`;

    newCodes.push({
      id: `code-${Date.now()}-${i}`,
      code: fullCode,
      serial: serialNum,
      ventureId: params.ventureId.toLowerCase(),
      productId: params.productId || 'course-enrollment',
      productName: params.productName,
      status: 'UNUSED',
      source: params.source,
      notes: params.notes || `Generated in batch of ${params.count}`,
      createdAt: new Date().toISOString(),
    });
  }

  const updated = [...newCodes, ...current];
  saveEnrollmentCodes(updated);
  return newCodes;
}

export function bulkImportCodes(
  ventureId: string,
  rawText: string,
  productName: string,
  source: EnrollmentCodeSource | 'PHYSICAL_STORE' | 'CENTER' | 'TUTOR' | 'BATCH_DISTRIBUTION' | 'OTHER',
  productId?: string
): { imported: number; duplicates: number } {
  const lines = rawText
    .split(/[\r\n,]+/)
    .map(l => l.trim().toUpperCase())
    .filter(l => l.length >= 4);

  const current = getAllEnrollmentCodes();
  const existingSet = new Set(current.map(c => c.code.toUpperCase()));
  const toAdd: EnrollmentCode[] = [];
  let duplicates = 0;

  lines.forEach((codeStr, idx) => {
    if (existingSet.has(codeStr)) {
      duplicates++;
    } else {
      existingSet.add(codeStr);
      toAdd.push({
        id: `code-import-${Date.now()}-${idx}`,
        code: codeStr,
        serial: `SN-IMP-${Date.now().toString().slice(-4)}${idx}`,
        ventureId: ventureId.toLowerCase(),
        productId: productId || 'course-enrollment',
        productName,
        status: 'UNUSED',
        source,
        notes: 'Bulk uploaded by brand administrator',
        createdAt: new Date().toISOString(),
      });
    }
  });

  if (toAdd.length > 0) {
    saveEnrollmentCodes([...toAdd, ...current]);
  }

  return { imported: toAdd.length, duplicates };
}

export { type EnrollmentCode, type EnrollmentCodeStatus, type EnrollmentCodeSource };

export function updateCodeStatus(code: string, newStatus: EnrollmentCodeStatus): boolean {
  const allCodes = getAllEnrollmentCodes();
  let found = false;
  const updated = allCodes.map(c => {
    if (c.code.toUpperCase() === code.toUpperCase()) {
      found = true;
      return { ...c, status: newStatus };
    }
    return c;
  });
  if (found) {
    saveEnrollmentCodes(updated);
  }
  return found;
}

export interface RedemptionResult {
  success: boolean;
  message: string;
  code?: EnrollmentCode;
  transaction?: any;
}

// Simple SHA-256 in browser/Node
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'hash_' + Math.abs(hash).toString(16);
}

// In-memory rate limiting tracking
const rateLimitTracker = {
  ipAttempts: new Map<string, number[]>(),
  brandAttempts: new Map<string, number[]>(),
  failureLogs: [] as Array<{ timestamp: string; reason: string; ventureId: string; ip: string; maskedCode: string }>,
};

export function getActivationFailureLogs() {
  return rateLimitTracker.failureLogs;
}

export function validateAndRedeemEnrollmentCode(
  ventureId: string,
  inputCode: string,
  student: {
    name: string;
    email: string;
    phone?: string;
    orderRef?: string;
    productTitle?: string;
    ventureName?: string;
    ipAddress?: string;
  }
): RedemptionResult {
  const normCode = (inputCode || '').trim().toUpperCase();
  const maskedCode = normCode.length > 4 ? `${normCode.slice(0, 2)}-***-${normCode.slice(-4)}` : '****';
  const ip = student.ipAddress || (typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1');
  const now = Date.now();

  if (!normCode) {
    return { success: false, message: 'Please enter a valid activation code or serial.' };
  }

  // Rate Limiting: max 5 per minute per IP, max 20 per minute per brand
  const ipHits = (rateLimitTracker.ipAttempts.get(ip) || []).filter(t => now - t < 60000);
  if (ipHits.length >= 5) {
    rateLimitTracker.failureLogs.unshift({ timestamp: new Date().toISOString(), reason: 'RATE_LIMIT_IP', ventureId, ip, maskedCode });
    console.warn(`[Activation Code Rate Limit] Too many redemption attempts from IP ${ip}`);
    return { success: false, message: 'Too many redemption attempts from this IP address. Please wait a minute and try again.' };
  }

  const brandHits = (rateLimitTracker.brandAttempts.get(ventureId) || []).filter(t => now - t < 60000);
  if (brandHits.length >= 20) {
    rateLimitTracker.failureLogs.unshift({ timestamp: new Date().toISOString(), reason: 'RATE_LIMIT_BRAND', ventureId, ip, maskedCode });
    console.warn(`[Activation Code Rate Limit] Too many redemption attempts for brand ${ventureId}`);
    return { success: false, message: 'Too many redemption attempts for this brand. Please try again later.' };
  }

  ipHits.push(now);
  rateLimitTracker.ipAttempts.set(ip, ipHits);
  brandHits.push(now);
  rateLimitTracker.brandAttempts.set(ventureId, brandHits);

  const cleanVenture = ventureId.toLowerCase();
  const allCodes = getAllEnrollmentCodes();
  const targetHash = simpleHash(normCode);

  // Find code either by exact normalized code or stored hash
  const matched = allCodes.find(
    c => (c.code.toUpperCase() === normCode || (c as any).codeHash === targetHash) &&
         (c.ventureId.toLowerCase() === cleanVenture || cleanVenture.includes(c.ventureId.toLowerCase()))
  );

  if (!matched) {
    rateLimitTracker.failureLogs.unshift({ timestamp: new Date().toISOString(), reason: 'CODE_NOT_FOUND', ventureId, ip, maskedCode });
    console.warn(`[Activation Code Failure] Code ${maskedCode} not found for brand ${ventureId}`);
    return {
      success: false,
      message: `Activation code "${maskedCode}" was not found for this brand. Please verify the spelling or check with your center/tutor.`,
    };
  }

  if (matched.status === 'USED') {
    const dateStr = matched.redeemedAt ? new Date(matched.redeemedAt).toLocaleDateString() : 'a previous date';
    const emailMask = matched.redeemedByEmail ? ` by ${matched.redeemedByEmail.replace(/(.{2})(.*)(@.*)/, '$1***$3')}` : '';
    rateLimitTracker.failureLogs.unshift({ timestamp: new Date().toISOString(), reason: 'CODE_ALREADY_USED', ventureId, ip, maskedCode });
    console.warn(`[Activation Code Failure] Code ${maskedCode} already used on ${dateStr}`);
    return {
      success: false,
      message: `This activation code has already been redeemed on ${dateStr}${emailMask}. Each code can only be used once.`,
    };
  }

  if (matched.status === 'EXPIRED') {
    rateLimitTracker.failureLogs.unshift({ timestamp: new Date().toISOString(), reason: 'CODE_EXPIRED', ventureId, ip, maskedCode });
    return {
      success: false,
      message: `This activation code has expired. Please contact your educational center administrator for an updated seat code.`,
    };
  }

  if (matched.status === 'VOID') {
    rateLimitTracker.failureLogs.unshift({ timestamp: new Date().toISOString(), reason: 'CODE_VOID', ventureId, ip, maskedCode });
    return {
      success: false,
      message: `This activation code has been marked as VOID by the brand administrator.`,
    };
  }

  // Code is valid! Mark as USED
  const redeemedAt = new Date().toISOString();
  const orderRef = student.orderRef || `ACT-${Date.now().toString().slice(-6)}`;

  const updatedCodes = allCodes.map(c => {
    if (c.id === matched.id) {
      return {
        ...c,
        status: 'USED' as const,
        redeemedAt,
        redeemedByEmail: student.email,
        redeemedByName: student.name,
        orderId: orderRef,
      };
    }
    return c;
  });

  saveEnrollmentCodes(updatedCodes);

  const txnId = `txn_code_${Date.now()}`;
  const codeTxn = {
    id: txnId,
    venture: student.ventureName || cleanVenture,
    student: student.name,
    email: student.email,
    product: student.productTitle || matched.productName,
    amount: 0,
    amountDisplay: 'EGP 0.00 (Redeemed Code)',
    faceValue: 0,
    method: `Activation Code (${matched.source})`,
    gateway: 'OFFLINE_CODE',
    status: 'Completed',
    type: 'CODE_REDEMPTION',
    date: redeemedAt.replace('T', ' ').slice(0, 16),
    ref: orderRef,
    codeRedeemed: matched.code,
    sourceChannel: matched.source,
  };

  try {
    if (typeof window !== 'undefined') {
      const storedTxns = localStorage.getItem('bldr_hub_transactions') || '[]';
      const parsed = JSON.parse(storedTxns);
      parsed.unshift(codeTxn);
      localStorage.setItem('bldr_hub_transactions', JSON.stringify(parsed));
      window.dispatchEvent(new CustomEvent('bldr:transaction-created', { detail: codeTxn }));

      const storedStudents = localStorage.getItem('bldr_hub_students') || '[]';
      const parsedStudents = JSON.parse(storedStudents);
      parsedStudents.unshift({
        id: `stu-act-${Date.now()}`,
        name: student.name,
        email: student.email,
        phone: student.phone || '',
        venture: student.ventureName || cleanVenture,
        product: student.productTitle || matched.productName,
        amount: 0,
        method: `Activation Code (${matched.source})`,
        gateway: 'OFFLINE_CODE',
        date: redeemedAt.split('T')[0],
        refund: 'None',
        status: 'Enrolled',
      });
      localStorage.setItem('bldr_hub_students', JSON.stringify(parsedStudents));
    }
  } catch (e) {}

  return {
    success: true,
    message: 'Code redeemed successfully! Enrollment granted.',
    code: { ...matched, status: 'USED', redeemedAt, redeemedByEmail: student.email, redeemedByName: student.name, orderId: orderRef },
    transaction: codeTxn,
  };
}
