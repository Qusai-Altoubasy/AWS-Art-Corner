import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Networking } from '../constructs/networking';
import { Database } from '../constructs/database';
import { Storage } from '../constructs/storage';
import { Messaging } from '../constructs/messaging';
import { Compute } from '../constructs/compute';
import { Gateway } from '../constructs/gateway';

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

    const compute = new Compute(this, 'ComputeLayer', {
      vpc: networking.vpc,
      lambdaSg: networking.lambdaSg,
      databaseSecret: database.secret,
      archiveBucket: storage.archiveBucket,
      backupBucket: storage.backupBucket,
      shoppingCartTable: storage.shoppingCartTable,
      orderQueue: messaging.orderQueue,
      employeesTopic: messaging.employeesTopic,
      adminsTopic: messaging.adminsTopic,
    });

    messaging.addMaintenanceTargets(compute.archiveWorker, compute.backupWorker);

    const api = new Gateway(this, 'GatewayLayer',{
      broadCastAlias: compute.broadCastAlias
    });

  }
}