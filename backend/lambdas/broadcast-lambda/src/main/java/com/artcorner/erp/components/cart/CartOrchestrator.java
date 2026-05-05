package com.artcorner.erp.components.cart;

import com.artcorner.erp.dto.request.cart.CartItemRequest;
import com.artcorner.erp.entities.inventory.Product;
import com.artcorner.erp.entities.cart.CartItem;
import com.artcorner.erp.exceptions.inventory.InsufficientStockException;
import com.artcorner.erp.mappers.CartItemMapper;
import com.artcorner.erp.services.inventory.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
@RequiredArgsConstructor
public class CartOrchestrator {
    private final InventoryService inventoryService;
    private final CartItemMapper cartItemMapper;
    private static final int SCALE = 3;

    public CartItem prepareCartItem(String customerId, CartItemRequest request){
        Product product = inventoryService.findProductById(request.getProductId());

        validationQuantity(product, request.getQuantity());

        BigDecimal price = calculatePrice(product.getPrice(), request.getQuantity());

        CartItemWrapper wrapper = new CartItemWrapper();
        wrapper.setCustomerId(customerId);
        wrapper.setProductName(product.getName());
        wrapper.setImageUrl(product.getImageUrl());
        wrapper.setPrice(price);

        return cartItemMapper.mapToEntity(wrapper, request);
    }

    private void validationQuantity(Product product, int quantity) {
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
