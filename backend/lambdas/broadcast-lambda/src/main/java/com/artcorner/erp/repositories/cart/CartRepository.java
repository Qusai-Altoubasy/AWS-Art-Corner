package com.artcorner.erp.repositories.cart;

import com.artcorner.erp.entities.cart.CartItem;
import com.artcorner.erp.exceptions.cart.CartEmptyException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CartRepository {
    private final DynamoDbTable<CartItem> cartTable;

    public void saveItem(CartItem item) {
        cartTable.putItem(item);
    }

    public void deleteItem(String customerId, String productId) {
        Key key = Key.builder().partitionValue(customerId).sortValue(productId).build();
        cartTable.deleteItem(key);
    }

    public void deleteAllItems(String customerId) {
        List<CartItem> cartItems = findByCustomerId(customerId)
                .orElseThrow(CartEmptyException::new);

        cartItems.forEach(cartItem -> deleteItem(customerId, cartItem.getProductId()));
    }

    public Optional<List<CartItem>> findByCustomerId(String customerId) {
        return Optional.of(cartTable.query(
                QueryConditional.keyEqualTo(k -> k.partitionValue(customerId))
        ).items().stream().toList());
    }

    public CartItem findByCustomerIdAndProductId(String customerId, String productId) {
        Key key = Key.builder()
                .partitionValue(customerId)
                .sortValue(productId)
                .build();

        return cartTable.getItem(key);
    }
}