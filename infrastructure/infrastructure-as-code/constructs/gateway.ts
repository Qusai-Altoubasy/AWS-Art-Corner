import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { appConfig } from '../config/config';

export class Gateway extends Construct {
    private readonly userPool: cognito.UserPool;
    private readonly userPoolClient: cognito.UserPoolClient;
    public readonly api: apigateway.RestApi;

    constructor(scope: Construct, id: string, props: {broadCastFunction: lambda.IFunction}) {
        super(scope, id);
        
        this.userPool = new cognito.UserPool(this, 'UserPool', {
            userPoolName: appConfig.gateway.userPool.userPoolName,
            selfSignUpEnabled: true,
            
            signInAliases: {
                email:    true,
                username: false,
            },

            passwordPolicy: {
                minLength:          8,
                requireLowercase:   true,
                requireUppercase:   true,
                requireDigits:      true,
                requireSymbols:     true,
                tempPasswordValidity: cdk.Duration.days(appConfig.gateway.userPool.tempPasswordValidityDays)
            },

            standardAttributes: {
                email: {required: true, mutable: false}
            },

            mfa: cognito.Mfa.OPTIONAL,
            mfaSecondFactor:{
                otp: true,
                sms: false
            },
            accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,

            removalPolicy: appConfig.env === 'prod'
                ? cdk.RemovalPolicy.RETAIN
                : cdk.RemovalPolicy.DESTROY,
        });

        new cognito.CfnUserPoolGroup(this, 'AdminsGroup', {
            userPoolId: this.userPool.userPoolId,
            groupName: 'Admin',
        });

        new cognito.CfnUserPoolGroup(this, 'employeesGroup', {
            userPoolId: this.userPool.userPoolId,
            groupName: 'employee'
        });

        new cognito.CfnUserPoolGroup(this, 'customersGroup', {
            userPoolId: this.userPool.userPoolId,
            groupName: 'customer'
        });

        this.userPoolClient = this.userPool.addClient('AppClient', {
            userPoolClientName: appConfig.gateway.userPoolClient.clientName,
            generateSecret: false,

            authFlows: {
                userSrp: true,
                userPassword: true
            },

            accessTokenValidity: cdk.Duration.minutes(appConfig.gateway.userPoolClient.accessTokenValidity),
            idTokenValidity: cdk.Duration.minutes(appConfig.gateway.userPoolClient.idTokenValidity),
            refreshTokenValidity: cdk.Duration.days(appConfig.gateway.userPoolClient.refreshTokenValidity),

            enableTokenRevocation: true,
            preventUserExistenceErrors: true
        });


        this.api = new apigateway.RestApi(this, 'RestApi', {
            restApiName: appConfig.gateway.api.restApiName,

            deployOptions: {
                stageName: appConfig.gateway.api.stageName,
                throttlingBurstLimit: appConfig.gateway.api.throttlingBurstLimit,
                throttlingRateLimit: appConfig.gateway.api.throttlingRateLimit
            },

            defaultCorsPreflightOptions: {
                allowOrigins: apigateway.Cors.ALL_ORIGINS,
                allowMethods: apigateway.Cors.ALL_METHODS,
                allowHeaders: [
                    'Content-Type',
                    'Authorization',
                    'X-Api-Key',
                    'X-Amz-Date',
                    'X-Amz-Security-Token',
                ],
                maxAge: cdk.Duration.hours(1),
            },

            policy: new iam.PolicyDocument({
                statements: [
                    new iam.PolicyStatement({
                        actions: ['execute-api:Invoke'],
                        resources: ['*'],
                        principals: [new iam.AnyPrincipal()],
                        effect: iam.Effect.ALLOW,
                    }),
                ]
            })
        });

        const cognitoAuthorizer = new apigateway.CognitoUserPoolsAuthorizer(this, 'CognitoAuthorizer', {
            authorizerName: appConfig.gateway.cognitoAuthorizer.authorizerName,
            cognitoUserPools: [this.userPool],
            identitySource: 'method.request.header.Authorization',
            resultsCacheTtl: cdk.Duration.minutes(5),
        });

        const broadCastIntegration = new apigateway.LambdaIntegration(props.broadCastFunction,{
            proxy:   true,
            timeout: cdk.Duration.seconds(29),
        });

        const apiResource   = this.api.root.addResource('api');
        const proxyResource = apiResource.addResource('{proxy+}');

        proxyResource.addMethod('ANY', broadCastIntegration, {
            authorizer: cognitoAuthorizer,
            authorizationType: apigateway.AuthorizationType.COGNITO,
            requestParameters: {
                'method.request.header.Authorization': true,
            },
        });

        const healthResource = this.api.root.addResource('health');
        healthResource.addMethod(
        'GET', 
        new apigateway.MockIntegration({
            integrationResponses: [{
            statusCode: '200',
            responseTemplates: { 'application/json': '{"status":"ok","env":"' + appConfig.env + '"}' },
            }],
            requestTemplates: { 'application/json': '{"statusCode":200}' },
        }),
        {
            methodResponses: [{ statusCode: '200' }],
            authorizationType: apigateway.AuthorizationType.NONE,
        });
        
    }
}