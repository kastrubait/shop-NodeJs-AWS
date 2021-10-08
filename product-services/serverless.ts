import type { AWS } from '@serverless/typescript';

import getProductsList from "@functions/get-products-List";
import getProductsById from "@functions/get-product-by-id";
import createProduct from '@functions/create-product';
import catalogBatchProcess from '@functions/catalog-batch-process';
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
    productsSqsName: "catalog-queue",
    emailToNotify: "${self:custom.dbConfig.NOTIFY_EMAIL, env:NOTIFY_EMAIL, ''}",
    emailWithFilter:
      "${self:custom.dbConfig.NOTIFY_WITH_FILTER_EMAIL, env:NOTIFY_WITH_FILTER_EMAIL, ''}",
  },
  plugins: [
    'serverless-webpack',
    "serverless-offline",
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
      SNS_ARN: {
        Ref: "SNSTopic",
      },
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: "sqs:*",
            Resource: "arn:aws:sns:eu-west-1:274349858350:products-created",
          },
        ],
      },
    },
    lambdaHashingVersion: '20201221',
  },
  resources: {
    Resources: {
      SNSTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "products-created",
        },
      },
      SNSSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "${self:custom.emailToNotify}",
          Protocol: "email",
          TopicArn: {
            Ref: "SNSTopic",
          },
        },
      },
      SNSTitleFilterSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "${self:custom.emailWithFilter}",
          Protocol: "email",
          TopicArn: {
            Ref: "SNSTopic",
          },
          FilterPolicy: {
            hasTitle: ["true"],
          },
        },
      },
    },
  },
  functions: { getProductsList, getProductsById, createProduct, catalogBatchProcess, },
};

module.exports = serverlessConfiguration;
