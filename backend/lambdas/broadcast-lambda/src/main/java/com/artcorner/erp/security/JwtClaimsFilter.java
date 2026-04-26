package com.artcorner.erp.security;

import com.artcorner.erp.config.AppProperties;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class JwtClaimsFilter extends OncePerRequestFilter {

    private final AppProperties appProperties;

    @Override
    @SuppressWarnings("unchecked")
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        Map<String, Object> claims = (Map<String, Object>)
                request.getAttribute(appProperties.getSecurity().getCOGNITO_CLAIMS_ATTRIBUTE());

        if (isValidClaims(claims)) {
            setUpAuthentication(claims);
        }

        filterChain.doFilter(request, response);
    }

    private boolean isValidClaims(Map<String, Object> claims) {
        return claims != null &&
                claims.containsKey("sub") &&
                claims.containsKey("email");
    }

    private void setUpAuthentication(Map<String, Object> claims) {
        String sub = (String) claims.get("sub");
        String email = (String) claims.get("email");
        List<String> roles = extractRoles(claims.get("cognito:groups"));

        AuthenticatedUser user = new AuthenticatedUser(UUID.fromString(sub), email, roles);

        var authorities = roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                .toList();

        var auth = new UsernamePasswordAuthenticationToken(user, null, authorities);
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    private List<String> extractRoles(Object groupsObj) {
        if (groupsObj instanceof String role) {
            return List.of(role);
        } else if (groupsObj instanceof List<?> roleList) {
            return roleList.stream().map(Object::toString).toList();
        }
        return List.of();
    }
}