package com.artcorner.erp.exceptions.orders;

public class OrderNotPendingException extends RuntimeException {
    public OrderNotPendingException() {
        super("Order Not Pending");
    }
}
