package com.artcorner.erp.components.cognito;

import com.artcorner.erp.config.AppProperties;
import com.artcorner.erp.entities.users.UserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.*;

import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class CognitoManager {
    private final CognitoIdentityProviderClient cognitoClient;
    private final AppProperties appProperties;

    public UUID registerNewUser(String email, String password, UserRole groupName) {
        String userPoolId = getUserPoolId();
        boolean userCreated = false;

        try {
            AdminCreateUserRequest createUserRequest = AdminCreateUserRequest.builder()
                    .userPoolId(userPoolId)
                    .username(email)
                    .temporaryPassword(password)
                    .userAttributes(
                            AttributeType.builder().name("email").value(email).build(),
                            AttributeType.builder().name("email_verified").value("true").build()
                    )
                    .messageAction(MessageActionType.SUPPRESS)
                    .build();

            AdminCreateUserResponse response = cognitoClient.adminCreateUser(createUserRequest);
            log.info("Created user in Cognito User Pool: {}", email);
            userCreated = true;
            setPasswordRequestPermanent(userPoolId, email, password);

            addUserToGroup(userPoolId, email, groupName);

            return getUserId(response);
        } catch (CognitoIdentityProviderException e) {
            log.error("Cognito operation failed for user {}: {}", email, e.awsErrorDetails().errorMessage());

            if (userCreated) {
                rollBackUser(userPoolId, email);
            }

            throw new RuntimeException("Failed to register user: " + e.awsErrorDetails().errorMessage());
        }
    }

    private String getUserPoolId() {
        return appProperties.getAws().getCognitoUserPoolId();
    }

    private void addUserToGroup(String userPoolId, String email, UserRole groupName) {
        AdminAddUserToGroupRequest addToGroupRequest = AdminAddUserToGroupRequest.builder()
                .userPoolId(userPoolId)
                .username(email)
                .groupName(groupName.toString())
                .build();

        log.info("Added user {} to Cognito Group: {}", email, groupName);
        cognitoClient.adminAddUserToGroup(addToGroupRequest);
    }

    private void rollBackUser(String userPoolId, String email) {
        log.warn("Rolling back Cognito user creation for {} due to group assignment failure.", email);
        try {
            cognitoClient.adminDeleteUser(AdminDeleteUserRequest.builder()
                    .userPoolId(userPoolId)
                    .username(email)
                    .build());
            log.warn("Rolled back Cognito user creation for {}", email);
        } catch (Exception ex) {
            log.error("Failed to delete orphaned user {} during rollback: {}", email, ex.getMessage());
            throw new RuntimeException("Failed to register user roll back: " + ex.getMessage());
        }
    }

    private UUID getUserId(AdminCreateUserResponse response) {
        String userId = response.user().attributes().stream()
                .filter(attr -> "sub".equals(attr.name()))
                .map(AttributeType::value)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cognito user created but 'sub' attribute is missing"));

        return UUID.fromString(userId);
    }

    private void setPasswordRequestPermanent(String userPoolId, String email, String password) {
        AdminSetUserPasswordRequest setPasswordRequest = AdminSetUserPasswordRequest.builder()
                .userPoolId(userPoolId)
                .username(email)
                .password(password)
                .permanent(true)
                .build();
        cognitoClient.adminSetUserPassword(setPasswordRequest);
        log.info("Password successfully set to PERMANENT for user: {}", email);
    }
}
