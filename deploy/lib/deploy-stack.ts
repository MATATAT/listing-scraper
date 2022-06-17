import { Stack, StackProps, RemovalPolicy, aws_s3 as s3, aws_lambda as lambda } from 'aws-cdk-lib';
import { Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { Rule, Schedule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';

export class DeployStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        new s3.Bucket(this, 'ListingStateBucket', {
            versioned: true,
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });

        const lambdaFn = new lambda.Function(this, 'ListingScraperLambda', {
            runtime: Runtime.NODEJS_16_X,
            handler: 'index.handler',
            code: Code.fromAsset('../dist'),
        });

        const eventRule = new Rule(this, 'ListingScraperTimer', {
            schedule: Schedule.cron({ day: '1' })
        });

        eventRule.addTarget(new LambdaFunction(lambdaFn));
    }
}
