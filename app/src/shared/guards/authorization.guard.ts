import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const accessToken = request.cookies['accessToken'];
    
    if (!accessToken) { throw new UnauthorizedException('No access token in cookies'); }

    try {
      const payload = verify(accessToken, process.env.JWT_ACCESS_SECRET);
      request.user = payload;
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
