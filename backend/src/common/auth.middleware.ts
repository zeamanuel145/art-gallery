import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const payload = this.jwtService.verify(token);
        (req as any).user = { userId: payload.sub, email: payload.email };
        console.log(`✅ Authenticated user: ${payload.email}`);
      } catch (error) {
        console.log(`❌ Invalid token: ${error.message}`);
        // Don't throw error here - let guards handle it
      }
    }
    
    next();
  }
}