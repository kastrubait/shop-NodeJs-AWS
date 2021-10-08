import { handlerPath } from "@libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/catalogBatchProcess.handler`,
  events: [
    {
      sqs: {
        batchSize: 5,
        arn: "arn:aws:sqs:eu-west-1:274349858350:catalog-queue",
      },
    },
  ],
};