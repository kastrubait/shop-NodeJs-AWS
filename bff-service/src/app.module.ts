import { Module, CacheModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from "@nestjs/axios";
import { RecipientInterceptor } from './recipient.interceptor';

@Module({
  imports: [
    HttpModule, 
    ConfigModule.forRoot(),
    CacheModule.register(),
  ],
  controllers: [AppController],
  providers: [AppService, RecipientInterceptor],
})
export class AppModule {}
