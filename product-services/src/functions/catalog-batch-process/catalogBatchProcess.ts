import "source-map-support/register";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { SQSEvent, SQSRecord } from "aws-lambda";
import { Product } from "../../model/product-model";
import { ProductNewService } from "../../service/product-new-service";

export const catalogBatchProcess = async (event: SQSEvent) => {
  try {
    console.log("catalogBatchProcess lambda is executing", event.Records);
    const createdProducts = event.Records.map(async (record: SQSRecord) => {
      const product: Product = JSON.parse(record.body);
      const newService = new ProductNewService();
      const savedProduct = await newService.createProduct (product);
      return savedProduct;
    });
    return createdProducts;
  } catch (error) {
    return formatJSONResponse(500, error);
  }
};

export const handler = middyfy(catalogBatchProcess);