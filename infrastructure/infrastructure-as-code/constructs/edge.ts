import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import { appConfig } from '../config/config';

export interface edgeProps{
    api: apigateway.RestApi,
    // wafArn: string,
    productsImagesBucket: s3.IBucket;
    customersFrontendBucket: s3.IBucket;
    adminsFrontendBucket: s3.IBucket;
}
export class Edge extends Construct {
    public readonly distribution: cloudfront.Distribution;

    constructor(scope: Construct, id: string, props:edgeProps) {
        super(scope, id);

        const apiOrigin = new origins.RestApiOrigin(props.api);

        const s3Origin = origins.S3BucketOrigin.withOriginAccessControl(props.productsImagesBucket);

        const customersFrontendOrigin =origins.S3BucketOrigin.withOriginAccessControl(
            props.customersFrontendBucket
        );

        const adminsFrontendOrigin =origins.S3BucketOrigin.withOriginAccessControl(
            props.adminsFrontendBucket
        );

        this.distribution = new cloudfront.Distribution(this, 'Distribution', {
            comment: appConfig.edge.cloudFrontDistribution.comment,
            priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
            // webAclId: props.wafArn,

            defaultRootObject: 'index.html',
            defaultBehavior: {
                origin: customersFrontendOrigin,
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
                compress: true,
            },

            errorResponses: [
                {
                    httpStatus: 403,
                    responseHttpStatus: 200,
                    responsePagePath: '/index.html',
                    ttl: cdk.Duration.seconds(0),
                },
                {
                    httpStatus: 404,
                    responseHttpStatus: 200,
                    responsePagePath: '/index.html',
                    ttl: cdk.Duration.seconds(0),
                },
            ],
        });

        this.distribution.addBehavior(
            'api/*',
            apiOrigin,
            {
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.HTTPS_ONLY,
                allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
                cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
                originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
            }
        );

        this.distribution.addBehavior(
            'images/*',
            s3Origin,
            {
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
                cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
            }
        );

        this.distribution.addBehavior(
            'admin/*',
            adminsFrontendOrigin,
            {
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
                cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
                compress: true,
            }
        );

        new s3deploy.BucketDeployment(this, 'DeployFrontend', {
            sources: [
                s3deploy.Source.asset(
                    appConfig.edge.customersFrontendAssetPath
                ),
            ],
            destinationBucket: props.customersFrontendBucket,
            distribution: this.distribution,
            distributionPaths: ['/*'],
        });

        new s3deploy.BucketDeployment(this, 'DeployAdminsFrontend', {
            sources: [
                s3deploy.Source.asset(
                    appConfig.edge.adminsFrontendAssetPath
                ),
            ],
            destinationBucket: props.adminsFrontendBucket,
            distribution: this.distribution,
            distributionPaths: ['/admin/*'], 
        });
    }
}