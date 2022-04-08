import { HttpException } from '@nestjs/common';

export class BadGatewayException extends HttpException {
  constructor() {
    super('Cannot process request', 502);
  }
}