import { Stack, StackProps, aws_s3 as s3, aws_lambda as lambda } from 'aws-cdk-lib';
import { Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as path from "path";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class DeployStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // The code that defines your stack goes here

        // example resource
        // const queue = new sqs.Queue(this, 'DeployQueue', {
        //   visibilityTimeout: cdk.Duration.seconds(300)
        // });

        new s3.Bucket(this, 'ListingStateBucket', {
            versioned: true
        });

        new lambda.Function(this, 'ListingScraper', {
            runtime: Runtime.NODEJS_16_X,
            handler: 'index.handler',
            code: Code.fromAsset(path.join(__dirname, "")) // TODO: Fill this out
        });
    }
}
