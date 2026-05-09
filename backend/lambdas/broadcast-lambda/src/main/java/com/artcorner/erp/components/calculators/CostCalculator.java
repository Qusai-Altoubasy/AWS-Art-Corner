package com.artcorner.erp.components.calculators;

import com.artcorner.erp.entities.inventory.Product;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
@RequiredArgsConstructor
public class CostCalculator {
    private static final int SCALE = 3;

    public BigDecimal calculateItemCost(Product product, int quantity) {
        return product.getCost()
                .multiply(BigDecimal.valueOf(quantity))
                .setScale(SCALE, RoundingMode.HALF_UP);
    }
}
