import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Headers,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  Logger,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CheckoutSessionsService } from './checkout-sessions.service';
import { IsString, IsOptional, IsNumber, IsArray, IsObject } from 'class-validator';

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export class LineItemDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  unitAmount?: number; // piasters — integer minor units

  @IsOptional()
  @IsNumber()
  unit_amount?: number;

  @IsOptional()
  @IsNumber()
  unit_price?: number;

  @IsOptional()
  @IsNumber()
  unitPrice?: number;

  @IsOptional()
  @IsNumber()
  price?: number;
}

export class CreateCheckoutSessionDto {
  @IsOptional()
  @IsString()
  ventureId?: string;

  @IsOptional()
  @IsString()
  venture_id?: string;

  @IsOptional()
  @IsString()
  externalRef?: string;

  @IsOptional()
  @IsString()
  order_id?: string;

  @IsOptional()
  @IsString()
  external_ref?: string;

  @IsOptional()
  @IsNumber()
  amountPiasters?: number;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsNumber()
  amount_piasters?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsObject()
  customer?: {
    name?: string;
    email: string;
    phone?: string;
  };

  @IsOptional()
  @IsArray()
  lineItems?: LineItemDto[];

  @IsOptional()
  @IsArray()
  line_items?: LineItemDto[];

  @IsOptional()
  @IsString()
  successUrl?: string;

  @IsOptional()
  @IsString()
  success_url?: string;

  @IsOptional()
  @IsString()
  cancelUrl?: string;

  @IsOptional()
  @IsString()
  cancel_url?: string;

  @IsOptional()
  @IsArray()
  paymentMethodsAllowed?: string[];

  @IsOptional()
  @IsArray()
  payment_methods_allowed?: string[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, string>;
}

export interface ValidatedCheckoutSessionDto {
  ventureId: string;
  externalRef?: string;
  amountPiasters: number;
  currency: string;
  customer: {
    name?: string;
    email: string;
    phone?: string;
  };
  lineItems: Array<{
    id: string;
    title: string;
    quantity: number;
    unitAmount: number;
  }>;
  successUrl: string;
  cancelUrl: string;
  paymentMethodsAllowed?: string[];
  metadata?: Record<string, string>;
}

// ─── Controller ───────────────────────────────────────────────────────────────

@Controller('v1/checkout/sessions')
export class CheckoutSessionsController {
  private readonly logger = new Logger(CheckoutSessionsController.name);

  constructor(private readonly service: CheckoutSessionsService) {}

  /**
   * POST /v1/checkout/sessions
   *
   * Entry point for Model B (Bolt-On) integration. An external LMS or bldr's
   * own storefront calls this to initiate a payment session. Returns a
   * checkout_url to redirect the student to.
   *
   * Auth: Bearer <venture_secret_key>  — sk_live_... or sk_test_...
   * Idempotency: pass Idempotency-Key header to prevent duplicate sessions.
   */
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: false, forbidNonWhitelisted: false, transform: true }))
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Headers('authorization') authHeader: string,
    @Headers('idempotency-key') idempotencyKey: string | undefined,
    @Body() dto: CreateCheckoutSessionDto,
  ) {
    const apiKey = this.extractBearerToken(authHeader);
    if (!apiKey) {
      throw new UnauthorizedException(
        'Missing or malformed Authorization header. Expected: Bearer sk_live_... or sk_test_...',
      );
    }

    // Support both camelCase and snake_case payloads from developer guides
    const raw = dto as any;
    const ventureId = String(dto.ventureId || raw.venture_id || '').trim();
    const externalRef = dto.externalRef || raw.order_id || raw.external_ref;
    const amountPiasters = Number(dto.amountPiasters ?? raw.amount ?? raw.amount_piasters ?? 0);
    const currency = String(dto.currency || raw.currency || 'EGP');
    const customer = dto.customer || raw.customer;
    const rawLineItems = dto.lineItems || raw.line_items || [];
    const lineItems = rawLineItems.map((item: any) => ({
      id: String(item.id || 'item'),
      title: String(item.title || 'Course'),
      quantity: Number(item.quantity ?? 1),
      unitAmount: Number(item.unitAmount ?? item.unit_amount ?? item.unit_price ?? item.unitPrice ?? item.price ?? 0),
    }));
    const successUrl = String(dto.successUrl || raw.success_url || '');
    const cancelUrl = String(dto.cancelUrl || raw.cancel_url || '');
    const paymentMethodsAllowed = dto.paymentMethodsAllowed || raw.payment_methods_allowed;
    const metadata = dto.metadata || raw.metadata;

    if (!ventureId) {
      throw new BadRequestException('ventureId (or venture_id) is required.');
    }

    if (!customer?.email) {
      throw new BadRequestException('customer.email is required.');
    }

    // Guard: only EGP in v1
    if (currency !== 'EGP') {
      throw new BadRequestException(
        `Currency "${currency}" is not supported in v1. Only "EGP" is accepted.`,
      );
    }

    // Guard: amount must be a positive integer
    if (!Number.isInteger(amountPiasters) || amountPiasters <= 0) {
      throw new BadRequestException(
        `amountPiasters (or amount) must be a positive integer in piasters (minor units). ` +
        `E.g. EGP 750.00 → 75000. Received: ${amountPiasters}`,
      );
    }

    // Guard: line items must sum to amountPiasters
    const lineTotal = lineItems.reduce(
      (sum: number, item: any) => sum + (item.unitAmount || 0) * (item.quantity || 1),
      0,
    );
    if (lineTotal !== amountPiasters) {
      throw new BadRequestException(
        `Line item total (${lineTotal} piasters) does not match amount (${amountPiasters} piasters). ` +
        `These must be equal to prevent silent overcharging.`,
      );
    }

    const validatedDto: ValidatedCheckoutSessionDto = {
      ventureId,
      externalRef,
      amountPiasters,
      currency,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
      lineItems,
      successUrl,
      cancelUrl,
      paymentMethodsAllowed,
      metadata,
    };

    this.logger.log(
      `[Checkout Session] Creating session for ventureId=${validatedDto.ventureId} ` +
      `amount=${validatedDto.amountPiasters}p customer=${validatedDto.customer.email} ` +
      `idempotencyKey=${idempotencyKey ?? 'none'}`,
    );

    return this.service.createSession(apiKey, validatedDto, idempotencyKey);
  }

  /**
   * GET /v1/checkout/sessions/:id
   * Retrieve session status. Used by external LMS to verify completion.
   */
  @Get(':id')
  async retrieve(
    @Headers('authorization') authHeader: string,
    @Param('id') id: string,
  ) {
    const apiKey = this.extractBearerToken(authHeader);
    if (!apiKey) throw new UnauthorizedException('Missing Authorization header');
    return this.service.getSession(apiKey, id);
  }

  /**
   * GET /v1/checkout/sessions/:id/public
   * Public metadata for rendering the Hosted Checkout UI safely without API keys.
   */
  @Get(':id/public')
  async retrievePublic(@Param('id') id: string) {
    return this.service.getSessionPublic(id);
  }

  /**
   * POST /v1/checkout/sessions/:id/complete
   * Called by the Hosted Checkout page to finalize the session, record payment,
   * and fire the signed HMAC outbound webhook to the venture's LMS / Storefront.
   */
  @Post(':id/complete')
  async complete(
    @Param('id') id: string,
    @Body() body: { paymentMethod?: string },
  ) {
    return this.service.completeSession(id, body?.paymentMethod);
  }

  private extractBearerToken(header?: string): string | null {
    if (!header || !header.startsWith('Bearer ')) return null;
    return header.substring(7).trim() || null;
  }
}
