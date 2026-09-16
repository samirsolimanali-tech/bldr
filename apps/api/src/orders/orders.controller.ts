import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService, CreateOrderDto } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload, OrderStatus } from '@bldr/shared-types';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private svc: OrdersService) {}

  // Public — storefront creates orders
  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.svc.create(dto);
  }

  // Public — storefront polls for order status
  @Get(':id/status')
  getStatus(@Param('id') id: string) {
    return this.svc.getStatus(id);
  }

  // Public — storefront client-side fallback when modal SDK fails
  @Post(':id/fallback-redirect')
  getFallbackRedirect(@Param('id') id: string) {
    return this.svc.getFallbackRedirect(id);
  }

  // Provider — report offline / redirect-out sale (lands in PENDING_VERIFICATION)
  @Post('report-sale')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROVIDER')
  @ApiBearerAuth()
  reportSale(
    @CurrentUser() user: JwtPayload,
    @Body() dto: import('./orders.service').ReportOfflineSaleDto,
  ) {
    return this.svc.reportOfflineSale(user.providerId!, dto);
  }

  // Admin — approve redirect-out order (moves to PAID and credits payout ledger)
  @Post(':id/approve-redirect')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  approveRedirect(@Param('id') id: string) {
    return this.svc.approveRedirectOrder(id);
  }

  // Provider — own orders
  @Get('mine')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROVIDER')
  @ApiBearerAuth()
  findMine(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: string,
    @Query('status') status?: OrderStatus,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.svc.findForProvider(user.providerId!, page ? +page : 1, 20, status, dateFrom, dateTo);
  }

  // Admin — all orders
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  findAll(@Query('page') page?: string, @Query('status') status?: OrderStatus) {
    return this.svc.findAll(page ? +page : 1, 20, status);
  }
}
