import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ProviderStatus } from '@bldr/shared-types';

class RejectProviderDto {
  @IsOptional() @IsString() reason?: string;
}

class SetRateDto {
  @IsNumber() @Min(0) @Max(1) @Type(() => Number) rate: number;
}

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class AdminController {
  constructor(private svc: AdminService) {}

  @Get('stats')
  getStats() {
    return this.svc.getDashboardStats();
  }

  // Providers
  @Get('providers')
  listProviders(@Query('page') page?: string, @Query('status') status?: ProviderStatus) {
    return this.svc.listProviders(page ? +page : 1, 20, status);
  }

  @Post('providers/:id/approve')
  approve(@Param('id') id: string) {
    return this.svc.approveProvider(id);
  }

  @Post('providers/:id/reject')
  reject(@Param('id') id: string, @Body() dto: RejectProviderDto) {
    return this.svc.rejectProvider(id, dto.reason);
  }

  @Post('providers/:id/suspend')
  suspend(@Param('id') id: string) {
    return this.svc.suspendProvider(id);
  }

  // Commission rules
  @Get('commission')
  getCommissionRules() {
    return this.svc.getCommissionRules();
  }

  @Post('commission/global')
  setGlobalRate(@Body() dto: SetRateDto) {
    return this.svc.setGlobalRate(dto.rate);
  }

  @Post('commission/provider/:providerId')
  setProviderRate(@Param('providerId') providerId: string, @Body() dto: SetRateDto) {
    return this.svc.setProviderRate(providerId, dto.rate);
  }

  @Delete('commission/provider/:providerId')
  removeProviderRate(@Param('providerId') providerId: string) {
    return this.svc.removeProviderRate(providerId);
  }

  // ─── Products & Listings ──────────────────────────────────────────────────

  @Get('listings')
  listListings(
    @Query('category') category?: string,
    @Query('providerId') providerId?: string,
    @Query('q') q?: string,
    @Query('status') status?: string,
  ) {
    return this.svc.listAllListings({ category, providerId, q, status });
  }

  @Post('listings')
  createListing(@Body() dto: any) {
    return this.svc.createListing(dto);
  }

  @Patch('listings/:id')
  updateListing(@Param('id') id: string, @Body() dto: any) {
    return this.svc.updateListing(id, dto);
  }

  @Patch('listings/:id/toggle-publish')
  toggleListingPublish(@Param('id') id: string) {
    return this.svc.toggleListingPublish(id);
  }

  @Patch('listings/:id/toggle-featured')
  toggleListingFeatured(@Param('id') id: string) {
    return this.svc.toggleListingFeatured(id);
  }

  @Delete('listings/:id')
  deleteListing(@Param('id') id: string) {
    return this.svc.deleteListing(id);
  }
}
