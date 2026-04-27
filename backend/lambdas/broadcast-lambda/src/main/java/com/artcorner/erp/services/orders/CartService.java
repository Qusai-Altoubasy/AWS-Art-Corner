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

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final CartItemMapper cartItemMapper;
    private final SecurityUtils securityUtils;
    private final CartOrchestrator cartOrchestrator;

    public void addItemToCart(CartItemRequest cartItemRequest) {
        CartItem cartItem = cartOrchestrator.prepareCartItem(cartItemRequest);
        cartRepository.save(cartItem);
    }

    public List<CartItemResponse> getCartItems() {
        String customerId = securityUtils.getCurrentUserId().toString();

        List<CartItem> items = cartRepository.findByCustomerId(customerId);

        return items.stream().map(cartItemMapper::mapToCartItemResponse).toList();
    }

    public void removeFromCart(String productId) {
        String customerId = securityUtils.getCurrentUserId().toString();
        cartRepository.delete(customerId, productId);
    }
}
