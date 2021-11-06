import "source-map-support/register";
import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerHandler,
  // APIGatewayRequestAuthorizerHandler,
} from "aws-lambda";

import { middyfy } from "@libs/lambda";

const enum PolicyAction {
  DENY = "Deny",
  ALLOW = "Allow",
}  

const basicAuthorizer: APIGatewayTokenAuthorizerHandler = (event, _, cb) => {
  if (event.type !== "TOKEN") {
    cb("Unauthorized");
    console.error(`No authorization header (${event.type})`);
  }
  // if (event.type !== "REQUEST") {
  //   cb("Unauthorized");
  //   console.error("No queryStringParameters");
  // }
  try {
    console.log("Received event:", JSON.stringify(event, null, 2));
    const authorizationToken: string = event.authorizationToken;
    const encodedCreds: string = authorizationToken.split(" ")[1];
    // const encodedCreds: string = event.queryStringParameters.token;
    const buffer: Buffer = Buffer.from(encodedCreds, "base64");
    const plainCreds: string[] = buffer.toString("utf-8").split(":");
    const userName: string = plainCreds[0];
    const password: string = plainCreds[1];

    console.log(`userName: ${userName}, password: ${password}`);

    const storedUserPassword: string = process.env[userName];
    const effect: PolicyAction =
      !storedUserPassword || storedUserPassword !== password
        ? PolicyAction.DENY
        : PolicyAction.ALLOW;
    const policy = generatePolicy(encodedCreds, event.methodArn, effect);
    cb(null, policy);
  } catch (error) {
    console.error("Error", error);
    cb("Unauthorized");
  }
};

const generatePolicy = (principalId: string, resource: string, effect: string): APIGatewayAuthorizerResult => {
  console.log("resource", resource);
  console.log("effect", effect);
  return {
    principalId: principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
};

export const handler = middyfy(basicAuthorizer);