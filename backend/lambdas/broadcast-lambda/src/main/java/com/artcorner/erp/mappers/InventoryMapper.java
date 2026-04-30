package com.artcorner.erp.mappers;

import com.artcorner.erp.dto.response.inventory.AdminProductsResponse;
import com.artcorner.erp.dto.request.inventory.ProductRequest;
import com.artcorner.erp.entities.inventory.Product;
import org.springframework.stereotype.Component;

@Component
public class InventoryMapper {
    public AdminProductsResponse mapToAdminResponse(Product product) {
        if (product == null) {
            return null;
        }

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

    public Product mapToEntity(ProductRequest response) {
        if (response == null) {
            return null;
        }

        Product product = new Product();

        product.setName(response.getName());
        product.setPrice(response.getPrice());
        product.setCost(response.getCost());
        product.setStock(response.getStock());
        product.setStockThreshold(response.getStockThreshold());

        product.setActive(true);

        return product;
    }
}
