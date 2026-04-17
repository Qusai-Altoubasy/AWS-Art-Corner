import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { appConfig } from '../config/config';

export class Database extends Construct {
  public readonly cluster: rds.DatabaseCluster;
  public readonly secret: rds.DatabaseSecret;

  constructor(scope: Construct, id: string, props: {vpc: ec2.IVpc, databaseSg: ec2.ISecurityGroup}) {
    super(scope, id);

    this.secret = new rds.DatabaseSecret(this, 'AuroraSecret', {
      username: 'admin',
      secretName: appConfig.database.secretName,
    });

    const subnetGroup = new rds.SubnetGroup(this, 'DbSubnetGroup', {
      description: 'Aurora subnet group',
      vpc: props.vpc,
       vpcSubnets: {
        subnets: [
            ...props.vpc.selectSubnets({
            subnetGroupName: appConfig.networking.subnetAName
        }).subnets,
            ...props.vpc.selectSubnets({
            subnetGroupName: appConfig.networking.subnetBName
        }).subnets,
      ]
     }
    });

    this.cluster = new rds.DatabaseCluster(this, 'AuroraCluster',{
        clusterIdentifier: appConfig.database.clusterIdentifier,
        engine: rds.DatabaseClusterEngine.auroraPostgres({
            version: rds.AuroraPostgresEngineVersion.VER_17_7
        }),
        credentials: rds.Credentials.fromSecret(this.secret),
        defaultDatabaseName: appConfig.database.databaseName,
        port: appConfig.database.port,

        vpc: props.vpc,
        subnetGroup: subnetGroup,
        securityGroups: [props.databaseSg],

        serverlessV2MinCapacity: appConfig.database.minCapacity,
        serverlessV2MaxCapacity: appConfig.database.maxCapacity,

        writer: rds.ClusterInstance.serverlessV2('MainInstance', {
            instanceIdentifier: appConfig.database.instanceIdentifier,
            autoMinorVersionUpgrade: true,
            publiclyAccessible: false,
        }),
        readers: appConfig.env === 'prod' ?
        [rds.ClusterInstance.serverlessV2('StandByInstance', {
            instanceIdentifier: appConfig.database.standbyIdentifier,
            autoMinorVersionUpgrade: true,
            publiclyAccessible: false,
        })]
        : [],

        storageEncrypted: true,

        backup: {
            retention: cdk.Duration.days(appConfig.database.backupRetentionDays),
            preferredWindow: appConfig.database.preferredBackupWindow,
        },
        preferredMaintenanceWindow: appConfig.database.preferredMaintenanceWindow,

        removalPolicy: appConfig.env === 'prod'
        ? cdk.RemovalPolicy.RETAIN
        : cdk.RemovalPolicy.DESTROY,
    });

  }
}