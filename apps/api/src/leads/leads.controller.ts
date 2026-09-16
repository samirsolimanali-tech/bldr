import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LeadsService, CreateLeadDto } from './leads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload, LeadStatus } from '@bldr/shared-types';
import { IsEnum } from 'class-validator';

class UpdateLeadStatusDto {
  @IsEnum(LeadStatus) status: LeadStatus;
}

@ApiTags('leads')
@Controller('leads')
export class LeadsController {
  constructor(private svc: LeadsService) {}

  // Public — storefront submits lead forms here
  @Post()
  create(@Body() dto: CreateLeadDto) {
    return this.svc.create(dto);
  }

  // Provider — own leads
  @Get('mine')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROVIDER')
  @ApiBearerAuth()
  findMine(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: string,
    @Query('status') status?: LeadStatus,
  ) {
    return this.svc.findForProvider(user.providerId!, page ? +page : 1, 20, status);
  }

  // Admin — all leads
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  findAll(@Query('page') page?: string, @Query('status') status?: LeadStatus) {
    return this.svc.findAll(page ? +page : 1, 20, status);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROVIDER', 'ADMIN')
  @ApiBearerAuth()
  updateStatus(@Param('id') id: string, @Body() dto: UpdateLeadStatusDto) {
    return this.svc.updateStatus(id, dto.status);
  }
}
