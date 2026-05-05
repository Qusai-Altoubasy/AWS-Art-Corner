package com.artcorner.erp.entities.orders;

import com.artcorner.erp.entities.inventory.Product;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@SQLRestriction("is_active = true")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnore
    private Product product;

    @Column(nullable = false)
    @Min(value = 1)
    private int quantity;

    @Column(nullable = false, precision = 12, scale = 2)
    @DecimalMin(value = "0.0")
    private BigDecimal price;

    @Column(nullable = false, precision = 12, scale = 2)
    @DecimalMin(value = "0.0")
    private BigDecimal cost;

    @Builder.Default
    @Column(nullable = false)
    private boolean isActive = true;
}
