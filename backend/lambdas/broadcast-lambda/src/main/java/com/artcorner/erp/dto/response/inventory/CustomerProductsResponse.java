package com.artcorner.erp.dto.response.inventory;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CustomerProductsResponse {
    private String name;
    private BigDecimal price;
    private String imageUrl;
}
