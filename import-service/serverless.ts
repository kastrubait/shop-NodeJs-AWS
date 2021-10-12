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
      S3_BUCKET_NAME: "${self:custom.bucketName}",
      SQS_URL: { Ref: 'SQSQueue' }
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
      {
        'Effect': 'Allow',
        'Action': 'sqs:*',
        'Resource': {
          'Fn::GetAtt': ['SQSQueue', 'Arn'],
        }      
      }
    ],
    lambdaHashingVersion: '20201221',
  },
  resources: {
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalog-queue',
          ReceiveMessageWaitTimeSeconds: 20,
        },
      },
      GatewayResponseAccessDenied: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Methods': "'GET,OPTIONS'"
          },
          ResponseType: 'ACCESS_DENIED',
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
          },
        },
      },
      GatewayResponseUnauthorized: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Methods': "'GET,OPTIONS'"
          },
          ResponseType: 'DEFAULT_4XX',
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
          },
        },
      },
    },
    Outputs: {
      SqsQueueArn: {
        Value: {
          'Fn::GetAtt': ['SQSQueue', 'Arn'],
        },
        Export: {
          Name: 'catalogQueue',
        },
      },
    },
  },
  functions: { importProductsFile, importFileParser },
};

module.exports = serverlessConfiguration;
