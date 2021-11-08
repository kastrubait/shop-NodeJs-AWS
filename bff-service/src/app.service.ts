import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { map, Observable } from 'rxjs';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    private httpService: HttpService
  ) {}
  sendRequest(
    recipientServiceName: string, 
    request: Request
  ): Observable<AxiosResponse<any>> {
    const recipientUrl: string = this.configService.get(recipientServiceName);
    console.log('start ->', request.method, recipientServiceName);
    console.log(recipientUrl);
    if (recipientUrl) {
      delete request.headers.host;
      delete request.headers.connection;

      const axiosConfig: any = {
        url: recipientUrl + request.originalUrl,
        headers: request.headers,
        method: request.method,
        ...Object.keys(request.body || {}).length > 0 && {
          data: request.body
        }
      };
      try {
        return this.httpService.request(axiosConfig);
      } catch (error) {
        return error;
      }
    }
  }

  getResponse(
    recipientServiceName: string, 
    request: Request
  ): Observable<AxiosResponse<any>> {
    return this.sendRequest(recipientServiceName, request).pipe(
      map((response) => {
        // for (const [key, value] of Object.entries(request.headers)) {
        //   request.res.setHeader(key, value);
        // }
        return response.data;
      })
    );
  }
}
