import type { AWS } from '@serverless/typescript';

import getProductsList from "@functions/get-products-List";
import getProductsById from "@functions/get-product-by-id";
import createProduct from '@functions/create-product';
import documentation from "./serverless.doc";
// import dbConfig from "./db.config";

const serverlessConfiguration: AWS = {
  service: 'product-services',
  frameworkVersion: '2',
  useDotenv: true,
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    // dbConfig,
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
      DB_HOST: "${self:custom.dbConfig.DB_HOST, env:DB_HOST, ''}",
      DB_PORT: "${self:custom.dbConfig.DB_PORT, env:DB_PORT, ''}",
      DB_DATABASE: "${self:custom.dbConfig.DB_DATABASE, env:DB_DATABASE, ''}",
      DB_USER: "${self:custom.dbConfig.DB_USER, env:DB_USER, ''}",
      DB_PASSWORD: "${self:custom.dbConfig.DB_PASSWORD, env:DB_PASSWORD, ''}",
    },
    lambdaHashingVersion: '20201221',
  },
  functions: { getProductsList, getProductsById, createProduct },
};

module.exports = serverlessConfiguration;
