package com.artcorner.erp.exceptions.inventory;

public class ProductNotFoundException extends RuntimeException{
    public ProductNotFoundException(Long id) {
        super("Product with id " + id + " not found");
    }
}
