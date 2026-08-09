import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { appendFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    try {
      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers && (req.headers.authorization || req.headers.Authorization);
      const msg = `JwtAuthGuard: incoming Authorization header: ${JSON.stringify(authHeader)}\n`;
      console.log(msg.trim());
      const logDir = join(process.cwd(), 'backend_logs');
      if (!existsSync(logDir)) mkdirSync(logDir);
      appendFileSync(join(logDir, 'jwt-debug.log'), msg);
    } catch (e) {
      const errMsg = `JwtAuthGuard: failed to read request headers ${String(e)}\n`;
      console.error(errMsg);
      const logDir = join(process.cwd(), 'backend_logs');
      if (!existsSync(logDir)) mkdirSync(logDir);
      appendFileSync(join(logDir, 'jwt-debug.log'), errMsg);
    }
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    const msg = `JwtAuthGuard.handleRequest: user=${JSON.stringify(user)} info=${JSON.stringify(info)} err=${JSON.stringify(err)}\n`;
    console.log(msg.trim());
    const logDir = join(process.cwd(), 'backend_logs');
    if (!existsSync(logDir)) mkdirSync(logDir);
    appendFileSync(join(logDir, 'jwt-debug.log'), msg);
    if (err || !user) {
      const errMsg = `JWT Auth Error: ${JSON.stringify(err || info)}\n`;
      console.error(errMsg);
      appendFileSync(join(logDir, 'jwt-debug.log'), errMsg);
      throw err || new UnauthorizedException('Invalid or missing token');
    }
    return user;
  }
}