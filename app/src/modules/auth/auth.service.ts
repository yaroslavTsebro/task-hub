import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '../jwt/jwt.service';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from 'src/shared/dto/auth/login';
import { RefreshDto } from 'src/shared/dto/auth/refresh';
import { RegisterDto } from 'src/shared/dto/auth/register';
import { hashPassword, verifyPassword } from 'src/shared/system/hash';
import { UserRepository } from '../data/repository/user.repository';

@Injectable()
export class AuthService {
  private readonly accessTokenExpiration: number;
  private readonly refreshTokenExpiration: number;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenSecret: string;

  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessTokenExpiration = this.configService.get<number>('ACCESS_TOKEN_EXPIRATION', 900);
    this.refreshTokenExpiration = this.configService.get<number>('REFRESH_TOKEN_EXPIRATION', 604800);

    this.refreshTokenSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    this.accessTokenSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
  }

  async register(dto: RegisterDto) {
    const { email, name, password } = dto;

    const existingUser = await this.userRepo.findByEmail(email);

    if (existingUser) throw new ConflictException('User already exists')

    const passwordHash = await hashPassword(password);
    const user = await this.userRepo.create(email, name, passwordHash);

    return this.generateTokens(user.id, user.email);
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.userRepo.findByEmail(email);

    if (!user || !(await verifyPassword(password, user.passwordHash))) { throw new UnauthorizedException('Invalid credentials'); }

    return this.generateTokens(user.id, user.email);
  }

  async refreshToken(dto: RefreshDto) {
    const { token } = dto;

    const payload = this.jwtService.verify(token, this.refreshTokenSecret);

    const user = await this.userRepo.findById(payload.sub);
    if (!user) throw new UnauthorizedException('User not found');

    return this.generateTokens(user.id, user.email);
  }

  private generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const accessToken = this.jwtService.sign(payload, this.accessTokenSecret, { expiresIn: `${this.accessTokenExpiration}s` });
    const refreshToken = this.jwtService.sign(payload, this.refreshTokenSecret, { expiresIn: `${this.refreshTokenExpiration}s` });

    return { accessToken, refreshToken };
  }
}
