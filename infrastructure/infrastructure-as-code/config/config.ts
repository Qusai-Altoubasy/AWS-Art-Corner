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

export const WAF_ENV: cdk.Environment= {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: 'us-east-1'
}

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
  subnetAName:`${PROJECT.prefix}-private-a`,
  subnetACidrMask:  24,
 
  // Private Subnet B — RDS Aurora PostgreSQL standby
  subnetBName:`${PROJECT.prefix}-private-b`,
  subnetBCidrMask:  24,
 
  // Security group names
  sg: {
    lambda:   `${PROJECT.prefix}-sg-lambda`,
    database: `${PROJECT.prefix}-sg-database`,
    vpc:      `${PROJECT.prefix}-sg-vpc-endpoints`,
  },
} as const;

export const DATABASE = {
  clusterIdentifier: `${PROJECT.prefix}-aurora-cluster`,
  instanceIdentifier: `${PROJECT.prefix}-aurora-instance`,
  standbyIdentifier:  `${PROJECT.prefix}-standby-rds`,
 
  databaseName: 'qusaidb',
  port: 5432,
  minCapacity: ENV === 'prod' ? 2: 0.5,
  maxCapacity: ENV === 'prod' ? 16: 4,
 
  // Secrets Manager secret name
  secretName: `${PROJECT.prefix}/aurora/credentials`,
 
  // Backup & maintenance
  backupRetentionDays: ENV === 'prod' ? 14 : 3,
  preferredBackupWindow: '03:00-04:00',
  preferredMaintenanceWindow: 'sun:04:00-sun:05:00',
} as const;

export const STORAGE = { // S3 
  archiveBucketName: `${PROJECT.prefix}-archive-${AWS_ENV.account}`,
  backupBucketName:  `${PROJECT.prefix}-backup-${AWS_ENV.account}`,

  nonCurrentVersionExpiration: 30,

  versioning: ENV == 'prod'? true: false,
} as const;

export const DYNAMO = {
  tableName: `${PROJECT.prefix}-ShoppingCartTable`,

  partitionKey: 'customerId',
  sortKey: 'productId',
  pointInTimeRecovery: true,
} as const;

export const MESSAGING= {
  DLQ:{
    QueueName : `${PROJECT.prefix}-OrderDLQ`,
    retentionPeriodDays : 14,
  },

  orderQueue:{
    QueueName: `${PROJECT.prefix}-OrderQueue.fifo`,
    visibilityTimeoutSeconds: 180,
    receiveMessageWaitTime: 20,
    maxReceiveCount: 3
  },

  employeesTopic:{
    topicName: `${PROJECT.prefix}-employeesTopic`,
    emails: [
      'employee1@gmail.com',
      'employee2@gmail.com',
      'employee3@gmail.com'
    ]
    },

  adminsTopic:{
    topicName: `${PROJECT.prefix}-adminsTopic`,
    emails: [
      'admin1@gmail.com',
      'admin2@gmail.com',
      'admin3@gmail.com'
    ]
  },

  events: {
    ruleName: `${PROJECT.prefix}-weekly-maintenance`,
    weeklyMaintenanceCron: {
        minute: '0',
        hour: '3',
        month: '*',
        weekDay: 'FRI',
        year: '*'
    }
  },

  DLQAlarm: {
    alarmName: `${PROJECT.prefix}-dlq-not-empty`,
    period: 30,
    threshold: 1,
    evaluationPeriods: 1,
  }
} as const;

export const COMPUTE = {  
  broadCastFunction: {
    functionName: `${PROJECT.prefix}-broadcast`,
    ImageAsset: '../../backend',
    memorySize: 2048,
    timeout: 20,
    minCapacity: PROJECT.env == 'prod'? 5: 1,
    maxCapacity: PROJECT.env == "prod"? 1000: 5
  },

  notificationLambda: {
    functionName: `${PROJECT.prefix}-notificationService`,
    handler: 'main.handler',
    codeAsset: './src/notification-service',
    timeout: 30,
    memorySize: 512,
  },

  archiveWorker: {
    functionName: `${PROJECT.prefix}-archiveWorker`,
    handler: 'main.handler',
    codeAsset: './src/archive-worker',
    timeout: 10,
    memorySize: 512,
  },

  backupWorker: {
    functionName: `${PROJECT.prefix}-backupWorker`,
    handler: 'main.handler',
    codeAsset: './src/backup-worker',
    timeout: 15,
    memorySize: 512,
  }
}

export const GATEWAY = {
  userPool: {
    userPoolName: `${PROJECT.prefix}-userPool`,
    tempPasswordValidityDays: ENV === 'prod' ? 3 : 7,
  },
 
  userPoolClient: {
    clientName: `${PROJECT.prefix}-appClient`,
    accessTokenValidity: 60,
    idTokenValidity: 60,
    refreshTokenValidity: 30,
  },
 
  api: {
    restApiName: `${PROJECT.prefix}-api`,
    stageName: ENV,
    throttlingBurstLimit: ENV === 'prod' ? 1000 : 100,
    throttlingRateLimit: ENV === 'prod' ? 500  : 50,
    HeaderValue: AWS_ENV.account
  },

  cognitoAuthorizer: {
    authorizerName: `${PROJECT.prefix}-cognitoAuthorizer`,
  }
} as const;

export const EDGE = {
  waf: {
    name: `${PROJECT.prefix}-WebACL`,
    metricName: `${PROJECT.prefix}-waf`,
  },

  cloudFrontPolicy: {
    cachePolicyName: `${PROJECT.prefix}-apiNoCache`,
    originRequestPolicyName: `${PROJECT.prefix}-apiOrigin`,
  },

  cloudFrontDistribution: {
    comment: `${PROJECT.prefix}-Distribution`,
    HeaderValue: AWS_ENV.account
  }
}

export interface AppConfig {
  env: AppEnv;
  awsEnv: cdk.Environment;
  project: typeof PROJECT;
  networking: typeof NETWORKING;
  database: typeof DATABASE;
  storage: typeof STORAGE;
  dynamo: typeof DYNAMO;
  messaging: typeof MESSAGING;
  compute: typeof COMPUTE;
  gateway: typeof GATEWAY;
  edge: typeof EDGE;
  tags: typeof TAGS;
  wafEnv: typeof WAF_ENV;
}

export const appConfig: AppConfig = {
  env: ENV,
  awsEnv: AWS_ENV,
  project: PROJECT,
  networking: NETWORKING,
  database: DATABASE,
  storage: STORAGE,
  dynamo: DYNAMO,
  messaging: MESSAGING,
  compute: COMPUTE,
  gateway: GATEWAY,
  edge: EDGE,
  tags: TAGS,
  wafEnv: WAF_ENV
};

export default appConfig; 