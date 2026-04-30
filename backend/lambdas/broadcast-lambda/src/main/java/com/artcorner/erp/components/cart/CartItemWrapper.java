package com.artcorner.erp.components.cart;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CartItemWrapper {
    private String customerId;
    private String productName;
    private String imageUrl;
    private BigDecimal price;
}
