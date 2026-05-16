package com.artcorner.erp.components.S3;

import com.artcorner.erp.config.AppProperties;
import com.artcorner.erp.dto.response.inventory.PresignedUrlResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class S3StorageManager {
    private final AppProperties appProperties;
    private final S3Presigner s3Presigner;

    public PresignedUrlResponse generateUploadUrl(String contentType) {
        String bucketName = getBucketName();

        String fileExtension = contentType.substring(contentType.lastIndexOf("/") + 1);
        String s3Key = "images/products/" + UUID.randomUUID() + "." + fileExtension;

        log.info("Generating presigned URL for contentType: {} with key: {}", contentType, s3Key);

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(s3Key)
                .contentType(contentType)
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(15))
                .putObjectRequest(putObjectRequest)
                .build();

        String uploadUrl = s3Presigner.presignPutObject(presignRequest).url().toString();

        String cloudFrontDomain = "https://d1841lhog5n0nb.cloudfront.net";
        String finalImageUrl = cloudFrontDomain + "/" + s3Key;

        return PresignedUrlResponse.builder()
                .presignedUrl(uploadUrl)
                .imageUrl(finalImageUrl)
                .build();
    }

    private String getBucketName() {
        return appProperties.getAws().getProductsImagesBucketName();
    }
}
