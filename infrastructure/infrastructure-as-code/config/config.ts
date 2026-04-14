import * as cdk from 'aws-cdk-lib';

export type AppEnv = 'dev' | 'prod';
const ENV = (process.env.APP_ENV ?? 'dev') as AppEnv;

export const PROJECT = {
  name:       'qusal',
  fullName:   'Qusal-Project',
  env:        ENV,
  prefix:     `qusal-${ENV}`,
} as const;

export const AWS_ENV: cdk.Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION ?? 'eu-west-1',
};

export const TAGS: Record<string, string> = {
  Project: PROJECT.name,
  Environment: ENV,
  ManagedBy: 'aws-cdk',
  Owner: 'Qusai-Altoubasy',
};

export const NETWORKING = {
  vpcCidr:          '10.0.0.0/16',
  maxAzs:           2,
  natGateways:      0,
 
  // Private Subnet A — Lambda compute & RDS Aurora PostgreSQL 
  subnetAName:      `${PROJECT.prefix}-private-a`,
  subnetACidrMask:  24,
 
  // Private Subnet B — RDS Aurora PostgreSQL standby
  subnetBName:      `${PROJECT.prefix}-private-b`,
  subnetBCidrMask:  24,
 
  // Security group names
  sg: {
    lambda:   `${PROJECT.prefix}-sg-lambda`,
    database: `${PROJECT.prefix}-sg-database`,
    vpc:      `${PROJECT.prefix}-sg-vpc-endpoints`,
  },
} as const;

export interface AppConfig {
  env: AppEnv;
  awsEnv: cdk.Environment;
  project: typeof PROJECT;
  networking: typeof NETWORKING;
  tags: typeof TAGS;
}

export const appConfig: AppConfig = {
  env: ENV,
  awsEnv: AWS_ENV,
  project: PROJECT,
  networking: NETWORKING,
  tags: TAGS,
};

export default appConfig;