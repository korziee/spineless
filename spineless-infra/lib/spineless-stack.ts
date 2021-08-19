import * as apigateway from "@aws-cdk/aws-apigateway";
import * as acm from "@aws-cdk/aws-certificatemanager";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import { AllowedMethods, ViewerProtocolPolicy } from "@aws-cdk/aws-cloudfront";
import * as cloudfrontOrigins from "@aws-cdk/aws-cloudfront-origins";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";
import * as route53 from "@aws-cdk/aws-route53";
import * as route53Targets from "@aws-cdk/aws-route53-targets";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";
import * as cdk from "@aws-cdk/core";
import * as path from "path";

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
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS // this is also the default
      }
    });

    const websiteS3 = new s3.Bucket(this, "spineless-website", {
      websiteIndexDocument: "index.html",
    });

    websiteS3.grantPublicAccess();

    const websiteOrigin = new cloudfrontOrigins.S3Origin(websiteS3);

    const websiteBehaviour: cloudfront.BehaviorOptions = {
      origin: websiteOrigin,
      allowedMethods: AllowedMethods.ALLOW_ALL,
      viewerProtocolPolicy: ViewerProtocolPolicy.ALLOW_ALL,
    };

    const cfDistribution = new cloudfront.Distribution(
      this,
      "spineless-cloudfront-distribution",
      {
        domainNames: ["spineless.xyz"],
        certificate: certificate,
        defaultBehavior: {
          allowedMethods: AllowedMethods.ALLOW_ALL,
          viewerProtocolPolicy: ViewerProtocolPolicy.ALLOW_ALL,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          origin: new cloudfrontOrigins.HttpOrigin(
            `${api.restApiId}.execute-api.${this.region}.${this.urlSuffix}`,
            {
              originPath: `/${api.deploymentStage.stageName}`,
            }
          ),
        },
        additionalBehaviors: {
          "/": websiteBehaviour,
          "/index.html": websiteBehaviour,
          "/assets": websiteBehaviour,
          "/assets/*": websiteBehaviour,
          "/editor": websiteBehaviour,
          "/editor/*": websiteBehaviour,
          "/docs": websiteBehaviour,
          "/docs/": websiteBehaviour,
        },
      }
    );

    new s3deploy.BucketDeployment(this, "DeployWithInvalidation", {
      sources: [
        s3deploy.Source.asset(
          path.join(__dirname, "../../spineless-website/_site")
        ),
      ],
      destinationBucket: websiteS3,
      distribution: cfDistribution,
      distributionPaths: ["/*"],
    });

    new route53.ARecord(this, "AliasRecord", {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(
        new route53Targets.CloudFrontTarget(cfDistribution)
      ),
    });

    new cdk.CfnOutput(this, "myOut", {
      value: cfDistribution.distributionDomainName,
    });
  }
}
