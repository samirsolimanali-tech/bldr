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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ListingsService, CreateListingDto, UpdateListingDto } from './listings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '@bldr/shared-types';

@ApiTags('listings')
@Controller('listings')
export class ListingsController {
  constructor(private svc: ListingsService) {}

  // ─── Public endpoints ─────────────────────────────────────────────────────

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('category') category?: string,
    @Query('q') q?: string,
    @Query('featured') featured?: string,
    @Query('providerId') providerId?: string,
  ) {
    return this.svc.findAll({
      page: page ? +page : 1,
      category,
      q,
      featured: featured === 'true',
      providerId,
    });
  }

  @Get('featured')
  getFeatured(@Query('limit') limit?: string) {
    return this.svc.getFeatured(limit ? +limit : 8);
  }

  @Get('categories')
  getCategories() {
    return this.svc.getCategories();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  // ─── Provider-authenticated endpoints ─────────────────────────────────────

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROVIDER')
  @ApiBearerAuth()
  create(@Body() dto: CreateListingDto, @CurrentUser() user: JwtPayload) {
    return this.svc.create(user.providerId!, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROVIDER')
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() dto: UpdateListingDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.svc.update(id, user.providerId!, dto);
  }

  @Post(':id/media')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROVIDER')
  @ApiBearerAuth()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          cb(null, `${uuid()}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadMedia(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: JwtPayload,
  ) {
    const urls = files.map((f) => `/uploads/${f.filename}`);
    return this.svc.addMedia(id, user.providerId!, urls);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROVIDER')
  @ApiBearerAuth()
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.svc.remove(id, user.providerId!);
  }
}
