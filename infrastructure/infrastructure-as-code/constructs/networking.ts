import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { appConfig } from '../config/config';

export class Networking extends Construct {
  public readonly vpc: ec2.IVpc;
  public readonly lambdaSg: ec2.ISecurityGroup;
  public readonly databaseSg: ec2.ISecurityGroup;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.vpc = new ec2.Vpc(this, 'Vpc', {
      vpcName : `${appConfig.project.prefix}-Vpc`,
      ipAddresses: ec2.IpAddresses.cidr(appConfig.networking.vpcCidr),
      maxAzs: appConfig.networking.maxAzs,
      natGateways: appConfig.networking.natGateways,

      subnetConfiguration: [
        {
          name: appConfig.networking.subnetAName,
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: appConfig.networking.subnetACidrMask
        },
        {
          name: appConfig.networking.subnetBName,
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: appConfig.networking.subnetBCidrMask
        }
      ],

      enableDnsHostnames: true,
      enableDnsSupport:   true,
    });

    this.lambdaSg = new ec2.SecurityGroup(this, 'LambdaSg', {
      securityGroupName: appConfig.networking.sg.lambda,
      vpc: this.vpc,
      description:'Lambda functions — compute layer',
      allowAllOutbound:  true,
    });

    this.databaseSg = new ec2.SecurityGroup(this, 'DatabaseSg', {
      securityGroupName: appConfig.networking.sg.database,
      vpc: this.vpc,
      description:'Aurora PostgreSQL & RDS Standby',
      allowAllOutbound:  false,
    });

    this.databaseSg.addIngressRule(
      this.lambdaSg,
      ec2.Port.tcp(5432),
      'Allow Lambdas to access PostgreSQL on port 5432'
    );

    this.vpc.addGatewayEndpoint('S3Endpoint', {
      service: ec2.GatewayVpcEndpointAwsService.S3,
    });

    this.vpc.addGatewayEndpoint('DynamoDBEndpoint', {
      service: ec2.GatewayVpcEndpointAwsService.DYNAMODB,
    });

    const endpointSg = new ec2.SecurityGroup(this, 'EndpointSg', {
      securityGroupName: appConfig.networking.sg.vpc,
      vpc: this.vpc,
      description:'Interface VPC Endpoints',
      allowAllOutbound:  false,
    });

    endpointSg.addIngressRule(
      this.lambdaSg,
      ec2.Port.tcp(443),
      'Allow Lambda to reach Interface Endpoints over HTTPS',
    );

    this.vpc.addInterfaceEndpoint('SecretsManagerEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
      subnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      securityGroups: [endpointSg],
      privateDnsEnabled: true,
      open: false,
    });

    this.vpc.addInterfaceEndpoint('SQSEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.SQS,
      subnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      securityGroups: [endpointSg],
      privateDnsEnabled: true,
      open: false,
    });

    this.vpc.addInterfaceEndpoint('SNSEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.SNS,
      subnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      securityGroups: [endpointSg],
      privateDnsEnabled: true,
      open: false,
    });

    this.vpc.addInterfaceEndpoint('SESEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.EMAIL_SMTP,
      subnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      securityGroups: [endpointSg],
      privateDnsEnabled: true,
      open: false,
    });

    this.vpc.addInterfaceEndpoint('ECRApiEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.ECR,
      subnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      securityGroups: [endpointSg],
      privateDnsEnabled: true,
      open: false,
    });

    this.vpc.addInterfaceEndpoint('ECRDockerEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.ECR_DOCKER,
      subnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      securityGroups: [endpointSg],
      privateDnsEnabled: true,
      open: false,
    });
  }
}