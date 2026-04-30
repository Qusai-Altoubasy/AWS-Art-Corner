package com.artcorner.erp.exceptions;

public class CartEmptyException extends RuntimeException {
    public CartEmptyException() {
        super("The cart is empty");
    }
}
