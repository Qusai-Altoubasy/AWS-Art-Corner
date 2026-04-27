package com.artcorner.erp.controllers;

import com.artcorner.erp.dto.request.cart.CartItemRequest;
import com.artcorner.erp.dto.response.cart.CartItemResponse;
import com.artcorner.erp.services.orders.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @PostMapping("/item")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<String> addToCart(@Valid @RequestBody CartItemRequest cartItemRequest) {
        cartService.addItemToCart(cartItemRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body("Item added Successfully");
    }

    @GetMapping("/items")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<CartItemResponse>> getCartItems() {
        return ResponseEntity.ok(cartService.getCartItems());
    }

    @DeleteMapping("/item/{productId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Void> removeFromCart(@PathVariable String productId) {
        cartService.removeFromCart(productId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }


}
