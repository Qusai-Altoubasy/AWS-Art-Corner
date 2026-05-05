package com.artcorner.erp.services.inventory;

import com.artcorner.erp.components.sqs.InventoryStockAlertEvent;
import com.artcorner.erp.components.sqs.SqsSender;
import com.artcorner.erp.dto.response.inventory.AdminProductsResponse;
import com.artcorner.erp.dto.response.inventory.CustomerProductResponse;
import com.artcorner.erp.dto.request.inventory.ProductRequest;
import com.artcorner.erp.entities.inventory.Product;
import com.artcorner.erp.exceptions.inventory.InsufficientStockException;
import com.artcorner.erp.exceptions.inventory.ProductNotFoundException;
import com.artcorner.erp.mappers.InventoryMapper;
import com.artcorner.erp.repositories.inventory.InventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class InventoryService {
    private final InventoryRepository inventoryRepository;
    private final InventoryMapper inventoryMapper;
    private static final int STOCK_ALERT = 1000;
    private final SqsSender sqsSender;

    public Product findProductById(Long id) {
        log.debug("Fetching product. productId={}", id);

        return inventoryRepository.findById(id).orElseThrow(() -> {
            log.error("Product not found. productId={}", id);
            return new ProductNotFoundException(id);
        });
    }

    @Transactional
    public Product findProductByIdWithLook(Long id) {
        log.debug("Fetching product with lock. id={}", id);
        return inventoryRepository.findWithLockById(id).orElseThrow(() -> {
            log.error("Product not found with lock. id={}", id);
            return new ProductNotFoundException(id);
        });
    }

    @Transactional
    public void reduceProductQuantity(Product product, Integer quantity) {
        log.info("Reducing product stock. productId={}, requested={}, currentStock={}",
                product.getId(),
                quantity,
                product.getStock());
        int newStock = product.getStock() - quantity;

        if (newStock < 0) {
            log.error("Insufficient stock. productId={}, requested={}, available={}",
                    product.getId(),
                    quantity,
                    product.getStock());

            throw new InsufficientStockException();
        }

        product.setStock(newStock);
        log.info("Stock reduced successfully. productId={}, newStock={}",
                product.getId(),
                product.getStock());

        if (newStock < STOCK_ALERT){
            InventoryStockAlertEvent event = inventoryMapper.mapToInventoryStockAlertEvent(product);
            sqsSender.sendMessageToQueue(event, "StockAlert", String.valueOf(newStock));
        }
    }

    @Transactional
    public void increaseProductQuantity(Product product, int quantity) {
        log.info("Increasing product stock. productId={}, requested={}, currentStock={}",
                product.getId(),
                quantity,
                product.getStock());

        inventoryRepository.incrementStock(product.getId(), quantity);

        log.info("Stock increased successfully. productId={}, newStock={}",
                product.getId(),
                product.getStock());
    }

    public List<AdminProductsResponse> getAllProductForAdmin(){
        log.info("Fetching all products for admin");

        List<Product> products = inventoryRepository.findAll();

        log.debug("Products fetched for admin. count={}", products.size());

        return products.stream().map(inventoryMapper::mapToAdminResponse).toList();
    }

    public AdminProductsResponse addProduct(ProductRequest productRequest) {
        log.info("Adding new product. name={}, price={}",
                productRequest.getName(),
                productRequest.getPrice());

        Product product = inventoryMapper.mapToEntity(productRequest);

        inventoryRepository.save(product);

        log.info("Product added successfully. productId={}", product.getId());

        return inventoryMapper.mapToAdminResponse(product);
    }

    @Transactional
    public AdminProductsResponse updateProduct(Long id, ProductRequest request) {
        log.info("Updating product. productId={}", id);

        Product product = findProductById(id);

        if (request.getName() != null) {
            log.debug("Updating name. productId={}, newName={}", id, request.getName());
            product.setName(request.getName());
        }
        if (request.getPrice() != null) {
            log.debug("Updating price. productId={}, newPrice={}", id, request.getPrice());
            product.setPrice(request.getPrice());
        }
        if (request.getCost() != null) {
            log.debug("Updating cost. productId={}, newCost={}", id, request.getCost());
            product.setCost(request.getCost());
        }
        if (request.getStock() != null) {
            log.debug("Updating stock. productId={}, newStock={}", id, request.getStock());
            product.setStock(request.getStock());
        }
        if (request.getStockThreshold() != null) {
            log.debug("Updating stock threshold. productId={}, newThreshold={}", id, request.getStockThreshold());
            product.setStockThreshold(request.getStockThreshold());
        }
        inventoryRepository.save(product);

        log.info("Product updated successfully. productId={}", id);

        return inventoryMapper.mapToAdminResponse(product);
    }

    public AdminProductsResponse deleteProduct(Long id) {
        log.warn("Soft deleting product. productId={}", id);

        Product product = findProductById(id);

        product.setActive(false);
        inventoryRepository.save(product);

        log.info("Product soft deleted. productId={}", id);

        return inventoryMapper.mapToAdminResponse(product);
    }

    public List<CustomerProductResponse> getAllProductForCustomer(){
        log.info("Fetching all products for customer");

        List<CustomerProductResponse> products =
                inventoryRepository.findAllProductsForCustomer();

        log.debug("Products fetched for customer. count={}", products.size());

        return products;
    }

}
