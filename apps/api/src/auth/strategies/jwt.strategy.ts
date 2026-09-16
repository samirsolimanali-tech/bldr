import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '@bldr/shared-types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') || 'fallback-dev-secret',
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.sub || !payload.role) {
      throw new UnauthorizedException('Invalid token payload');
    }
    return payload; // Attached to request.user
  }
}
