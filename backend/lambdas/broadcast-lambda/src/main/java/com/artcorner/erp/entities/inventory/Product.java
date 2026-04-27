package com.artcorner.erp.entities.inventory;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;

@Entity
@Table(name = "products")
@SQLRestriction("is_active = true")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, precision = 12, scale = 2)
    @DecimalMin(value = "0.0")
    private BigDecimal price;

    @Column(nullable = false, precision = 12, scale = 2)
    @DecimalMin(value = "0.0")
    private BigDecimal cost;

    @Column(nullable = false)
    @Min(value = 0)
    private int stock;

    @Column(nullable = false)
    @Min(value = 0)
    private int stockThreshold = 1000;

    private String imageUrl;

    @Column(nullable = false)
    private boolean isActive = true;
}
