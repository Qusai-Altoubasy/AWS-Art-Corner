package com.artcorner.erp.dto.response.inventory;

import java.math.BigDecimal;

public interface ProductResponse {
    Long getId();
    String getName();
    BigDecimal getPrice();
    String getImageUrl();
}