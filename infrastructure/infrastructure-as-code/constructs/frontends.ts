import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { appConfig } from '../config/config';

export class Frontends extends Construct {
    readonly customersFrontendBucket: s3.Bucket;
    readonly adminsFrontendBucket: s3.Bucket;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.customersFrontendBucket = new s3.Bucket(this, 'CustomersFrontendBucket', {
            bucketName: appConfig.frontends.customersFrontendBucketName,
            encryption: s3.BucketEncryption.S3_MANAGED,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            versioned: appConfig.storage.versioning,
            removalPolicy: appConfig.env === 'prod' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: appConfig.env !== 'prod',
        });

        this.adminsFrontendBucket = new s3.Bucket(this, 'AdminFrontendBucket', {
            bucketName: appConfig.frontends.adminFrontendBucketName,
            encryption: s3.BucketEncryption.S3_MANAGED,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            versioned: appConfig.storage.versioning,
            removalPolicy: appConfig.env === 'prod' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: appConfig.env !== 'prod',
        });
        
    }
}