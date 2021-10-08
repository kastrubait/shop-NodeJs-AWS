import createHttpError from "http-errors";
import { QueryConfig, ClientConfig, Client } from "pg";
import { Product } from "../model/product-model";
import { ProductServiceInterface } from "./product-service-interface";

const dbOptions: ClientConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};

export class ProductNewService implements ProductServiceInterface {
  private client: Client;
  private readonly SQL_GET_PRODUCTS_LIST =
  "SELECT p.id, p.title, p.description, p.price, s.count, p.image FROM products p LEFT JOIN stocks s on p.id = s.product_id";

  private readonly SQL_GET_PRODUCT_BY_ID = this.SQL_GET_PRODUCTS_LIST + " WHERE p.id = $1";

  private readonly CREATE_PRODUCT =
  "INSERT INTO products (title, description, price, image) VALUES ($1, $2, $3, $4) RETURNING id";

  private readonly CREATE_COUNT = "INSERT INTO stocks (product_id, count) VALUES ($1, $2)";

  async getProductsList(): Promise<Product[]> {
    const result = await this.runQuery<Product>({
      text: this.SQL_GET_PRODUCTS_LIST,
    });
    return result.rows;
  }

  async getProductById(id: string): Promise<Product> {
    const uuidRegexp: RegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isIdValid = uuidRegexp.test(id);
    if (isIdValid) {
    const result = await this.runQuery<Product>({
      text: this.SQL_GET_PRODUCT_BY_ID,
      values: [id],
    });
    return result.rows[0];
    } else {
        throw new createHttpError.BadRequest(`Wrong uuid: ${id}`)
    }
  }

  async createProduct(product: Product): Promise<Product> {
    this.client = new Client(dbOptions);
    await this.client.connect();
    try {
      await this.client.query("BEGIN");
      const result = await this.client.query(this.CREATE_PRODUCT, [
        product.title,
        product.description,
        product.price,
        product.image,
      ]);
      const { 
        rows: [createdProduct] 
      } = result;
      const countResult = await this.client.query(this.CREATE_COUNT, [createdProduct.id, product.count]);
      await this.client.query("COMMIT");
      const {
        rows: [count],
      } = countResult;
      console.log("Product is created:", createdProduct);
      return { 
        ...createdProduct,
        count: count,
      };
    } catch (error) {
      console.log("Create product error: ", error);
      await this.client.query("ROLLBACK");
      throw error;
    } finally {
      await this.client.end();
    }
  }

  private async runQuery<R>(query: QueryConfig) {
    this.client = new Client(dbOptions);
    await this.client.connect();
    try {
      const result = await this.client.query<R>(query);
      console.log("result", result);
      return result;
    } catch (error) {
      console.error("Failed to execute query:", query);
      console.error("Error:", error);
      throw error;
    } finally {
        await this.client.end();
    }
  };
}
