package com.artcorner.erp.dto.response.users;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserSignupResponse {
    private String message;
    private String email;
}