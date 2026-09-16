import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PayoutsService } from './payouts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '@bldr/shared-types';

class MarkAsPaidDto {
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

  @Post(':id/mark-paid')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  markAsPaid(@Param('id') id: string, @Body() dto: MarkAsPaidDto) {
    return this.svc.markAsPaid(id, dto.note);
  }
}
