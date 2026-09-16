import { Controller, Post, Body, Headers, Req, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';
import { Request } from 'express';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private svc: WebhooksService) {}

  /**
   * Geidea payment callback.
   * IMPORTANT: NestJS must be started with rawBody:true in main.ts for signature
   * verification to work correctly. Never trust the payload without verifying the signature.
   */
  @Post('geidea')
  @HttpCode(200)
  handleGeidea(
    @Body() payload: unknown,
    @Headers() headers: Record<string, string>,
    @Req() req: Request,
  ) {
    return this.svc.handleGeidea(payload, (req as any).rawBody, headers);
  }

  /**
   * Fawry IPN (Instant Payment Notification).
   * Fawry embeds messageSignature in the JSON body.
   */
  @Post('fawry')
  @HttpCode(200)
  handleFawry(
    @Body() payload: unknown,
    @Headers() headers: Record<string, string>,
    @Req() req: Request,
  ) {
    return this.svc.handleFawry(payload, (req as any).rawBody, headers);
  }
}
