// ─── Enums ────────────────────────────────────────────────────────────────────

export enum ProviderStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
}

export enum PurchaseType {
  NATIVE = 'NATIVE',
  REDIRECT = 'REDIRECT',
}

export enum EngagementType {
  BUY_NOW = 'BUY_NOW',
  REQUEST_QUOTE = 'REQUEST_QUOTE',
  BOOK_CALL = 'BOOK_CALL',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum OrderSource {
  NATIVE = 'NATIVE',
  REDIRECT = 'REDIRECT',
}

export enum GatewayType {
  GEIDEA = 'GEIDEA',
  FAWRY = 'FAWRY',
  EXTERNAL = 'EXTERNAL',
}

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  CLOSED = 'CLOSED',
}

export enum PayoutStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  PROVIDER = 'PROVIDER',
  CUSTOMER = 'CUSTOMER',
}

// ─── API Shapes ───────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  providerId?: string;
}

// ─── Entity Shapes (read models) ─────────────────────────────────────────────

export interface ProviderDTO {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  bio?: string;
  logoUrl?: string;
  bannerUrl?: string;
  website?: string;
  isHouseBrand: boolean;
  status: ProviderStatus;
  conversionToken?: string;
  createdAt: string;
}

export interface ListingDTO {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  tags: string[];
  mediaUrls: string[];
  purchaseType: PurchaseType;
  engagementType: EngagementType;
  redirectUrl?: string;
  isFeatured: boolean;
  isPublished: boolean;
  providerId: string;
  provider?: ProviderDTO;
  createdAt: string;
}

export interface OrderDTO {
  id: string;
  listingId: string;
  providerId: string;
  customerEmail: string;
  customerName?: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  source: OrderSource;
  externalReference?: string;
  trackingEventId?: string;
  gatewayUsed: GatewayType;
  gatewaySessionId?: string;
  commissionAmount?: number;
  netAmount?: number;
  commissionRate?: number;
  createdAt: string;
  listing?: Pick<ListingDTO, 'id' | 'title'>;
  provider?: Pick<ProviderDTO, 'id' | 'name'>;
}

export interface LeadDTO {
  id: string;
  listingId: string;
  providerId: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  engagementType: EngagementType;
  status: LeadStatus;
  listing?: Pick<ListingDTO, 'id' | 'title'>;
  provider?: Pick<ProviderDTO, 'id' | 'name'>;
  createdAt: string;
}

export interface PayoutDTO {
  id: string;
  providerId: string;
  provider?: Pick<ProviderDTO, 'id' | 'name'>;
  periodStart: string;
  periodEnd: string;
  grossAmount: number;
  commissionAmount: number;
  netAmount: number;
  status: PayoutStatus;
  paidAt?: string;
  note?: string;
  createdAt: string;
}

export interface CommissionRuleDTO {
  id: string;
  providerId?: string;
  provider?: Pick<ProviderDTO, 'id' | 'name'>;
  rate: number;
  createdAt: string;
}

export interface TrackingEventDTO {
  clickId: string;
  listingId: string;
  providerId: string;
  redirectUrl: string;
  createdAt: string;
}

// ─── Checkout Result ─────────────────────────────────────────────────────────

export type CheckoutResultType = 'session_id' | 'redirect_url';

export interface CheckoutResult {
  type: CheckoutResultType;
  value: string;
  gatewayUsed: GatewayType;
}

// ─── Central Payment Hub Types (PRD v1.0) ───────────────────────────────────

export interface VentureDTO {
  id: string;
  code: string; // e.g. "SH", "AC", "EH", "CH"
  name: string; // e.g. "StudyHub", "Apex Classes", "EL HESA", "Career Hub"
  slug: string;
  description?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'ONBOARDING';
  logoUrl?: string;
  brandColor?: string; // Hex color for header theming
  chipBg: string;
  chipFg: string;
  webhookUrl?: string;
  successUrl?: string;
  failureUrl?: string;
  orderPrefix: string;
  supportEmail?: string;
  supportPhone?: string;
  defaultGateway: GatewayType;
  createdAt: string;
  totalGrossVolume?: number;
  totalTransactions?: number;
}

export type PaymentLinkStatus = 'ACTIVE' | 'PAID' | 'EXPIRED' | 'CANCELLED';

export interface PaymentLinkDTO {
  id: string;
  slug: string; // e.g. "sh-8k2m9q"
  url: string; // e.g. "pay.bldr.com/l/sh-8k2m9q"
  ventureId: string;
  ventureCode: string;
  ventureName: string;
  chipBg: string;
  chipFg: string;
  orderNumber: string;
  description: string;
  amount: number | null; // null for open / caller-supplied
  currency: string;
  isFixed: boolean;
  maxUses: number;
  usedCount: number;
  expiresAt: string | null;
  status: PaymentLinkStatus;
  qrCodeUrl?: string;
  createdAt: string;
}

export interface TransactionTimelineEvent {
  time: string;
  title: string;
  body: string;
  actor: string;
  dotColor: string;
  tag?: string;
  tagBg?: string;
  tagFg?: string;
}

export interface LedgerEntry {
  type: string;
  amount: string;
  direction: 'CR' | 'DR';
  dirBg: string;
  dirFg: string;
  reference: string;
  postedAt: string;
}

export interface TransactionDetailDTO {
  id: string; // txn_01J8F4KQ2M
  orderNumber: string; // SH-COURSE-4581
  paymentLinkId?: string;
  ventureId: string;
  ventureCode: string;
  ventureName: string;
  customerEmail: string;
  customerName?: string;
  amount: number;
  currency: string;
  netAmount: number;
  feeAmount: number;
  vatAmount: number;
  refundableBalance: number;
  status: 'PAID' | 'FAILED' | 'PENDING' | 'REFUNDED' | 'EXPIRED';
  paymentMethod: 'CARD' | 'WALLET' | 'FAWRY_CASH' | 'MEEZA';
  gatewayUsed: GatewayType;
  gatewayRef?: string;
  paidAt?: string;
  createdAt: string;
  events: TransactionTimelineEvent[];
  ledgerEntries: LedgerEntry[];
}

export interface ExecutiveOverviewKPIs {
  grossVolume: number;
  grossDelta: string;
  netCollected: number;
  netDelta: string;
  pspFees: number;
  feesDelta: string;
  activeLinksCount: number;
  linksDelta: string;
  refundRate: number;
  refundRateDelta: string;
  periodLabel: string;
}
