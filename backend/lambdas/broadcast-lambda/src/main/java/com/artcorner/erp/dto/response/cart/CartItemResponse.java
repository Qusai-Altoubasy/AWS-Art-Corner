package com.artcorner.erp.dto.response.cart;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CartItemResponse {
    private String productId;
    private String productName;
    private String imageUrl;
    private Integer quantity;
    private BigDecimal price;
}
