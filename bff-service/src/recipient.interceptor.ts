import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { BadGatewayException } from './bad-gateway-exception';

@Injectable()
export class RecipientInterceptor implements NestInterceptor {
  intercept(
      context: ExecutionContext, 
      next: CallHandler
    ): Observable<any> {
    const host = context.switchToHttp();
    const recipientName = host.getRequest().params.recipientServiceName;

    if (!recipientName || !process.env[recipientName]) {
      throw new BadGatewayException();
    }
    return next.handle();
  }
}