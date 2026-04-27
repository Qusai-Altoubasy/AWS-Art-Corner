package com.artcorner.erp.exceptions;

public class InsufficientStockException extends RuntimeException{
    public InsufficientStockException() {
        super("Insufficient product stock");
    }
}
