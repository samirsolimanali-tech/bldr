import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService, CreateProductDto, UpdateProductDto } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload, UserRole } from '@bldr/shared-types';

@ApiTags('admin-products')
@Controller('v1/admin/products')
export class AdminProductsController {
  constructor(private readonly service: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'PROVIDER')
  @ApiBearerAuth()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateProductDto) {
    return this.service.createProduct(
      dto,
      user.sub || user.email,
      user.role,
      user.providerId,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'PROVIDER')
  @ApiBearerAuth()
  findAll(@CurrentUser() user: JwtPayload, @Query('status') status?: string) {
    return this.service.findAll(user.role, user.providerId, status);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'PROVIDER')
  @ApiBearerAuth()
  findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.service.findOne(id, user.role, user.providerId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'PROVIDER')
  @ApiBearerAuth()
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.service.updateProduct(
      id,
      dto,
      user.sub || user.email,
      user.role,
      user.providerId,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'PROVIDER')
  @ApiBearerAuth()
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.service.deleteProduct(
      id,
      user.sub || user.email,
      user.role,
      user.providerId,
    );
  }
}

@ApiTags('public-products')
@Controller('v1/products')
export class PublicProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  findAll(@Query('venture') venture?: string) {
    return this.service.findPublic(venture);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.service.findOne(slug);
  }
}
