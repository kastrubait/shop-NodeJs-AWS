import "source-map-support/register";
import {
  InputAPIGatewayProxyEvent,
  formatJSONResponse,
} from "../../libs/apiGateway";
import { middyfy } from "../../libs/lambda";
import createHttpError from "http-errors";

import { ProductServiceInstance } from "../../service/product-service";
import { ProductServiceInterface } from "../../service/product-service-interface";

export class GetProductsListController {
  constructor(private service: ProductServiceInterface) {}

  handler: InputAPIGatewayProxyEvent = async () => {
    try {
      const products = await this.service.getProductsList();
      return formatJSONResponse(200, products);
    } catch (error) {
      const response = new createHttpError.InternalServerError(error.message);
      return formatJSONResponse(response.statusCode, response.message);
    }
  };
}

export const getProductsList = middyfy(
  new GetProductsListController(ProductServiceInstance).handler
);
