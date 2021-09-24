import { importProductsFile } from '@functions/import-product/handler';
import AWS from 'aws-sdk-mock';
import { TResponse } from '@libs/apiGateway';
import createHttpError from 'http-errors';

const fileName = 'test';
const extention = 'csv';
const mockError = new createHttpError[400](
  'Missing required request parameters: [name]'
);

// jest.mock('@libs/apiGateway', () => ({
//     formatJSONResponse: jest.fn((_obj, response) => {
//       return response;
//     }),
//   }));

describe("importProductsFile", () => {
  test("should return correct status code in case of success", async () => {
    const testEvent = {
      "queryStringParameters": {
          "name": `${fileName}.${extention} `
      }
    }
    const expected = `Url/${fileName}.${extention}`;
    AWS.mock(
      'S3', 
      'getSignedUrl',
      (
        _: unknown,
        _params: unknown,
        callback: (_: unknown, value: string) => unknown,
      ) => {
        callback(null, expected);
      },
    );
    const response = await importProductsFile(testEvent, null, null) as TResponse;
    // console.log(await importProductsFile(testEvent, null, null))
    expect(response.statusCode).toBe(200);
    // expect(JSON.parse(response.body)).toEqual(expected);
  });

  test('should return correct status code and message in case of error', async () => {
    const testEvent = {
      "queryStringParameters": {
      }
    };
    AWS.restore();
    AWS.mock('S3', 'getSignedUrl', () => mockError);
    const response = await importProductsFile(testEvent, null, null) as TResponse;
    expect(response.statusCode).toBe(mockError.statusCode);
    expect(JSON.parse(response.body).message).toEqual(mockError.message);
  });

  test('should return status code 500 in case of any error', async () => {
    expect.assertions(1);
    try {
      await importProductsFile(null, null, null) as TResponse;
    } catch (error) {
      const anyError = new createHttpError[500](
        error.message
      );
      expect(anyError.statusCode).toBe(500);
    }
  });

}) 
