import { getProductsList } from "./get-products-list/getProductsList";
import { getProductById } from "./get-product-by-id/getProductById";
import { handler as createProduct } from "./create-product/createProduct";
import { handler as catalogBatchProcess } from "./catalog-batch-process/catalogBatchProcess";

export { getProductsList, getProductById, createProduct, catalogBatchProcess };
