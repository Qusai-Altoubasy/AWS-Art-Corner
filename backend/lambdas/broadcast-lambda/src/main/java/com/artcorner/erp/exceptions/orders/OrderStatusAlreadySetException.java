package com.artcorner.erp.exceptions.orders;

public class OrderStatusAlreadySetException extends RuntimeException {
    public OrderStatusAlreadySetException() {
        super("Order status already set");
    }
}
