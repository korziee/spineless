import * as apigateway from "@aws-cdk/aws-apigateway";
import * as acm from "@aws-cdk/aws-certificatemanager";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as lambda from "@aws-cdk/aws-lambda";
import * as route53 from "@aws-cdk/aws-route53";
import * as cdk from "@aws-cdk/core";
import * as origins from "@aws-cdk/aws-cloudfront-origins";
import * as s3 from "@aws-cdk/aws-s3";

import * as path from "path";

// TODO
// - Api gateway routes
// - Lambda handler
//     - [https://docs.aws.amazon.com/cdk/api/latest/docs/aws-lambda-readme.html](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-lambda-readme.html)
//     - lambda.Code.fromBucket(bucket, key[, objectVersion]) - specify an S3 object that contains the archive of your runtime code.
// - S3 bucket (website assets & React app)
// - Cloudfront endpoint
// - Dynamo db
// DONE
// - Domain (spineless.xyz)
// - Route 53 hosted zone (point all traffic to cloudfront origin)
// - ACM certificate

export class SpinelessStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // set up DNS
    const myHostedZone = new route53.HostedZone(this, "HostedZone", {
      zoneName: "spineless.xyz",
    });

    // create TLS certificate
    const myCertificate = new acm.DnsValidatedCertificate(this, "mySiteCert", {
      domainName: "example.com",
      hostedZone: myHostedZone,
      region: "us-east-1",
    });

    const backendFn = new lambda.Function(this, "MyFunction", {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: "index.handler",
      // TODO: Replace with directory with compiled app
      code: lambda.Code.fromAsset(path.join(__dirname, "lambda-handler")),
    });

    const api = new apigateway.LambdaRestApi(this, "spineless-api", {
      handler: backendFn,
    });

    const websiteS3 = new s3.Bucket(this, "website");

    const websiteOrigin = new origins.S3Origin(websiteS3);

    // create cloudfront distro
    new cloudfront.Distribution(this, "myDist", {
      defaultBehavior: { origin: new origins.HttpOrigin(api.url) },
      additionalBehaviors: {
        "/": {
          origin: websiteOrigin,
        },
        "/static/*": {
          origin: websiteOrigin,
        },
        "/editor/*": {
          origin: websiteOrigin,
        },
      },
      domainNames: ["spineless.xyz"],
      certificate: myCertificate,
    });
  }
}
