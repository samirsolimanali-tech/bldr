import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtPayload, UserRole } from '@bldr/shared-types';

class RegisterProviderDto {
  @IsEmail() email: string;
  @IsString() @MinLength(8) password: string;
  @IsString() firstName: string;
  @IsString() lastName: string;
  @IsString() orgName: string;
  @IsString() orgSlug: string;
  @IsOptional() @IsString() tagline?: string;
  @IsOptional() @IsString() website?: string;
}

class LoginDto {
  @IsEmail() email: string;
  @IsString() password: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('provider/register')
  @ApiOperation({ summary: 'Register a new provider account (creates pending provider)' })
  registerProvider(@Body() dto: RegisterProviderDto) {
    return this.authService.registerProvider(dto);
  }

  @Post('provider/login')
  @ApiOperation({ summary: 'Provider login' })
  loginProvider(@Body() dto: LoginDto) {
    return this.authService.loginProvider(dto.email, dto.password);
  }

  @Post('admin/login')
  @ApiOperation({ summary: 'Admin login' })
  loginAdmin(@Body() dto: LoginDto) {
    return this.authService.loginAdmin(dto.email, dto.password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  async getMe(@CurrentUser() user: JwtPayload) {
    if (user.role === UserRole.ADMIN) {
      return this.authService.getAdminMe(user.sub);
    }
    return this.authService.getProviderMe(user.sub);
  }
}
