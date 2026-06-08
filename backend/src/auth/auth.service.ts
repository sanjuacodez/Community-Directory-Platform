import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import type { RegisterDto, LoginDto } from './dto/auth.dto';

const ROLE_PRIORITY: Record<string, number> = {
  super_admin: 3,
  family_admin: 2,
  member: 1,
};

function getPrimaryRole(roles: string[]): string {
  return roles.sort((a, b) => (ROLE_PRIORITY[b] ?? 0) - (ROLE_PRIORITY[a] ?? 0))[0];
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new UnauthorizedException('Email already registered');
    }

    const user = await this.usersService.create(dto.email, dto.password);
    const tokens = await this.generateTokens(user.id, user.email, 'member');

    return {
      user: {
        id: user.id,
        email: user.email,
        roles: user.userRoles.map((ur) => ur.role.name),
      },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const roles = user.userRoles.map((ur) => ur.role.name);
    const primaryRole = getPrimaryRole(roles);
    const tokens = await this.generateTokens(user.id, user.email, primaryRole);

    return {
      user: {
        id: user.id,
        email: user.email,
        roles,
      },
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env['JWT_REFRESH_SECRET'] ?? 'dev-refresh-secret-key-change-in-production',
      });

      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const roles = user.userRoles.map((ur) => ur.role.name);
      const primaryRole = getPrimaryRole(roles);
      return this.generateTokens(user.id, user.email, primaryRole);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env['JWT_REFRESH_SECRET'] ?? 'dev-refresh-secret-key-change-in-production',
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}
