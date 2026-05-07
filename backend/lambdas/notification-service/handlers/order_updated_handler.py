from services.ses_service import send_email

def handleOrderUpdated(message):
    send_email(
        to_email=message["customerEmail"],
        subject="Order Updated",
        body=format_order_updated(message)
    )


def format_order_updated(message):
    return f"""
Hello {message['customerName']},

Your order has been updated.

----------------------------------------
Order Details:

Order ID: {message['orderId']}
New status: {message['orderStatus']}
Total Amount: {message['totalAmount']}
Last Updated: {message['updatedAt']}

----------------------------------------
If you have any questions, feel free to contact us.

Thank you for choosing us!
"""