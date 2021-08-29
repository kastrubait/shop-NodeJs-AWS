import { GetProductsListController } from "./getProductsList";
import { ProductService } from "../../service/product-service";

import { formatJSONResponse } from "../../libs/apiGateway";

const mockData = [
  { id: "1", title: "test1" },
  { id: "2", title: "test2" },
  { id: "3", title: "test3" },
];
const mockError = new Error("An Error was thrown");

const productService: ProductService = {
  getProductsList: jest.fn(() => Promise.resolve(mockData)),
  getProductById: jest.fn(() => Promise.resolve(mockData[0])),
} as any as ProductService;

const productServiceWithError: ProductService = {
  getProductsList: jest.fn(() => Promise.reject(mockError)),
} as any as ProductService;

jest.mock("../../libs/apiGateway", () => ({
  formatJSONResponse: jest.fn((_obj, response) => {
    return response;
  }),
}));

describe("getProductsList", () => {
  let getProductsListController: GetProductsListController;

  beforeEach(() => {
    getProductsListController = new GetProductsListController(productService);
  });

  test("should return correct products list", async () => {
    const response = await getProductsListController.handler(null, null, null);
    expect(response).toEqual(mockData);
  });

  test("should call formatJSONResponse once with correct value", async () => {
    await getProductsListController.handler(null, null, null);
    expect(formatJSONResponse).nthCalledWith(1, 200, mockData);
  });

  test("should return an Error message in case of error", async () => {
    getProductsListController = new GetProductsListController(
      productServiceWithError
    );
    const response = await getProductsListController.handler(null, null, null);
    expect(response).toEqual(mockError.message);
  });
});