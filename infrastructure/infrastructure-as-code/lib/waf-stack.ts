import * as cdk from 'aws-cdk-lib';
import * as wafv2 from 'aws-cdk-lib/aws-wafv2';
import { Construct } from 'constructs';
import { appConfig } from '../config/config';

export class WafStack extends cdk.Stack {
    public readonly wafArn: string;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const waf = new wafv2.CfnWebACL(this, 'WebACL', {
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

        this.wafArn = waf.attrArn;

        new cdk.CfnOutput(this, 'WafArnOutput', {
            value: waf.attrArn,
            exportName: 'SharedWafArn',
        });
    }
}