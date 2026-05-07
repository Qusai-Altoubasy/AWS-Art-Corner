import boto3
from config import vars

ses = boto3.client("ses", region_name=vars.REGION)

def send_email(to_email, subject, body):
    ses.send_email(
        Source=vars.FROM_EMAIL,
        Destination={"ToAddresses": [to_email]},
        Message={
            "Subject": {"Data": subject},
            "Body": {"Text": {"Data": body}},
        },
    )