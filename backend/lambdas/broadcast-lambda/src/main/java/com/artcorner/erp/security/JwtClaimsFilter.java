package com.artcorner.erp.security;

import com.amazonaws.serverless.proxy.model.ApiGatewayAuthorizerContext;
import com.amazonaws.serverless.proxy.model.AwsProxyRequestContext;
import com.amazonaws.serverless.proxy.model.CognitoAuthorizerClaims;
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
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class JwtClaimsFilter extends OncePerRequestFilter {

    private final AppProperties appProperties;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        Object contextObj = request.getAttribute(appProperties.getSecurity().getAPI_GATEWAY_REQUEST_CONTEXT());

        if (contextObj instanceof AwsProxyRequestContext context) {
            ApiGatewayAuthorizerContext authorizer = context.getAuthorizer();

            if (authorizer != null) {
                CognitoAuthorizerClaims claims = authorizer.getClaims();

                if (claims != null) {
                    setUpAuthentication(claims);
                }
            }
        }
        filterChain.doFilter(request, response);
    }

    private void setUpAuthentication(CognitoAuthorizerClaims claims) {
        String sub = claims.getSubject();
        String email = claims.getEmail();
        String role = claims.getClaim("cognito:groups");

        if (!isValidClaims(sub, email)) {
            return;
        }

        AuthenticatedUser user = new AuthenticatedUser(
                UUID.fromString(sub),
                email,
                role
        );

        List <SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));

        var auth = new UsernamePasswordAuthenticationToken(user, null, authorities);

        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    private boolean isValidClaims(String sub, String email) {
        return sub != null && email != null;
    }
}