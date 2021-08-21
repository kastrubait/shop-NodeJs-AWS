import { Product } from "../model/product-model";
import mockData from "./product.json";

export class ProductService {

  getProductsList(): Promise<Product[]> {
    return Promise.resolve(mockData);
  }

}