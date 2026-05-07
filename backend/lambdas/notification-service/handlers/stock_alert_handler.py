from config.vars import ADMINS_TOPIC_ARN
from services.sns_service import publish

def handleStockAlert(message):
    publish(format_stock_alert(message), ADMINS_TOPIC_ARN)


def format_stock_alert(message):
    return f"""
⚠️ Stock Alert

Product: {message['productName']}
Product ID: {message['productId']}
Remaining Quantity: {message['quantity']}
"""