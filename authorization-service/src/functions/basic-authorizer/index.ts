import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/basicAuthorizer.handler`,
  events: [
    {
      http: {
        method: 'get',
        path: 'token',
        cors: true
      }
    }
  ]
}
