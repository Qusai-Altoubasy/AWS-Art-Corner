package com.artcorner.erp.services.carts;

import com.artcorner.erp.components.shared.UserAccessHelper;
import com.artcorner.erp.dto.request.cart.CartItemRequest;
import com.artcorner.erp.dto.response.cart.CartItemResponse;
import com.artcorner.erp.entities.cart.CartItem;
import com.artcorner.erp.exceptions.CartEmptyException;
import com.artcorner.erp.repositories.cart.CartRepository;
import com.artcorner.erp.mappers.CartItemMapper;
import com.artcorner.erp.components.cart.CartOrchestrator;
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
    private final UserAccessHelper  userAccessHelper;

    public void addItemToCart(UUID customerId, CartItemRequest cartItemRequest) {
        String effectiveCustomerId = userAccessHelper.resolveAndValidateCustomerId(customerId).toString();

        CartItem existing = cartRepository.findByCustomerIdAndProductId(
                effectiveCustomerId, String.valueOf(cartItemRequest.getProductId()));

        CartItem cartItem;
        if (existing != null) {
            cartItemRequest.setQuantity(existing.getQuantity() + cartItemRequest.getQuantity());
        }
        cartItem = cartOrchestrator.prepareCartItem(effectiveCustomerId, cartItemRequest);
        cartRepository.saveItem(cartItem);
    }

    public List<CartItemResponse> getCartItems(UUID customerId) {
        List<CartItem> items = getAllItems(
                userAccessHelper.resolveAndValidateCustomerId(customerId).toString());

        return items.stream().map(cartItemMapper::mapToCartItemResponse).toList();
    }

    public void removeFromCart(UUID customerId, String productId) {
        cartRepository.deleteItem(
                userAccessHelper.resolveAndValidateCustomerId(customerId).toString(),
                productId
        );
    }

    public List<CartItem> getAllItems(String customerId) {
        return cartRepository.findByCustomerId(customerId)
                .orElseThrow(CartEmptyException::new);
    }

    public void deleteAllItems(String customerId) {
        cartRepository.deleteAllItems(customerId);
    }
}
