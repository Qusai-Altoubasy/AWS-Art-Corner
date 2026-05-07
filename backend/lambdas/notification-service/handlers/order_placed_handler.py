from config.vars import EMPLOYEES_TOPIC_ARN
from services.sns_service import publish

def handleOrderPlaced(message):
    publish(format_order_placed(message), EMPLOYEES_TOPIC_ARN)


def format_order_placed(message):
    text = f"""
New Order Placed

Order ID: {message['orderId']}
Customer: {message['customerName']}
Phone: {message['customerPhone']}
Total: {message['totalAmount']}

Items:
"""

    for item in message.get("messageOrderItems", []):
        text += f"- {item['productName']} x{item['quantity']} (${item['price']})\n"

    return text