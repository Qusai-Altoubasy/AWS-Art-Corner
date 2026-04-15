import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Networking } from '../constructs/networking';

export class QusaiProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const networking = new Networking(this, 'NetworkingLayer');

  }
}