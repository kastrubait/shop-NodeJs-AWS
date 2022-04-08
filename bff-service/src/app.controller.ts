import { All, Controller, Param, Req, UseInterceptors, CACHE_MANAGER, Inject,  } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { Cache } from 'cache-manager';
import { RecipientInterceptor } from './recipient.interceptor';

@Controller()
@UseInterceptors(RecipientInterceptor)
export class AppController {
  constructor(private readonly appService: AppService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private readonly productsCache = 'PRODUCTS_CACHE';

  @All(':recipientServiceName')
  async getRecipientData(@Param('recipientServiceName') recipientServiceName: string, @Req() request: Request) {
    const dataResponse = this.appService.getResponse(recipientServiceName, request);
    const cachedProducts = await this.cacheManager.get(this.productsCache);
    
    if (request.method === 'GET' && recipientServiceName === 'products') {
      if (cachedProducts) {
        return cachedProducts;
      } else {
        await this.cacheManager.set(this.productsCache, dataResponse, { ttl: 120 });
      }
    }
    return dataResponse;
  }
}
