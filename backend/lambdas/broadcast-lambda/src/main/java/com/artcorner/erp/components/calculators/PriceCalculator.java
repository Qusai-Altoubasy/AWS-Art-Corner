package com.artcorner.erp.components.calculators;

import com.artcorner.erp.entities.inventory.Product;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
@RequiredArgsConstructor
public class PriceCalculator {
    private static final int SCALE = 3;

    public BigDecimal calculateItemPrice(Product product, int quantity) {
        return product.getPrice()
                .multiply(BigDecimal.valueOf(quantity))
                .setScale(SCALE, RoundingMode.HALF_UP);
    }

}
