import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Ip,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ActivationCodesService } from './activation-codes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@bldr/shared-types';

class RedeemCodeDto {
  ventureId: string;
  code: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  orderRef?: string;
}

@ApiTags('activation-codes')
@Controller(['activation-codes', 'v1/activation-codes'])
export class ActivationCodesController {
  constructor(private readonly service: ActivationCodesService) {}

  @Post('redeem')
  @ApiOperation({ summary: 'Redeem a single-use prepaid activation code with atomic race safety' })
  async redeem(@Body() dto: RedeemCodeDto, @Ip() clientIp: string, @Req() req: any) {
    const ip = req.headers['x-forwarded-for'] || clientIp || '127.0.0.1';
    return this.service.redeemCode({
      ...dto,
      ipAddress: Array.isArray(ip) ? ip[0] : ip.split(',')[0].trim(),
    });
  }

  @Get('audit-failures')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'View security failure logs for activation code attempts' })
  getFailureLogs(
    @Query('ventureId') ventureId?: string,
    @Query('reason') reason?: string,
  ) {
    return this.service.getFailureLogs({ ventureId, reason });
  }
}
