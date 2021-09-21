import { Product } from "../model/product-model";

export interface ProductServiceInterface {
  getProductsList: () => Promise<Product[]>;
  getProductById: (id: string) => Promise<Product>;
  createProduct: (product: Omit<Product, "id">) => Promise<Pick<Product, "id">>;
}