package com.artcorner.erp.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest;

import javax.sql.DataSource;

@Configuration
@RequiredArgsConstructor
public class DataSourceConfig {
    private final AppProperties appProperties;
    private final SecretsManagerClient secretsManagerClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Bean
    public DataSource dataSource() {
        String secretJson = fetchSecret(appProperties.getAws().getDbSecretName());

        DbCredentials credentials = parseSecret(secretJson);

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:postgresql://%s:%d/%s?sslmode=require"
                .formatted(credentials.host(), credentials.port(), credentials.dbname()));
        config.setUsername(credentials.username());
        config.setPassword(credentials.password());
        config.setDriverClassName("org.postgresql.Driver");

        config.setMaximumPoolSize(2);
        config.setMinimumIdle(0);
        config.setIdleTimeout(300_000L);
        config.setConnectionTimeout(3_000L);
        config.setMaxLifetime(850_000L);
        config.setPoolName("ErpHikariPool");
        config.setConnectionTestQuery("SELECT 1");

        return new HikariDataSource(config);
    }

    private String fetchSecret(String secretName) {
        return secretsManagerClient.getSecretValue(
                GetSecretValueRequest.builder().secretId(secretName).build()
        ).secretString();
    }

    private DbCredentials parseSecret(String json) {
        try {
            JsonNode node = objectMapper.readTree(json);
            return new DbCredentials(
                    node.get("host").asText(),
                    node.get("port").asInt(),
                    node.get("dbname").asText(),
                    node.get("username").asText(),
                    node.get("password").asText()
            );
        } catch (Exception e) {
            throw new IllegalStateException("Failed to parse DB secret JSON", e);
        }
    }

    private record DbCredentials(
            String host,
            int port,
            String dbname,
            String username,
            String password
    ) {}
}
