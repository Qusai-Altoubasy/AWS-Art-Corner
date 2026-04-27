package com.artcorner.erp.dto.response.inventory;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequest {
    @NotBlank
    private String name;

    @NotBlank
    @DecimalMin(value = "0.0")
    private BigDecimal price;

    @NotBlank
    @DecimalMin(value = "0.0")
    private BigDecimal cost;

    @NotBlank
    @Min(value = 0)
    private Integer stock;

    @NotBlank
    @Min(value = 0)
    private Integer stockThreshold;
}