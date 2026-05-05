import json

def handler(event, context):
    print("Full SQS Event: ", json.dumps(event))
    
    for record in event.get('Records', []):
        message_body = record.get('body')
        
        attributes = record.get('messageAttributes', {})
        event_type = attributes.get('eventType', {}).get('stringValue', 'Unknown')
        
        print(f"--- New Message Received ---")
        print(f"Event Type: {event_type}")
        print(f"Message Content: {message_body}")
        
        try:
            body_data = json.loads(message_body)
            print(f"Order ID from body: {body_data.get('orderId')}")
        except Exception as e:
            print(f"Could not parse body: {e}")

    return {
        "statusCode": 200,
        "body": "Messages processed successfully"
    }