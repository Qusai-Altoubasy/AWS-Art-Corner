package com.artcorner.erp.mappers;

import com.artcorner.erp.dto.request.cart.CartItemRequest;
import com.artcorner.erp.dto.response.cart.CartItemResponse;
import com.artcorner.erp.entities.cart.CartItem;
import com.artcorner.erp.components.cart.CartItemWrapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Component
@RequiredArgsConstructor
public class CartItemMapper {
    private static final int TTL_DAYS = 30;

    public CartItem mapToEntity(CartItemWrapper cartItemWrapper, CartItemRequest request) {
        CartItem cartItem = new CartItem();

        cartItem.setProductId(request.getProductId().toString());
        cartItem.setQuantity(request.getQuantity());

        cartItem.setCustomerId(cartItemWrapper.getCustomerId());
        cartItem.setProductName(cartItemWrapper.getProductName());
        cartItem.setImageUrl(cartItemWrapper.getImageUrl());
        cartItem.setPrice(cartItemWrapper.getPrice());

        long ttlInSeconds = Instant.now().plus(TTL_DAYS, ChronoUnit.DAYS).getEpochSecond();
        cartItem.setTtl(ttlInSeconds);

        return cartItem;
    }

    public CartItemResponse mapToCartItemResponse(CartItem cartItem) {
        CartItemResponse cartItemResponse = new CartItemResponse();

        cartItemResponse.setProductId(cartItem.getProductId());
        cartItemResponse.setProductName(cartItem.getProductName());
        cartItemResponse.setImageUrl(cartItem.getImageUrl());
        cartItemResponse.setQuantity(cartItem.getQuantity());
        cartItemResponse.setPrice(cartItem.getPrice());

        return cartItemResponse;
    }
}
