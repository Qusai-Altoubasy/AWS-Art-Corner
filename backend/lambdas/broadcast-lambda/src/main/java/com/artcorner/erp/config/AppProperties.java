package com.artcorner.erp.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@Validated
@Configuration
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    @NotNull
    private Aws aws = new Aws();

    @NotNull
    private Security security = new Security();

    @NotNull
    private Business business = new Business();

    @Data
    public static class Aws {
        @NotBlank private String region;
        @NotBlank private String dbSecretName;
        @NotBlank private String dynamoTableName;
        @NotBlank private String orderQueueUrl;
        @NotBlank private String productsImagesBucketName;
        @NotBlank private String env;
    }

    @Data
    public static class Security{
        private String API_GATEWAY_CONTEXT_ATTRIBUTE =
                "com.amazonaws.apigateway.request.context";
    }

    @Data
    public static class Business {
        private int STOCK_ALERT_THRESHOLD = 1000;
    }
}