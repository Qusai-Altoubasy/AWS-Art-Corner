package com.artcorner.erp.exceptions.orders;

import com.artcorner.erp.entities.orders.OrderStatus;

public class IllegalOrderStatusException extends RuntimeException {
    public IllegalOrderStatusException(OrderStatus currentStatus, OrderStatus newStatus) {
        super("Invalid transition from " + currentStatus + " to " + newStatus);
    }
}
