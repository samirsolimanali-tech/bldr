import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProvidersService, UpdateProviderDto } from './providers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '@bldr/shared-types';

@ApiTags('providers')
@Controller('providers')
export class ProvidersController {
  constructor(private svc: ProvidersService) {}

  // Public endpoints
  @Get('public')
  getPublicList(@Query('page') page?: string, @Query('category') category?: string) {
    return this.svc.getPublicList(page ? +page : 1, 20, category);
  }

  @Get('public/:slug')
  getBySlug(@Param('slug') slug: string) {
    return this.svc.findBySlug(slug);
  }

  // Provider-scoped: update own profile
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROVIDER')
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProviderDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.svc.update(id, dto, user.providerId!);
  }
}
