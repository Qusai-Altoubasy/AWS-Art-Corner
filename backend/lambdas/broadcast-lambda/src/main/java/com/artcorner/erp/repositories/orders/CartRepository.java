package com.artcorner.erp.repositories.orders;

import com.artcorner.erp.entities.orders.CartItem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class CartRepository {
    private final DynamoDbTable<CartItem> cartTable;

    public void save(CartItem item) {
        cartTable.putItem(item);
    }

    public List<CartItem> findByCustomerId(String customerId) {
        return cartTable.query(
                QueryConditional.keyEqualTo(k -> k.partitionValue(customerId))
        ).items().stream().toList();
    }

    public void delete(String customerId, String productId) {
        Key key = Key.builder().partitionValue(customerId).sortValue(productId).build();
        cartTable.deleteItem(key);
    }
}