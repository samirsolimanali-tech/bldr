import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  Req,
  Query,
  Param,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';
import { Request } from 'express';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private svc: WebhooksService) {}

  /**
   * Geidea payment callback.
   * Signature verified via HMAC-SHA256 with Geidea API password.
   */
  @Post('geidea')
  @HttpCode(200)
  @ApiOperation({ summary: 'Inbound Geidea webhook handler' })
  handleGeidea(
    @Body() payload: unknown,
    @Headers() headers: Record<string, string>,
    @Req() req: Request,
  ) {
    return this.svc.handleGeidea(payload, (req as any).rawBody, headers);
  }

  /**
   * Paymob transaction processed callback.
   * Signature verified via HMAC-SHA512 with Paymob HMAC secret.
   */
  @Post('paymob')
  @HttpCode(200)
  @ApiOperation({ summary: 'Inbound Paymob webhook handler' })
  handlePaymob(
    @Body() payload: unknown,
    @Headers() headers: Record<string, string>,
    @Req() req: Request,
  ) {
    return this.svc.handlePaymob(payload, (req as any).rawBody, headers);
  }

  /**
   * Fawry IPN (Instant Payment Notification).
   * Signature verified via SHA256 with Fawry security key.
   */
  @Post('fawry')
  @HttpCode(200)
  @ApiOperation({ summary: 'Inbound Fawry IPN handler' })
  handleFawry(
    @Body() payload: unknown,
    @Headers() headers: Record<string, string>,
    @Req() req: Request,
  ) {
    return this.svc.handleFawry(payload, (req as any).rawBody, headers);
  }

  /**
   * Unified Gateway Webhook Endpoint.
   * Auto-detects gateway type from headers/payload or ?gateway= param.
   */
  @Post('gateway')
  @HttpCode(200)
  @ApiOperation({ summary: 'Unified gateway callback multiplexer' })
  handleGateway(
    @Query('gateway') gateway: string | undefined,
    @Body() payload: unknown,
    @Headers() headers: Record<string, string>,
    @Req() req: Request,
  ) {
    return this.svc.handleUnified(gateway, payload, (req as any).rawBody, headers);
  }

  /**
   * Inbound Webhook Inspection Logs for Central Hub /developers/webhooks.
   */
  @Get('inbound-logs')
  @ApiOperation({ summary: 'Get inbound gateway webhook audit logs' })
  getInboundLogs(
    @Query('gateway') gateway?: string,
    @Query('status') status?: string,
  ) {
    return this.svc.getInboundLogs({ gateway, status });
  }

  /**
   * Manual Replay for Inbound Webhooks.
   */
  @Post('inbound-logs/:id/replay')
  @HttpCode(200)
  @ApiOperation({ summary: 'Replay an inbound gateway webhook' })
  replayInboundLog(@Param('id') id: string) {
    return this.svc.replayInboundWebhook(id);
  }
}
