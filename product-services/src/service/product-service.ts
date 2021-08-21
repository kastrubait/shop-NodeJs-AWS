import { Product } from "../model/product-model";
import mockData from "./product.json";

export class ProductService {

  getProductsList(): Promise<Product[]> {
    return Promise.resolve(mockData);
  }

  async getProductById(id: string): Promise<Product> {
    const products = await this.getProductsList();
    return products.find((product) => product.id === id);
  }
}