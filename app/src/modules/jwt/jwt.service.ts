import { Injectable, UnauthorizedException } from '@nestjs/common';
import { sign, verify, SignOptions } from 'jsonwebtoken';

@Injectable()
export class JwtService {
  constructor() { }

  sign(payload: object, secret: string, options?: SignOptions): string {
    return sign(payload, secret, options);
  }

  verify(token: string, secret: string): any {
    try {
      return verify(token, secret);
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

