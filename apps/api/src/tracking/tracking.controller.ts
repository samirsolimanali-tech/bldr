import { Controller, Get, Post, Body, Param, Res, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TrackingService, CreateTrackingEventDto, ConversionPostbackDto } from './tracking.service';
import { Response, Request } from 'express';

@ApiTags('tracking')
@Controller()
export class TrackingController {
  constructor(private svc: TrackingService) {}

  /**
   * POST /tracking/events
   * Storefront calls this when user clicks "Visit Provider Store".
   * Returns { clickId, redirectUrl } — client then redirects to redirectUrl?click_id=
   */
  @Post('tracking/events')
  createEvent(@Body() dto: CreateTrackingEventDto, @Req() req: Request) {
    return this.svc.createEvent(dto, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      referrer: req.headers['referer'],
    });
  }

  /**
   * POST /tracking/conversions
   * Server-to-server postback for redirect sales.
   * Requires provider conversionToken. Records order in PENDING_VERIFICATION.
   */
  @Post('tracking/conversions')
  async recordConversion(@Body() dto: ConversionPostbackDto) {
    return this.svc.recordConversion(dto);
  }

  /**
   * GET /tracking/pixel
   * Conversion tracking pixel (1x1 transparent GIF).
   * Query params: click_id, token, amount, order_ref
   */
  @Get('tracking/pixel')
  async trackingPixel(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const clickId = (req.query.click_id || req.query.clickId) as string;
    const token = req.query.token as string;
    const amountStr = req.query.amount as string;
    const orderRef = (req.query.order_ref || req.query.orderRef) as string | undefined;

    const transparentGif = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64',
    );

    if (clickId && token && amountStr) {
      try {
        const amount = parseFloat(amountStr);
        if (!isNaN(amount) && amount > 0) {
          await this.svc.recordConversion({
            clickId,
            token,
            amount,
            orderRef,
          });
        }
      } catch (err) {
        // Pixel should still return 200 image to avoid breaking external site renders,
        // but log the failure
      }
    }

    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Content-Length', transparentGif.length.toString());
    return res.status(200).send(transparentGif);
  }

  /**
   * GET /r/:clickId
   * Server-side redirect alternative — logs click and 302 to provider's store.
   * The click_id is appended as a query param to the provider's URL.
   */
  @Get('r/:clickId')
  async redirect(@Param('clickId') clickId: string, @Res() res: Response) {
    const url = await this.svc.resolveRedirect(clickId);
    return res.redirect(302, url);
  }
}

