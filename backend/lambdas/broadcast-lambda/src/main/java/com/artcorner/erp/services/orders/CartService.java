package com.artcorner.erp.services.orders;

import com.artcorner.erp.dto.request.cart.CartItemRequest;
import com.artcorner.erp.dto.response.cart.CartItemResponse;
import com.artcorner.erp.entities.orders.CartItem;
import com.artcorner.erp.repositories.orders.CartRepository;
import com.artcorner.erp.services.orders.helpers.CartItemMapper;
import com.artcorner.erp.services.orders.helpers.CartOrchestrator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final CartItemMapper cartItemMapper;
    private final CartOrchestrator cartOrchestrator;

    public void addItemToCart(UUID customerId, CartItemRequest cartItemRequest) {
        String effectiveCustomerId = cartOrchestrator.getCustomerId(customerId);

        CartItem existing = cartRepository.findByCustomerIdAndProductId(
                effectiveCustomerId, String.valueOf(cartItemRequest.getProductId()));

        CartItem cartItem;
        if (existing != null) {
            cartItemRequest.setQuantity(existing.getQuantity() + cartItemRequest.getQuantity());
        }
        cartItem = cartOrchestrator.prepareCartItem(effectiveCustomerId, cartItemRequest);
        cartRepository.save(cartItem);
    }

    public List<CartItemResponse> getCartItems(UUID customerId) {
        List<CartItem> items = cartRepository.findByCustomerId(cartOrchestrator.getCustomerId(customerId));

        return items.stream().map(cartItemMapper::mapToCartItemResponse).toList();
    }

    public void removeFromCart(UUID customerId, String productId) {
        cartRepository.delete(
                cartOrchestrator.getCustomerId(customerId),
                productId
        );
    }
}
