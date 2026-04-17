import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Networking } from '../constructs/networking';
import { Database } from '../constructs/database';
import { Storage } from '../constructs/storage';
import { Messaging } from '../constructs/messaging';

export class QusaiProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const networking = new Networking(this, 'NetworkingLayer');

    const database = new Database(this,'Database', {
      vpc: networking.vpc,
      databaseSg: networking.databaseSg
    });

    const storage = new Storage(this, 'Storage');

    const messaging = new Messaging(this, 'Messaging');

  }
}