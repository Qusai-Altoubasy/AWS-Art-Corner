package com.artcorner.erp.components.validators;

import com.artcorner.erp.entities.inventory.Product;
import com.artcorner.erp.exceptions.inventory.InsufficientStockException;
import org.springframework.stereotype.Component;

@Component
public class QuantityValidator {
    public void validate(Product product, int quantity) {
        if (product.getStock() < quantity) {
            throw new InsufficientStockException();
        }
    }
}
