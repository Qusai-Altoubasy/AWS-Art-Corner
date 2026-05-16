import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as lambda_event_sources from 'aws-cdk-lib/aws-lambda-event-sources';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';
import { appConfig } from '../config/config';

export interface ComputeProps {
  vpc: ec2.IVpc;
  lambdaSg: ec2.ISecurityGroup;
  databaseSecret: rds.DatabaseSecret;
  archiveBucket: s3.IBucket;
  backupBucket: s3.IBucket;
  productsImagesBucket: s3.IBucket;
  shoppingCartTable: dynamodb.ITable;
  orderQueue: sqs.IQueue;
  employeesTopic: sns.ITopic;
  adminsTopic: sns.ITopic;
  databaseInstance: rds.IDatabaseInstance;
}

export class Compute extends Construct {
    public readonly broadCastFunction: lambda.DockerImageFunction;
    // public readonly broadCastAlias: lambda.Alias;
    public readonly notificationLambda: lambda.Function;
    public readonly archiveWorker: lambda.Function;
    public readonly backupWorker: lambda.Function;

    constructor(scope: Construct, id: string, props: ComputeProps) {
        super(scope, id);

        this.broadCastFunction = new lambda.DockerImageFunction(this, 'BroadCastFunction', {
            functionName: appConfig.compute.broadCastFunction.functionName,
            code: lambda.DockerImageCode.fromImageAsset(appConfig.compute.broadCastFunction.ImageAsset),
            vpc: props.vpc,
            vpcSubnets: {subnetType: ec2.SubnetType.PRIVATE_ISOLATED},
            securityGroups: [props.lambdaSg],
            memorySize: appConfig.compute.broadCastFunction.memorySize,
            timeout: cdk.Duration.seconds(appConfig.compute.broadCastFunction.timeout),
            environment: {
                APP_AWS_REGION: appConfig.awsEnv.region as string,
                APP_AWS_DB_SECRET_NAME: props.databaseSecret.secretName,
                APP_AWS_DYNAMO_TABLE_NAME: props.shoppingCartTable.tableName,
                APP_AWS_ORDER_QUEUE_URL: props.orderQueue.queueUrl,
                APP_AWS_PRODUCTS_IMAGES_BUCKET_NAME: props.productsImagesBucket.bucketName,
                APP_AWS_ENV: appConfig.env,
            }
        });

        // this.broadCastAlias = new lambda.Alias(this, 'BroadCastAlias', {
        //     aliasName: appConfig.env,
        //     version: this.broadCastFunction.currentVersion,
        //     provisionedConcurrentExecutions: appConfig.compute.broadCastFunction.minCapacity,
        // });

        // const scalingTarget = this.broadCastAlias.addAutoScaling({
        //     minCapacity: appConfig.compute.broadCastFunction.minCapacity,
        //     maxCapacity: appConfig.compute.broadCastFunction.maxCapacity,
        // });

        // scalingTarget.scaleOnUtilization({
        //     utilizationTarget: 0.6,
        // });

        this.notificationLambda = new lambda.Function(this, 'NotificationLambda', {
            functionName: appConfig.compute.notificationLambda.functionName,
            runtime: lambda.Runtime.PYTHON_3_13,
            handler: appConfig.compute.notificationLambda.handler,
            code: lambda.Code.fromAsset(appConfig.compute.notificationLambda.codeAsset),
            vpc: props.vpc,
            vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
            securityGroups: [props.lambdaSg],
            memorySize: appConfig.compute.notificationLambda.memorySize,
            timeout: cdk.Duration.seconds(appConfig.compute.notificationLambda.timeout),
            environment: {
                REGION: appConfig.awsEnv.region as string,
                EMPLOYEES_TOPIC_ARN: props.employeesTopic.topicArn,
                ADMINS_TOPIC_ARN: props.adminsTopic.topicArn,
                FROM_EMAIL: appConfig.messaging.ses.fromEmail
            },
        });

        this.notificationLambda.addEventSource(new lambda_event_sources.SqsEventSource(
            props.orderQueue, 
            {batchSize: 1}
        ));

        this.archiveWorker = new lambda.Function(this, 'ArchiveWorker', {
            functionName: appConfig.compute.archiveWorker.functionName,
            runtime: lambda.Runtime.PYTHON_3_13,
            handler: appConfig.compute.archiveWorker.handler,
            code: lambda.Code.fromAsset(appConfig.compute.archiveWorker.codeAsset),
            vpc: props.vpc,
            vpcSubnets: {subnetType: ec2.SubnetType.PRIVATE_ISOLATED},
            securityGroups: [props.lambdaSg],
            memorySize: appConfig.compute.archiveWorker.memorySize,
            timeout: cdk.Duration.minutes(appConfig.compute.archiveWorker.timeout),
            retryAttempts: 2,
            environment: {
                DB_SECRET_NAME: props.databaseSecret.secretName,
                ARCHIVE_BUCKET_NAME: props.archiveBucket.bucketName,
            },
        });

        this.backupWorker = new lambda.Function(this, 'BackupWorker', {
            functionName: appConfig.compute.backupWorker.functionName,
            runtime: lambda.Runtime.PYTHON_3_13,
            handler: appConfig.compute.backupWorker.handler,
            code: lambda.Code.fromAsset(appConfig.compute.backupWorker.codeAsset),
            vpc: props.vpc,
            vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
            securityGroups: [props.lambdaSg],
            memorySize: appConfig.compute.backupWorker.memorySize,
            timeout: cdk.Duration.minutes(appConfig.compute.backupWorker.timeout),
            retryAttempts: 2,
            environment: {
                DB_SECRET_NAME: props.databaseSecret.secretName,
                BACKUP_BUCKET_NAME: props.backupBucket.bucketName,
                DB_CLUSTER_IDENTIFIER: props.databaseInstance.instanceIdentifier,
            },
        });

        props.databaseSecret.grantRead(this.broadCastFunction);
        props.databaseSecret.grantRead(this.archiveWorker);
        props.databaseSecret.grantRead(this.backupWorker);

        props.shoppingCartTable.grantReadWriteData(this.broadCastFunction);
        props.orderQueue.grantSendMessages(this.broadCastFunction);
        props.productsImagesBucket.grantPut(this.broadCastFunction);

        props.orderQueue.grantConsumeMessages(this.notificationLambda);
        props.employeesTopic.grantPublish(this.notificationLambda);
        props.adminsTopic.grantPublish(this.notificationLambda);
        this.notificationLambda.addToRolePolicy(new iam.PolicyStatement({
            actions: ['ses:SendEmail', 'ses:SendRawEmail'],
            resources: [
                `arn:aws:ses:${appConfig.awsEnv.region}:${appConfig.awsEnv.account}:identity/*`,
                `arn:aws:ses:${appConfig.awsEnv.region}:${appConfig.awsEnv.account}:configuration-set/my-first-configuration-set`
            ],
            effect: iam.Effect.ALLOW,
        }));
     
        this.backupWorker.addToRolePolicy(new iam.PolicyStatement({
            actions: [
                "rds:CreateDBClusterSnapshot",
                "rds:DescribeDBClusters"
            ],
            resources: [props.databaseInstance.instanceArn],
            effect: iam.Effect.ALLOW,
        }));

        props.archiveBucket.grantWrite(this.archiveWorker);
        props.backupBucket.grantWrite(this.backupWorker);
    }

    addIamRoleToBroadCastFunction(userPool: cognito.IUserPool, userPoolClient: cognito.IUserPoolClient) {
        this.broadCastFunction.addToRolePolicy(new iam.PolicyStatement({
            actions: [
                'cognito-idp:AdminCreateUser',
                'cognito-idp:AdminAddUserToGroup',
                'cognito-idp:AdminGetUser',
                'cognito-idp:AdminSetUserPassword',
                'cognito-idp:AdminDeleteUser'
            ],
            resources: [
                userPool.userPoolArn
            ],
            effect: iam.Effect.ALLOW,
        }));

        this.broadCastFunction.addEnvironment('APP_AWS_COGNITO_USER_POOL_ID', userPool.userPoolId);
        this.broadCastFunction.addEnvironment('APP_AWS_COGNITO_CLIENT_ID', userPoolClient.userPoolClientId);
    }
}