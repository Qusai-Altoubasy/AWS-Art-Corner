package com.artcorner.erp.dto.response.inventory;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class AdminProductsResponse {
    private Long id;
    private String name;
    private BigDecimal price;
    private BigDecimal cost;
    private int stock;
    private int stockThreshold;
    private String imageUrl;
}
