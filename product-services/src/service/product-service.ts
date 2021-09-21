import { QueryConfig, Pool } from "pg";
import { Product } from "../model/product-model";
import { ProductServiceInterface } from "./product-service-interface";

const SQL_GET_PRODUCTS_LIST =
  "SELECT p.id, p.title, p.description, p.price, s.count, p.image FROM products p LEFT JOIN stocks s on p.id = s.product_id";

const SQL_GET_PRODUCT_BY_ID = SQL_GET_PRODUCTS_LIST + " WHERE p.id = $1";

const CREATE_PRODUCT =
  "INSERT INTO products (title, description, price, image) VALUES ($1, $2, $3, $4) RETURNING id";

const CREATE_COUNT = "INSERT INTO stocks (product_id, count) VALUES ($1, $2)";

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

  async createProduct(product: Omit<Product, "id">) {
    const result = await this.runTransactionQuery(product);
    return result.rows[0];
  }

  private async runQuery<R>(query: QueryConfig) {
    const client = await this.clientPool.connect();
    try {
      const result = await client.query<R>(query);
      return result;
    } catch (error) {
      console.log("Error:", error);
    } finally {
      client.release();
    }
  };

  private async runTransactionQuery(product: Omit<Product, "id">) {
    console.log('product:', typeof product);
    const client = await this.clientPool.connect();
    try {
      await client.query("BEGIN");
      const result = await client.query(CREATE_PRODUCT, [
        product.title,
        product.description,
        product.price,
        product.image,
      ]);
      client.query(CREATE_COUNT, [result.rows[0].id, product.count]);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      console.log(error);
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

export const ProductServiceInstance: ProductService = new ProductService(
  connectionPool
);