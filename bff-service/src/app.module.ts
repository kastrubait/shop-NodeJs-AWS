import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from "@nestjs/axios";
import { RecipientInterceptor } from './recipient.interceptor';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, RecipientInterceptor],
})
export class AppModule {}
