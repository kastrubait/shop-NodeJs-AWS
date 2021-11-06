import type { AWS } from '@serverless/typescript';

import basicAuthorizer from '@functions/basic-authorizer';

const serverlessConfiguration: AWS = {
  service: 'authorization-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
      packager: 'npm',
    },
  },
  plugins: [
    'serverless-webpack',
    "serverless-offline",
  ],
  resources: {
    Outputs: {
      basicAuthorizerArn: {
        Value: {
          'Fn::GetAtt': [
            'BasicAuthorizerLambdaFunction',
            'Arn',
          ]
        },
        Export: {
          Name: 'authLambdaArn'
        }
      },
    }
  },
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
      kastrubait: '${env:kastrubait}',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { basicAuthorizer },
  useDotenv: true,
};

module.exports = serverlessConfiguration;
