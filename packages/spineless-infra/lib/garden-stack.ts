import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as iam from "@aws-cdk/aws-iam";
import { BlockPublicAccess } from "@aws-cdk/aws-s3";

export class GardenStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create the user that the ec2 instance will assume
    const user = new iam.User(this, "ServerUser", {
      userName: "server-user",
    });

    const accessKey = new iam.CfnAccessKey(user, "AccessKey", {
      userName: user.userName,
    });

    // TODO: add CDK code to auto insert some pre-generated images for templates + plant images
    const bucket = new s3.Bucket(this, "garden-files", {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      cors: [
        {
          allowedMethods: [s3.HttpMethods.POST],
          allowedOrigins: ["*"],
        },
      ],
    });

    bucket.grantReadWrite(user);

    // we need this information to assume credentials locally
    new cdk.CfnOutput(this, "Access Key ID", { value: accessKey.ref });
    // we need this information to assume credentials locally
    new cdk.CfnOutput(this, "Secret Access Key", {
      value: accessKey.attrSecretAccessKey,
    });
    new cdk.CfnOutput(this, "S3 Bucket Name", { value: bucket.bucketName });
  }
}
