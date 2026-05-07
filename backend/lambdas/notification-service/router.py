from handlers import order_placed_handler, order_updated_handler, stock_alert_handler

ROUTES = {
    "OrderPlaced": order_placed_handler.handleOrderPlaced,
    "OrderUpdated": order_updated_handler.handleOrderUpdated,
    "StockAlert": stock_alert_handler.handleStockAlert,
}

def route(event_type, message):
    handler = ROUTES.get(event_type)

    if not handler:
        raise Exception(f"Unknown event type: {event_type}")

    handler(message)