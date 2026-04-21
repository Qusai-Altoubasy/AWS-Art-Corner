import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { appConfig } from '../config/config';

export interface edgeProps{
    api: apigateway.RestApi,
    wafArn: string,
    productsImagesBucket: s3.IBucket;
}
export class Edge extends Construct {
    public readonly distribution: cloudfront.Distribution;

    constructor(scope: Construct, id: string, props:edgeProps) {
        super(scope, id);

        const apiOrigin = new origins.RestApiOrigin(props.api);

        const s3Origin = origins.S3BucketOrigin.withOriginAccessControl(props.productsImagesBucket);

        this.distribution = new cloudfront.Distribution(this, 'Distribution', {
            comment: appConfig.edge.cloudFrontDistribution.comment,
            priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
            webAclId: props.wafArn,

            defaultBehavior: {
                origin: apiOrigin,
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.HTTPS_ONLY,
                allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
                cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
                originRequestPolicy:
                    cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
                compress: true,
            },

            additionalBehaviors: {
                'images/*': {
                    origin: s3Origin,
                    viewerProtocolPolicy:
                    cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                    allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
                    cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
                    compress: true,
                },
            }
        });
    }
}