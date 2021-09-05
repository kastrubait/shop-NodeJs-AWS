import { QueryConfig, Pool } from "pg";
import { Product } from "../model/product-model";
import { ProductServiceInterface } from "./product-service-interface";

const SQL_GET_PRODUCTS_LIST =
  "SELECT p.id, p.title, p.description, p.price, s.count, p.image FROM products p LEFT JOIN stocks s on p.id = s.product_id";

const SQL_GET_PRODUCT_BY_ID = SQL_GET_PRODUCTS_LIST + " WHERE p.id = $1";

const connectionPool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  idleTimeoutMillis: 5000,
});

class ProductService implements ProductServiceInterface {
  private clientPool: Pool = null;

  constructor(pool: Pool) {
    this.clientPool = pool;
  }

  async getProductsList() {
    const result = await this.runQuery<Product>({
      text: SQL_GET_PRODUCTS_LIST,
    });
    return result.rows;
  }

  async getProductById(id: string) {

    const result = await this.runQuery<Product>({
      text: SQL_GET_PRODUCT_BY_ID,
      values: [id],
    });
    return result.rows[0];
  }

  private async runQuery<R>(query: QueryConfig) {
    const client = await this.clientPool.connect();
    try {
      const result = await client.query<R>(query);
      console.log('runQuery', result);
      return result;
    } catch (error) {
      console.log("Error:", error);
    } finally {
      client.release();
    }
  }
}

export const ProductServiceInstance: ProductService = new ProductService(
  connectionPool
);