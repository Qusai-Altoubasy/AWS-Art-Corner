import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as wafv2 from 'aws-cdk-lib/aws-wafv2';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { appConfig } from '../config/config';

export class Edge extends Construct {
    public readonly distribution: cloudfront.Distribution;
    public readonly waf: wafv2.CfnWebACL;

    constructor(scope: Construct, id: string, props: {api: apigateway.RestApi}) {
        super(scope, id);

        this.waf = new wafv2.CfnWebACL(this, 'WebACL', {
            name: appConfig.edge.waf.name,
            scope: 'CLOUDFRONT',
            defaultAction: { allow: {} },

            visibilityConfig: {
                sampledRequestsEnabled: true,
                cloudWatchMetricsEnabled: true,
                metricName: appConfig.edge.waf.metricName
            },

            rules: [
                {
                    name: 'CommonRuleSet', 
                    priority: 1,
                    overrideAction: { none: {} },
                    statement: {
                        managedRuleGroupStatement: {
                            vendorName: 'AWS',
                            name: 'AWSManagedRulesCommonRuleSet'
                        },
                    },
                    visibilityConfig: {
                        sampledRequestsEnabled: true,
                        cloudWatchMetricsEnabled: true,
                        metricName: 'CommonRuleSet'
                    }
                },

                {
                    name: 'KnownBadInputs',
                    priority: 2,
                    overrideAction: { none: {} },
                    statement: {
                        managedRuleGroupStatement: {
                            vendorName: 'AWS',
                            name: 'AWSManagedRulesKnownBadInputsRuleSet'
                        },
                    },
                    visibilityConfig: {
                        sampledRequestsEnabled: true,
                        cloudWatchMetricsEnabled: true,
                        metricName: 'KnownBadInputs'
                    }
                },
                {
                name: 'IPReputationList',
                priority: 3,
                overrideAction: { none: {} },
                statement: {
                    managedRuleGroupStatement: {
                    vendorName: 'AWS',
                    name: 'AWSManagedRulesAmazonIpReputationList',
                    },
                },
                visibilityConfig: {
                    sampledRequestsEnabled:   true,
                    cloudWatchMetricsEnabled: true,
                    metricName: 'IPReputationList',
                    },
                },
                {
                    name: 'SQLInjectionProtection',
                    priority: 4,
                    overrideAction: { none: {} },
                    statement: {
                        managedRuleGroupStatement: {
                            vendorName: 'AWS',
                            name: 'AWSManagedRulesSQLiRuleSet'
                        },
                    },
                    visibilityConfig: {
                        sampledRequestsEnabled: true,
                        cloudWatchMetricsEnabled: true,
                        metricName: 'SQLInjectionProtection'
                    }
                },
                {
                    name: 'RateLimitRule',
                    priority: 5,
                    statement: {
                        rateBasedStatement: {
                            limit: 1000,
                            aggregateKeyType: 'IP',
                        }
                    },
                    action: { block: {} },
                    visibilityConfig: {
                        sampledRequestsEnabled: true,
                        cloudWatchMetricsEnabled: true,
                        metricName: 'RateLimitRule'
                    }
                }
            ]
        });

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
            webAclId: this.waf.attrArn,

            defaultBehavior: {
                origin: new origins.RestApiOrigin(props.api, {
                    customHeaders: {
                    'X-Origin-Verify': appConfig.edge.cloudFrontDistribution.HeaderValue as string, 
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