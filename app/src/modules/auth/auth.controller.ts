import { Controller, Post, Body, Res, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/shared/dto/auth/login';
import { RefreshDto } from 'src/shared/dto/auth/refresh';
import { RegisterDto } from 'src/shared/dto/auth/register';
import { ConfigService } from '@nestjs/config';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly accessTokenExpiration: number;
  private readonly refreshTokenExpiration: number;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.accessTokenExpiration = this.configService.get<number>('ACCESS_TOKEN_EXPIRATION', 900);
    this.refreshTokenExpiration = this.configService.get<number>('REFRESH_TOKEN_EXPIRATION', 604800);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Register new user' })
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.register(dto);
    this.setCookies(res, accessToken, refreshToken);
    return { message: 'User registered successfully' };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(dto);
    this.setCookies(res, accessToken, refreshToken);
    return { message: 'User logged in successfully' };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Body() dto: RefreshDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.refreshToken(dto);
    this.setCookies(res, accessToken, refreshToken);
    return { message: 'Tokens refreshed successfully' };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('accessToken', '', { httpOnly: true, sameSite: 'strict', expires: new Date(0) });

    res.cookie('refreshToken', '', { httpOnly: true, sameSite: 'strict', expires: new Date(0) });

    return { message: 'User logged out successfully' };
  }

  private setCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'strict', maxAge: this.accessTokenExpiration });

    res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict', maxAge: this.refreshTokenExpiration });
  }
}
