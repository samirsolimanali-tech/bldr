import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@bldr/shared-types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  // ─── Provider Register ────────────────────────────────────────────────────

  async registerProvider(dto: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    orgName: string;
    orgSlug: string;
    tagline?: string;
    website?: string;
  }) {
    const existing = await this.prisma.providerUser.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already registered');

    const slugTaken = await this.prisma.provider.findUnique({
      where: { slug: dto.orgSlug },
    });
    if (slugTaken) throw new ConflictException('Organisation slug already taken');

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const provider = await this.prisma.provider.create({
      data: {
        slug: dto.orgSlug,
        name: dto.orgName,
        tagline: dto.tagline,
        website: dto.website,
        status: 'PENDING',
      },
    });

    const user = await this.prisma.providerUser.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: UserRole.PROVIDER,
        providerId: provider.id,
      },
    });

    return this.signTokens({
      sub: user.id,
      email: user.email,
      role: UserRole.PROVIDER,
      providerId: provider.id,
    });
  }

  // ─── Provider Login ───────────────────────────────────────────────────────

  async loginProvider(email: string, password: string) {
    const user = await this.prisma.providerUser.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.signTokens({
      sub: user.id,
      email: user.email,
      role: UserRole.PROVIDER,
      providerId: user.providerId,
    });
  }

  // ─── Admin Login ──────────────────────────────────────────────────────────

  async loginAdmin(email: string, password: string) {
    const user = await this.prisma.adminUser.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.signTokens({
      sub: user.id,
      email: user.email,
      role: UserRole.ADMIN,
    });
  }

  // ─── Provider profile (for /auth/me) ─────────────────────────────────────

  async getProviderMe(userId: string) {
    const user = await this.prisma.providerUser.findUnique({
      where: { id: userId },
      include: { provider: true },
    });
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash: _, ...safe } = user;
    return safe;
  }

  async getAdminMe(userId: string) {
    const user = await this.prisma.adminUser.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash: _, ...safe } = user;
    return safe;
  }

  // ─── Token signing ────────────────────────────────────────────────────────

  private signTokens(payload: {
    sub: string;
    email: string;
    role: string;
    providerId?: string;
  }) {
    const accessToken = this.jwt.sign(payload, {
      expiresIn: this.config.get('JWT_EXPIRES_IN') || '15m',
    });
    const refreshToken = this.jwt.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN') || '7d',
    });
    return { accessToken, refreshToken };
  }
}
