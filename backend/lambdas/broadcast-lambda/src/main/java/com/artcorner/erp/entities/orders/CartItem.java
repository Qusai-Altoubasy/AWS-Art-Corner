package com.artcorner.erp.entities.orders;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbSortKey;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@DynamoDbBean
public class CartItem {

    @Getter(onMethod_ = {@DynamoDbPartitionKey})
    private String customerId;

    @Getter(onMethod_ = {@DynamoDbSortKey})
    private String productId;

    private String productName;
    private String imageUrl;
    private Integer quantity;
    private BigDecimal price;

    private Long ttl;
}