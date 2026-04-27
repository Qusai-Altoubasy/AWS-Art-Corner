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
import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @PostMapping("/item")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'CUSTOMER')")
    public ResponseEntity<String> addToCart(@RequestParam(required = false) UUID customerId, @Valid @RequestBody CartItemRequest cartItemRequest) {
        cartService.addItemToCart(customerId, cartItemRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body("Item added Successfully");
    }

    @GetMapping("/items")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'CUSTOMER')")
    public ResponseEntity<List<CartItemResponse>> getCartItems(@RequestParam(required = false) UUID customerId) {
        return ResponseEntity.ok(cartService.getCartItems(customerId));
    }

    @DeleteMapping("/item/{productId}")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'CUSTOMER')")
    public ResponseEntity<Void> removeFromCart(@RequestParam(required = false) UUID customerId, @PathVariable String productId) {
        cartService.removeFromCart(customerId, productId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }


}
