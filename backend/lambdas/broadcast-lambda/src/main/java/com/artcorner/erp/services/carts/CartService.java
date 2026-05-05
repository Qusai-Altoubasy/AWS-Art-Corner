package com.artcorner.erp.services.carts;

import com.artcorner.erp.components.shared.UserAccessHelper;
import com.artcorner.erp.dto.request.cart.CartItemRequest;
import com.artcorner.erp.dto.response.cart.CartItemResponse;
import com.artcorner.erp.entities.cart.CartItem;
import com.artcorner.erp.exceptions.cart.CartEmptyException;
import com.artcorner.erp.repositories.cart.CartRepository;
import com.artcorner.erp.mappers.CartItemMapper;
import com.artcorner.erp.components.cart.CartOrchestrator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final CartItemMapper cartItemMapper;
    private final CartOrchestrator cartOrchestrator;
    private final UserAccessHelper  userAccessHelper;

    public void addItemToCart(UUID customerId, CartItemRequest cartItemRequest) {
        String effectiveCustomerId = userAccessHelper.resolveAndValidateCustomerId(customerId).toString();

        log.info("Adding item to cart. customerId={}, productId={}, quantity={}",
                effectiveCustomerId,
                cartItemRequest.getProductId(),
                cartItemRequest.getQuantity()
        );

        CartItem existing = cartRepository.findByCustomerIdAndProductId(
                effectiveCustomerId, String.valueOf(cartItemRequest.getProductId()));

        CartItem cartItem;
        if (existing != null) {
            log.info("Item already exists in cart. Updating quantity. oldQuantity={}, added={}",
                    existing.getQuantity(),
                    cartItemRequest.getQuantity()
            );

            cartItemRequest.setQuantity(existing.getQuantity() + cartItemRequest.getQuantity());
        }
        cartItem = cartOrchestrator.prepareCartItem(effectiveCustomerId, cartItemRequest);

        cartRepository.saveItem(cartItem);

        log.info("Item saved to cart. customerId={}, productId={}, finalQuantity={}",
                effectiveCustomerId,
                cartItem.getProductId(),
                cartItem.getQuantity()
        );
    }

    public List<CartItemResponse> getCartItems(UUID customerId) {
        String effectiveCustomerId = userAccessHelper.resolveAndValidateCustomerId(customerId).toString();

        List<CartItem> items = getAllItems(effectiveCustomerId);

        log.info("Fetching cart items. customerId={}, itemsCount={}",
                effectiveCustomerId,
                items.size()
        );

        return items.stream().map(cartItemMapper::mapToCartItemResponse).toList();
    }

    public void removeFromCart(UUID customerId, String productId) {
        String effectiveCustomerId = userAccessHelper.resolveAndValidateCustomerId(customerId).toString();

        cartRepository.deleteItem(
                effectiveCustomerId,
                productId
        );

        log.info("Removing item from cart. customerId={}, productId={}",
                effectiveCustomerId,
                productId
        );

    }

    public List<CartItem> getAllItems(String customerId) {
        List<CartItem> items = cartRepository.findByCustomerId(customerId)
                .orElseThrow(() -> {
                    log.error("Cart is empty. customerId={}", customerId);
                    return new CartEmptyException();
                });

        log.debug("Cart fetched. customerId={}, itemsCount={}",
                customerId,
                items.size()
        );

        return items;
    }

    public void deleteAllItems(String customerId) {
        log.info("Deleting all cart items. customerId={}", customerId);

        cartRepository.deleteAllItems(customerId);

        log.info("All cart items deleted. customerId={}", customerId);
    }
}
