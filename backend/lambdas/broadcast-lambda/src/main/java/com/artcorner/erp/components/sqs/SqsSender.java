package com.artcorner.erp.components.sqs;

import com.artcorner.erp.config.AppProperties;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.MessageAttributeValue;
import software.amazon.awssdk.services.sqs.model.SendMessageRequest;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class SqsSender {
    private final SqsClient sqsClient;
    private final AppProperties  appProperties;
    private final ObjectMapper objectMapper;

    public void sendMessageToQueue(OrderPlacedEvent orderPlacedEvent) {
        String queueUrl = getQueueUrl();
        try {
            String body = convertBodyToJson(orderPlacedEvent);

            SendMessageRequest sendMessageRequest = SendMessageRequest.builder()
                    .queueUrl(queueUrl)
                    .messageBody(body)
                    .messageAttributes(Map.of(
                            "eventType", MessageAttributeValue.builder()
                                    .dataType("String")
                                    .stringValue("OrderCreated")
                                    .build()
                    ))
                    .build();

            sqsClient.sendMessage(sendMessageRequest);

        }catch (JsonProcessingException e) {
            log.error("JSON serialization failed for orderId={}", orderPlacedEvent.getOrderId(), e);
            throw new RuntimeException("Failed to convert message body to JSON", e);
        }catch (Exception e){
            log.error("Failed to send message to SQS. orderId={}", orderPlacedEvent.getOrderId(), e);
            throw new RuntimeException("Failed to send order to SQS", e);
        }
    }

    private String getQueueUrl() {
        return appProperties.getAws().getOrderQueueUrl();
    }

    private String convertBodyToJson(OrderPlacedEvent orderPlacedEvent) throws JsonProcessingException {
        return objectMapper.writeValueAsString(orderPlacedEvent);
    }
}
