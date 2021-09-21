import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/import-product';
import importFileParser from '@functions/import-file-parser';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '2',
  useDotenv: true,
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    },
    bucketName: "tamiko-shop-csv-upload",
    uploadFolderName: "uploaded",
    parsedFolderName: "parsed"
  },
  plugins: [
    "serverless-webpack",
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
      S3_BUCKET_NAME: "${self:custom.bucketName}"
    },
    iamRoleStatements: [
      {
        'Effect': 'Allow',
        'Action': ['s3:*'],
        'Resource': [
          "arn:aws:s3:::${self:custom.bucketName}",
          "arn:aws:s3:::${self:custom.bucketName}/*",
          "arn:aws:s3:::${self:custom.bucketName}/*/*"
        ]
      },
    ],
    lambdaHashingVersion: '20201221',
  },
  functions: { importProductsFile, importFileParser },
};

module.exports = serverlessConfiguration;
