import * as apigateway from "@aws-cdk/aws-apigateway";
import * as acm from "@aws-cdk/aws-certificatemanager";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as lambda from "@aws-cdk/aws-lambda";
import * as route53 from "@aws-cdk/aws-route53";
import * as cdk from "@aws-cdk/core";
import * as origins from "@aws-cdk/aws-cloudfront-origins";
import * as s3 from "@aws-cdk/aws-s3";
import * as dynamodb from "@aws-cdk/aws-dynamodb";

import * as path from "path";

export class SpinelessStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const zone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      "spineless-hosted-zone",
      {
        hostedZoneId: "Z03819212MSQFSXR2027E",
        zoneName: "spineless.xyz",
      }
    );

    // create TLS certificate
    const myCertificate = new acm.DnsValidatedCertificate(
      this,
      "spineless-certificate",
      {
        domainName: "spineless.xyz",
        hostedZone: zone,
        region: "us-east-1",
      }
    );

    const backendFn = new lambda.Function(this, "spineless-lambda", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "index.handler",
      // TODO: Replace with directory with compiled app
      code: lambda.Code.fromAsset(path.join(__dirname, "../lambda_temp")),
    });

    const api = new apigateway.LambdaRestApi(this, "spineless-api", {
      handler: backendFn,
    });

    const websiteS3 = new s3.Bucket(this, "spineless-website");

    const websiteOrigin = new origins.S3Origin(websiteS3);

    const cfDistribution = new cloudfront.Distribution(this, "myDist", {
      defaultBehavior: { origin: new origins.HttpOrigin(api.url) },
      additionalBehaviors: {
        // TODO better way to point additional behaviors?
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

    // we need this information to assume credentials locally
    new cdk.CfnOutput(this, "Cloudfront Distro URL", {
      value: cfDistribution.distributionDomainName,
    });

    const dataTable = new dynamodb.Table(this, "spineless_data", {
      // namespace/table
      partitionKey: {
        name: "namespaced_table",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: { name: "id", type: dynamodb.AttributeType.STRING },
    });

    const metaTable = new dynamodb.Table(this, "spineless_tables", {
      partitionKey: {
        name: "namespace",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: { name: "table", type: dynamodb.AttributeType.STRING },
    });
  }
}
