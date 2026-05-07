import json
from router import route

def handler(event, context):
    for record in event["Records"]:

        body = json.loads(record["body"])

        event_type = record["messageAttributes"]["eventType"]["stringValue"]

        route(event_type, body)