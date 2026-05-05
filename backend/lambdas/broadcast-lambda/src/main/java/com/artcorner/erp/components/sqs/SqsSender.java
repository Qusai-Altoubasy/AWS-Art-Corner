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

    public <T> void sendMessageToQueue(T event, String eventType, String groupId) {
        String queueUrl = getQueueUrl();
        try {
            String body = convertBodyToJson(event);

            SendMessageRequest sendMessageRequest = SendMessageRequest.builder()
                    .queueUrl(queueUrl)
                    .messageBody(body)
                    .messageGroupId(groupId)
                    .messageAttributes(Map.of(
                            "eventType", MessageAttributeValue.builder()
                                    .dataType("String")
                                    .stringValue(eventType)
                                    .build()
                    ))
                    .build();

            sqsClient.sendMessage(sendMessageRequest);
            log.info("Successfully sent {} message to SQS. GroupId={}", eventType, groupId);

        }catch (JsonProcessingException e) {
            log.error("JSON serialization failed for eventType={}, groupID={}", eventType, groupId, e);
            throw new RuntimeException("Failed to convert message body to JSON", e);
        }catch (Exception e){
            log.error("Failed to send message to SQS. eventType={}, groupID={}", eventType, groupId, e);
            throw new RuntimeException("Failed to send order to SQS", e);
        }
    }

    private String getQueueUrl() {
        return appProperties.getAws().getOrderQueueUrl();
    }

    private <T> String convertBodyToJson(T event) throws JsonProcessingException {
        return objectMapper.writeValueAsString(event);
    }
}
