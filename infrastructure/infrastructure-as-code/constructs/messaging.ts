import * as cdk from 'aws-cdk-lib';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sns_subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as cloudwatch_actions from 'aws-cdk-lib/aws-cloudwatch-actions';
import * as events from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';
import { appConfig } from '../config/config';

export class Messaging extends Construct {
    public readonly orderQueue: sqs.Queue;
    public readonly orderDeadLetterQueue: sqs.Queue;
    public readonly employeesTopic: sns.Topic; // newOrder
    public readonly adminsTopic: sns.Topic; // stockAlert or 

    constructor(scope: Construct, id: string) {
        super(scope, id);

        // DLQ
        this.orderDeadLetterQueue = new sqs.Queue(this, 'OrderDLQ',{
            queueName: appConfig.messaging.DLQ.QueueName,

            encryption: sqs.QueueEncryption.SQS_MANAGED,

            retentionPeriod: cdk.Duration.days(appConfig.messaging.DLQ.retentionPeriodDays),

            removalPolicy: appConfig.env === 'prod'
                ? cdk.RemovalPolicy.RETAIN
                : cdk.RemovalPolicy.DESTROY,
        });

        // SQS
        this.orderQueue = new sqs.Queue(this, 'OrderQueue', {
            queueName: appConfig.messaging.orderQueue.QueueName,
            fifo: true,

            encryption: sqs.QueueEncryption.SQS_MANAGED,

            contentBasedDeduplication: true,

            visibilityTimeout: cdk.Duration.seconds(appConfig.messaging.orderQueue.visibilityTimeoutSeconds),

            deadLetterQueue:{
                maxReceiveCount: appConfig.messaging.orderQueue.maxReceiveCount,
                queue: this.orderDeadLetterQueue
            },

            receiveMessageWaitTime: cdk.Duration.seconds(appConfig.messaging.orderQueue.receiveMessageWaitTime),

            removalPolicy: appConfig.env === 'prod'
                ? cdk.RemovalPolicy.RETAIN
                : cdk.RemovalPolicy.DESTROY,
        });

        // SNS topics
        this.employeesTopic = new sns.Topic(this, 'employeesTopic',{
            displayName: 'New Order Notification',
            topicName: appConfig.messaging.employeesTopic.topicName
        });

        this.adminsTopic = new sns.Topic(this, 'StockAlertTopic', {
            displayName: 'Stock Level Alert or System failure',
            topicName: appConfig.messaging.adminsTopic.topicName,
        });
        
        appConfig.messaging.adminsTopic.emails.forEach(email => {
            this.adminsTopic.addSubscription(
            new sns_subscriptions.EmailSubscription(email)
            )}
        );

        appConfig.messaging.employeesTopic.emails.forEach(email => {
            this.employeesTopic.addSubscription(
            new sns_subscriptions.EmailSubscription(email)
            )}
        );

        // EventBridge 
        const weeklyMaintenanceRule = new events.Rule(this, 'WeeklyMaintenanceRule', {
            ruleName: appConfig.messaging.events.ruleName,
            description: 'Trigger Archive and Backup workers every Friday at 3 AM',
            schedule: events.Schedule.cron({
                minute: appConfig.messaging.events.weeklyMaintenanceCron.minute,
                hour: appConfig.messaging.events.weeklyMaintenanceCron.hour,
                weekDay: appConfig.messaging.events.weeklyMaintenanceCron.weekDay,
            }),
        });

        /*
        weeklyMaintenanceRule.addTarget(new targets.LambdaFunction(props.archiveWorker));
        weeklyMaintenanceRule.addTarget(new targets.LambdaFunction(props.backupWorker));
        */

        // DLQ alarm for admins by useing cloudwatch
        const dlqAlarm = new cloudwatch.Alarm(this, 'DLQAlarm', {
            alarmName: appConfig.messaging.DLQAlarm.alarmName,
            alarmDescription: 'Order Queue DLQ has messages — investigate immediately',

            metric: this.orderDeadLetterQueue.metricApproximateNumberOfMessagesVisible({
                period: cdk.Duration.minutes(appConfig.messaging.DLQAlarm.period),
                statistic: 'Maximum',
            }),

            threshold: appConfig.messaging.DLQAlarm.threshold,
            evaluationPeriods: appConfig.messaging.DLQAlarm.evaluationPeriods,
            comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
        });

        dlqAlarm.addAlarmAction(new cloudwatch_actions.SnsAction(this.adminsTopic));

    }
}