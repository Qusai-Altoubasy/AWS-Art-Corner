package com.artcorner.erp.security;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class SecurityUtils {

    public AuthenticatedUser getCurrentUser() {
        return (AuthenticatedUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public UUID getCurrentUserId() {
        return getCurrentUser().getUserId();
    }

    public String getCurrentUserEmail() {
        return getCurrentUser().getEmail();
    }
}