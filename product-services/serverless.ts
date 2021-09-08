import type { AWS } from '@serverless/typescript';

import getProductsList from "@functions/get-products-List";
import getProductsById from "@functions/get-product-by-id";
import documentation from "./serverless.doc";

const serverlessConfiguration: AWS = {
  service: 'product-services',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    documentation,
  },
  plugins: [
    'serverless-webpack',
    "serverless-offline",
    "serverless-openapi-documentation",
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: "dev",
    region: "eu-west-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },
  functions: { getProductsList, getProductsById },
};

module.exports = serverlessConfiguration;
