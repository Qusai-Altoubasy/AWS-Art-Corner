package com.artcorner.erp.exceptions.inventory;

public class InsufficientStockException extends RuntimeException{
    public InsufficientStockException() {
        super("Insufficient product stock");
    }
}
