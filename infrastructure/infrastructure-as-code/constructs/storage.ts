import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { appConfig } from '../config/config';

export class Storage extends Construct {
    public readonly productsImagesBucket: s3.Bucket;
    public readonly archiveBucket: s3.Bucket;
    public readonly backupBucket: s3.Bucket;
    public readonly shoppingCartTable: dynamodb.Table;

    constructor(scope: Construct, id: string) {
        super(scope, id);
    
        this.productsImagesBucket = new s3.Bucket(this, 'ImagesBucket', {
            bucketName: appConfig.storage.productsImagesBucketName,

            encryption: s3.BucketEncryption.S3_MANAGED,
            versioned: appConfig.storage.versioning,

            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,

            removalPolicy:
                appConfig.env === 'prod'
                ? cdk.RemovalPolicy.RETAIN
                : cdk.RemovalPolicy.DESTROY,

            autoDeleteObjects: appConfig.env !== 'prod',

            lifecycleRules: [
                {
                transitions: [
                    {
                    storageClass: s3.StorageClass.INTELLIGENT_TIERING,
                    transitionAfter: cdk.Duration.days(30),
                    },
                    {
                    storageClass: s3.StorageClass.INFREQUENT_ACCESS,
                    transitionAfter: cdk.Duration.days(30),
                    }
                ],
                },
            ],
        });

        this.archiveBucket = new s3.Bucket(this, 'ArchiveBucket', {
            bucketName: appConfig.storage.archiveBucketName,
            encryption: s3.BucketEncryption.S3_MANAGED,
            versioned: appConfig.storage.versioning,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            removalPolicy: appConfig.env === 'prod' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: appConfig.env !== 'prod',
            
            lifecycleRules: [{
                transitions: [
                {
                    storageClass: s3.StorageClass.GLACIER_INSTANT_RETRIEVAL,
                    transitionAfter: cdk.Duration.days(0),
                },],
                noncurrentVersionExpiration: cdk.Duration.days(appConfig.storage.nonCurrentVersionExpiration),
            }],
        });

        this.backupBucket = new s3.Bucket(this, 'BackupBucket', {
            bucketName: appConfig.storage.backupBucketName,
            encryption: s3.BucketEncryption.S3_MANAGED,
            versioned: appConfig.storage.versioning,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            removalPolicy: appConfig.env === 'prod' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: appConfig.env !== 'prod',

            lifecycleRules: [{
                transitions: [
                {
                    storageClass: s3.StorageClass.GLACIER_INSTANT_RETRIEVAL,
                    transitionAfter: cdk.Duration.days(0),
                },],
                noncurrentVersionExpiration: cdk.Duration.days(appConfig.storage.nonCurrentVersionExpiration),
            }],
        });

        this.shoppingCartTable = new dynamodb.Table(this, 'ShoppingCartTable', {
            tableName: appConfig.dynamo.tableName,
            partitionKey: { 
                name: appConfig.dynamo.partitionKey,
                type: dynamodb.AttributeType.STRING 
            },
            sortKey: {
                name: appConfig.dynamo.sortKey,
                type: dynamodb.AttributeType.STRING
            },

            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,

            encryption: dynamodb.TableEncryption.AWS_MANAGED,
            
            pointInTimeRecoverySpecification: {
                pointInTimeRecoveryEnabled: appConfig.dynamo.pointInTimeRecovery,
            },

            timeToLiveAttribute: 'ttl',
            
            removalPolicy: appConfig.env === 'prod' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
        });
    }
}