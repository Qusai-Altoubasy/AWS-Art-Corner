package com.artcorner.erp.services.orders;

import com.artcorner.erp.dto.request.cart.CartItemRequest;
import com.artcorner.erp.dto.response.cart.CartItemResponse;
import com.artcorner.erp.entities.orders.CartItem;
import com.artcorner.erp.repositories.orders.CartRepository;
import com.artcorner.erp.security.SecurityUtils;
import com.artcorner.erp.services.orders.helpers.CartItemMapper;
import com.artcorner.erp.services.orders.helpers.CartOrchestrator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final CartItemMapper cartItemMapper;
    private final SecurityUtils securityUtils;
    private final CartOrchestrator cartOrchestrator;
    private static final String EMPLOYEE_ROLE = "EMPLOYEE";

    public void addItemToCart(UUID customerId, CartItemRequest cartItemRequest) {
        CartItem existing = cartRepository.findByCustomerIdAndProductId(
                getCustomerId(customerId), String.valueOf(cartItemRequest.getProductId()));

        CartItem cartItem;
        if (existing != null) {
            cartItemRequest.setQuantity(existing.getQuantity() + cartItemRequest.getQuantity());
        }
        cartItem = cartOrchestrator.prepareCartItem(getCustomerId(customerId), cartItemRequest);
        cartRepository.save(cartItem);
    }

    public List<CartItemResponse> getCartItems(UUID customerId) {
        List<CartItem> items = cartRepository.findByCustomerId(getCustomerId(customerId));

        return items.stream().map(cartItemMapper::mapToCartItemResponse).toList();
    }

    public void removeFromCart(UUID customerId, String productId) {
        cartRepository.delete(
                getCustomerId(customerId),
                productId
        );
    }

    private String getCustomerId(UUID customerId) {
        return customerId != null && Objects.equals(securityUtils.getCurrentUserRole(), EMPLOYEE_ROLE)
                ? customerId.toString()
                : securityUtils.getCurrentUserId().toString();
    }
}
