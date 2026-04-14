import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';

export class QusaiProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'InfrastructureAsCodeQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
