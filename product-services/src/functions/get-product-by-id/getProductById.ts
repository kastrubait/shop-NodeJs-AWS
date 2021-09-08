import "source-map-support/register";
import {
  InputAPIGatewayProxyEvent,
  formatJSONResponse,
} from "../../libs/apiGateway";
import { middyfy } from "../../libs/lambda";
import createHttpError from "http-errors";

import { ProductServiceInstance } from "../../service/product-service";
import { ProductServiceInterface } from "../../service/product-service-interface";

export class GetProductByIdController {
  constructor(private service: ProductServiceInterface) {}

  handler: InputAPIGatewayProxyEvent = async (event, context) => {
    console.log("Incoming request", event);
    context.callbackWaitsForEmptyEventLoop = false;
    try {
      const productId = event.pathParameters.productId;
      const product = await this.service.getProductById(productId);
      if (product) {
        return formatJSONResponse(200, product);
      } else {
        const response = new createHttpError.BadRequest(
          `Product with Id: '${productId}' not found`
        );
        return formatJSONResponse(response.statusCode, response.message);
      }
    } catch (error) {
      const response = new createHttpError.InternalServerError(error.message);
      return formatJSONResponse(response.statusCode, response.message);
    }
  };
}

export const getProductById = middyfy(
  new GetProductByIdController(ProductServiceInstance).handler
);
