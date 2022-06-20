import { Stack, StackProps, RemovalPolicy, aws_s3 as s3, aws_lambda as lambda, aws_ses as ses, Duration } from 'aws-cdk-lib';
import { Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { Rule, Schedule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';

export class DeployStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const lambdaFn = new lambda.Function(this, 'ListingScraperLambda', {
            runtime: Runtime.NODEJS_16_X,
            handler: 'index.handler',
            code: Code.fromAsset('../dist'),
        });

        const bucket = new s3.Bucket(this, 'ListingStateBucket', {
            bucketName: 'listing-state-bucket',
            versioned: true,
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });

        bucket.grantRead(lambdaFn);
        bucket.grantPut(lambdaFn);

        const eventRule = new Rule(this, 'ListingScraperTimer', {
            schedule: Schedule.rate(Duration.days(1)),
        });

        eventRule.addTarget(new LambdaFunction(lambdaFn));
    }
}
