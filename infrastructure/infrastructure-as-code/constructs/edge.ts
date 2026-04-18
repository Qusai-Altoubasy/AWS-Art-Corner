import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as wafv2 from 'aws-cdk-lib/aws-wafv2';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { appConfig } from '../config/config';

export class Edge extends Construct {
    public readonly distribution: cloudfront.Distribution;

    constructor(scope: Construct, id: string, props: {api: apigateway.RestApi}) {
        super(scope, id);

        const apiCachePolicy = new cloudfront.CachePolicy(this, 'ApiCachePolicy', {
            cachePolicyName: appConfig.edge.cloudFrontPolicy.cachePolicyName,
            defaultTtl: cdk.Duration.seconds(0),
            minTtl: cdk.Duration.seconds(0),
            maxTtl: cdk.Duration.seconds(0),
            enableAcceptEncodingGzip: true,
            enableAcceptEncodingBrotli: true,

            headerBehavior: cloudfront.CacheHeaderBehavior.allowList('Authorization', 'Content-Type'),
            queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(),
        });

        const originRequestPolicy = new cloudfront.OriginRequestPolicy(this, 'ApiOriginPolicy', {
            originRequestPolicyName: appConfig.edge.cloudFrontPolicy.originRequestPolicyName,
            headerBehavior: cloudfront.OriginRequestHeaderBehavior.allowList(
                'Authorization',
                'Content-Type',
                'X-Api-Key',
                'X-Amz-Date',
            ),
            queryStringBehavior: cloudfront.OriginRequestQueryStringBehavior.all(),
            cookieBehavior: cloudfront.OriginRequestCookieBehavior.none(),
        });

        this.distribution = new cloudfront.Distribution(this, 'Distribution', {
            comment: appConfig.edge.cloudFrontDistribution.comment,
            priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
            webAclId: cdk.Fn.importValue('SharedWafArn'),

            defaultBehavior: {
                origin: new origins.RestApiOrigin(props.api, {
                    customHeaders: {
                    'Referer': appConfig.edge.cloudFrontDistribution.HeaderValue as string, 
                    },
                }),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.HTTPS_ONLY,
                allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
                cachePolicy: apiCachePolicy,
                originRequestPolicy: originRequestPolicy,
                compress: true,
            },
        });
    }
}