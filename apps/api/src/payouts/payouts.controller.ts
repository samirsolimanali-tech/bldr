import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { PayoutsService } from './payouts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload, UserRole } from '@bldr/shared-types';

class MarkAsPaidDto {
  @IsOptional() @IsString() note?: string;
}

class CreateSettlementBatchDto {
  @IsString() providerId: string;
  @IsNumber() grossAmount: number;
  @IsOptional() @IsString() note?: string;
}

@ApiTags('payouts')
@Controller('payouts')
export class PayoutsController {
  constructor(private svc: PayoutsService) {}

  @Get('mine')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROVIDER')
  @ApiBearerAuth()
  findMine(@CurrentUser() user: JwtPayload, @Query('page') page?: string) {
    return this.svc.findForProvider(user.providerId!, page ? +page : 1);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  findAll(@Query('page') page?: string) {
    return this.svc.findAll(page ? +page : 1);
  }

  @Post('batches')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  createBatch(@CurrentUser() user: JwtPayload, @Body() dto: CreateSettlementBatchDto) {
    return this.svc.createSettlementBatch(user.sub || user.email, dto);
  }

  @Post('batches/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.APPROVER)
  @ApiBearerAuth()
  approveBatch(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() _ignoredBody?: Record<string, unknown>,
  ) {
    // Security: approverId is strictly derived from the authenticated JWT session, never accepted from request body
    return this.svc.approveAndPostSettlementBatch(id, user.sub || user.email);
  }

  @Get('audit-logs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  getAuditLogs() {
    return this.svc.getAuditLogs();
  }

  @Post(':id/mark-paid')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  markAsPaid(@Param('id') id: string, @Body() dto: MarkAsPaidDto) {
    return this.svc.markAsPaid(id, dto.note);
  }
}
