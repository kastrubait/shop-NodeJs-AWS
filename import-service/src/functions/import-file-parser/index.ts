import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.importFileParser`,
  events: [
    {
      s3: {
        bucket: 'tamiko-shop-csv-upload',
        event: 's3:ObjectCreated:*',
        rules: [
          {
            prefix: 'uploaded/',
          },
        ],
        existing: true,
      },
    },
  ],
}