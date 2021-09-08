import "source-map-support/register";
import {
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
} from "../../libs/apiGateway";
import { middyfy } from "../../libs/lambda";
import createHttpError from "http-errors";

import { ProductService } from "../../service/product-service";

export class GetProductsListController {
  constructor(private service: ProductService) {}

  handler: ValidatedEventAPIGatewayProxyEvent = async () => {
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
  new GetProductsListController(new ProductService()).handler
);
