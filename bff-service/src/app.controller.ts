import { All, Controller, Param, Req, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { RecipientInterceptor } from './recipient.interceptor';

@Controller()
@UseInterceptors(RecipientInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @All(':recipientServiceName')
  getRecipientData(@Param('recipientServiceName') recipientServiceName: string, @Req() request: Request) {
    return this.appService.getResponse(recipientServiceName, request);
  }
}
