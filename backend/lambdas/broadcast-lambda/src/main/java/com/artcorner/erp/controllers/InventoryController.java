package com.artcorner.erp.controllers;

import com.artcorner.erp.dto.response.inventory.AdminProductsResponse;
import com.artcorner.erp.dto.response.inventory.ProductRequest;
import com.artcorner.erp.services.inventory.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventiry")
@RequiredArgsConstructor
public class InventoryController {
    private final InventoryService inventoryService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AdminProductsResponse>> getProducts() {
        return ResponseEntity.ok(inventoryService.getAllProductForAdmin());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminProductsResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(inventoryService.addProduct(request));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminProductsResponse> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequest productRequest) {

        return ResponseEntity.ok(inventoryService.updateProduct(id, productRequest));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminProductsResponse> deleteProduct(@PathVariable Long id) {
        return ResponseEntity.ok(inventoryService.deleteProduct(id));
    }

}
