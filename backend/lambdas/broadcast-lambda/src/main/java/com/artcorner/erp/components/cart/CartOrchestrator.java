package com.artcorner.erp.components.cart;

import com.artcorner.erp.components.calculators.PriceCalculator;
import com.artcorner.erp.components.validators.QuantityValidator;
import com.artcorner.erp.dto.request.cart.CartItemRequest;
import com.artcorner.erp.entities.inventory.Product;
import com.artcorner.erp.entities.cart.CartItem;
import com.artcorner.erp.exceptions.inventory.InsufficientStockException;
import com.artcorner.erp.mappers.CartItemMapper;
import com.artcorner.erp.services.inventory.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class CartOrchestrator {
    private final InventoryService inventoryService;
    private final CartItemMapper cartItemMapper;
    private final PriceCalculator  priceCalculator;
    private final QuantityValidator quantityValidator;

    public CartItem prepareCartItem(String customerId, CartItemRequest request){
        Product product = inventoryService.findProductById(request.getProductId());

        quantityValidator.validate(product, request.getQuantity());

        BigDecimal price = priceCalculator.calculateItemPrice(product, request.getQuantity());

        CartItemWrapper wrapper = new CartItemWrapper();
        wrapper.setCustomerId(customerId);
        wrapper.setProductName(product.getName());
        wrapper.setImageUrl(product.getImageUrl());
        wrapper.setPrice(price);

        return cartItemMapper.mapToEntity(wrapper, request);
    }
}
