package com.artcorner.erp.services.orders.helpers;

import com.artcorner.erp.dto.request.cart.CartItemRequest;
import com.artcorner.erp.entities.inventory.Product;
import com.artcorner.erp.entities.orders.CartItem;
import com.artcorner.erp.exceptions.InsufficientStockException;
import com.artcorner.erp.security.SecurityUtils;
import com.artcorner.erp.services.inventory.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CartOrchestrator {
    private final InventoryService inventoryService;
    private final CartItemMapper cartItemMapper;
    private static final int SCALE = 3;


    public CartItem prepareCartItem(String customerId, CartItemRequest request){
        Product product = inventoryService.findProductById(request.getProductId());

        validation(product, request.getQuantity());

        BigDecimal price = calculatePrice(product.getPrice(), request.getQuantity());

        CartItemWrapper wrapper = new CartItemWrapper();
        wrapper.setCustomerId(customerId);
        wrapper.setProductName(product.getName());
        wrapper.setImageUrl(product.getImageUrl());
        wrapper.setPrice(price);

        return cartItemMapper.mapToEntity(wrapper, request);
    }

    private void validation(Product product, int quantity) {
        if (product.getStock() < quantity) {
            throw new InsufficientStockException();
        }
    }

    private BigDecimal calculatePrice(BigDecimal productPrice, int quantity) {
        return productPrice
                .multiply(BigDecimal.valueOf(quantity))
                .setScale(SCALE, RoundingMode.HALF_UP);
    }
}
