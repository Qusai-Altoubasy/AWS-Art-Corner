#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { ArtCornerStack } from '../lib/ArtCornerStack';
import { appConfig } from '../config/config';
import { WafStack } from '../lib/waf-stack';

const app = new cdk.App();

// const wafStack = new WafStack(app, 'WafStack', {
//     stackName: `${appConfig.project.prefix}-Wafstack`,
//     env: appConfig.wafEnv
// });

new ArtCornerStack(app, 'MainStack', {
    stackName: `${appConfig.project.prefix}-stack`,
    env: appConfig.awsEnv,
    // crossRegionReferences: true,
    // wafArn: wafStack.wafArn
});

Object.entries(appConfig.tags).forEach(([key, value]) => {
  cdk.Tags.of(app).add(key, value);
});