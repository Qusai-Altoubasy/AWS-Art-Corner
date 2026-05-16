package com.artcorner.erp.dto.response.inventory;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PresignedUrlResponse {
    private String presignedUrl;
    private String imageUrl;
}
