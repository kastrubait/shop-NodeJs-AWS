import type { 
  APIGatewayProxyEvent, 
  APIGatewayProxyResult, 
  Handler 
} from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { 
  body: FromSchema<S> 
}
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedAPIGatewayProxyEvent<S>, 
  APIGatewayProxyResult
>

export type TResponse = {
  statusCode: number;
  headers: {
    'Access-Control-Allow-Origin': string;
    'Access-Control-Allow-Headers': string;
    'Access-Control-Allow-Methods': string;
  };
  body: string;
};

export const formatJSONResponse = (statusCode: number, response: Record<string, unknown> | string):TResponse => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(response),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS, PUT",
    }
  }
}
