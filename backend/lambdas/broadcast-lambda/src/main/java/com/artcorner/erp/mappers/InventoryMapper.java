package com.artcorner.erp.mappers;

import com.artcorner.erp.components.sqs.InventoryStockAlertEvent;
import com.artcorner.erp.dto.response.inventory.AdminProductsResponse;
import com.artcorner.erp.dto.request.inventory.ProductRequest;
import com.artcorner.erp.entities.inventory.Product;
import org.springframework.stereotype.Component;

@Component
public class InventoryMapper {
    public AdminProductsResponse mapToAdminResponse(Product product) {
        AdminProductsResponse response = new AdminProductsResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setPrice(product.getPrice());
        response.setCost(product.getCost());
        response.setStock(product.getStock());
        response.setStockThreshold(product.getStockThreshold());
        response.setImageUrl(product.getImageUrl());

        return response;
    }

    public Product mapToEntity(ProductRequest request) {
        Product product = new Product();

        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setCost(request.getCost());
        product.setStock(request.getStock());
        product.setStockThreshold(request.getStockThreshold());

        product.setActive(true);

        return product;
    }

    public InventoryStockAlertEvent mapToInventoryStockAlertEvent(Product product) {
        return InventoryStockAlertEvent.builder()
                .productId(product.getId())
                .productName(product.getName())
                .quantity(product.getStock())
                .build();
    }
}
