import type { 
  APIGatewayProxyEvent, 
  APIGatewayProxyResult, 
  Handler 
} from "aws-lambda"

export type ValidatedEventAPIGatewayProxyEvent = Handler<
  APIGatewayProxyEvent, 
  APIGatewayProxyResult
>

export const formatJSONResponse = (statusCode: number, response: Object) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(response),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  }
}
