package com.artcorner.erp.services.inventory;

import com.artcorner.erp.dto.response.inventory.AdminProductsResponse;
import com.artcorner.erp.dto.response.inventory.ProductRequest;
import com.artcorner.erp.entities.inventory.Product;
import com.artcorner.erp.exceptions.ProductNotFoundException;
import com.artcorner.erp.repositories.inventory.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {
    private final InventoryRepository inventoryRepository;
    private final Mapping mapping;

    public Product findProductById(Long id) {
        return inventoryRepository.findById(id).orElseThrow(() -> new ProductNotFoundException(id));
    }

    public List<AdminProductsResponse> getAllProductForAdmin(){
        List<Product> products = inventoryRepository.findAll();
        return products.stream().map(mapping::mapToAdminResponse).toList();
    }

    public AdminProductsResponse addProduct(ProductRequest productRequest) {
        Product product = mapping.mapToEntity(productRequest);

        inventoryRepository.save(product);

        return mapping.mapToAdminResponse(product);
    }

    @Transactional
    public AdminProductsResponse updateProduct(Long id, ProductRequest request) {
        Product product = findProductById(id);

        if (request.getName() != null)
            product.setName(request.getName());
        if (request.getPrice() != null)
            product.setPrice(request.getPrice());
        if (request.getCost() != null)
            product.setCost(request.getCost());
        if (request.getStock() != null)
            product.setStock(request.getStock());
        if (request.getStockThreshold() != null)
            product.setStockThreshold(request.getStockThreshold());

        inventoryRepository.save(product);
        return mapping.mapToAdminResponse(product);
    }

    public AdminProductsResponse deleteProduct(Long id) {
        Product product = findProductById(id);

        product.setActive(false);
        inventoryRepository.save(product);

        return mapping.mapToAdminResponse(product);
    }

}
