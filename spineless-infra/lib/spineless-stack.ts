import * as apigateway from "@aws-cdk/aws-apigateway";
import * as acm from "@aws-cdk/aws-certificatemanager";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as lambda from "@aws-cdk/aws-lambda";
import * as route53 from "@aws-cdk/aws-route53";
import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as route53Targets from "@aws-cdk/aws-route53-targets";

import * as path from "path";
import { ViewerProtocolPolicy } from "@aws-cdk/aws-cloudfront";

const SPINELESS_CERT_ARN =
  "arn:aws:acm:us-east-1:462901810174:certificate/79ee09a8-a072-46b2-800b-67d30197fcb9";

export class SpinelessStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const hostedZone = route53.HostedZone.fromLookup(
      this,
      "spineless-hosted-zone",
      {
        domainName: "spineless.xyz",
      }
    );

    const certificate = acm.Certificate.fromCertificateArn(
      this,
      "spineless-certificate",
      SPINELESS_CERT_ARN
    );

    const dataTable = new dynamodb.Table(this, "spineless_data", {
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

    const backendLambda = new lambda.Function(this, "spineless-lambda", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset(
        path.join(__dirname, "../../spineless-server")
      ),
      handler: "dist/lambda/api.handler",
      environment: {
        DB_SPINELESS_TABLES: metaTable.tableName,
        DB_SPINELESS_DATA: dataTable.tableName,
      },
    });

    metaTable.grantReadWriteData(backendLambda);
    dataTable.grantReadWriteData(backendLambda);

    const api = new apigateway.LambdaRestApi(this, "spineless-api", {
      handler: backendLambda,
    });

    const websiteS3 = new s3.Bucket(this, "spineless-website");

    const cloudfrontDistribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "MyDistribution",
      {
        comment: "CDN for Web App",
        viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(
          certificate,
          {
            aliases: ["spineless.xyz"],
          }
        ),
        viewerProtocolPolicy: ViewerProtocolPolicy.ALLOW_ALL,
        originConfigs: [
          {
            // make sure your backend origin is first in the originConfigs list so it takes precedence over the S3 origin
            customOriginSource: {
              domainName: `${api.restApiId}.execute-api.${this.region}.${this.urlSuffix}`,
            },
            originPath: `/${api.deploymentStage.stageName}`,
            behaviors: [
              {
                isDefaultBehavior: true,
                cachedMethods: undefined,
                allowedMethods: cloudfront.CloudFrontAllowedMethods.ALL,
              },
            ],
          },
          {
            s3OriginSource: {
              s3BucketSource: websiteS3,
            },
            behaviors: [
              {
                pathPattern: "/",
              },
              {
                pathPattern: "/index.html",
              },
              {
                pathPattern: "/static",
              },
              {
                pathPattern: "/static/*",
              },
              {
                pathPattern: "/editor",
              },
              {
                pathPattern: "/editor/*",
              },
            ],
          },
        ],
      }
    );

    new route53.ARecord(this, "AliasRecord", {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(
        new route53Targets.CloudFrontTarget(cloudfrontDistribution)
      ),
    });

    new cdk.CfnOutput(this, "myOut", {
      value: cloudfrontDistribution.distributionDomainName,
    });
  }
}
