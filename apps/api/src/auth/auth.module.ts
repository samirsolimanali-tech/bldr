import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'fallback-dev-secret',
        signOptions: { expiresIn: config.get('JWT_EXPIRES_IN') || '15m' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy, RolesGuard],
  controllers: [AuthController],
  exports: [JwtStrategy, RolesGuard, JwtModule],
})
export class AuthModule {}
