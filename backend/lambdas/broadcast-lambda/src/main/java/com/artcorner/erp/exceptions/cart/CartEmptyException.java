package com.artcorner.erp.exceptions.cart;

public class CartEmptyException extends RuntimeException {
    public CartEmptyException() {
        super("The cart is empty");
    }
}
