import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('User-Agent') || '';
    const timestamp = new Date().toISOString();
    
    console.log(`[${timestamp}] ${method} ${originalUrl} - ${ip} - ${userAgent}`);
    
    const start = Date.now();
    
    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;
      console.log(`[${timestamp}] ${method} ${originalUrl} - ${statusCode} - ${duration}ms`);
    });
    
    next();
  }
}