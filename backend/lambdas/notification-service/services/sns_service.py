import boto3
from config import vars

sns = boto3.client("sns", region_name=vars.REGION)

def publish(message, topic_arn):
    sns.publish(
        TopicArn=topic_arn,
        Message=message
    )