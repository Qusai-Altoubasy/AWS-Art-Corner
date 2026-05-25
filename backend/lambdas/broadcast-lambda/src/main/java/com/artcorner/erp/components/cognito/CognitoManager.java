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
        boolean userCreated = false;

        try {
            UUID userId = createUserRequest(email, password);

            log.info("Created user in Cognito User Pool: {}", email);
            userCreated = true;
            setPasswordRequestPermanent(email, password);

            addUserToGroup(email, groupName);

            return userId;
        } catch (CognitoIdentityProviderException e) {
            log.error("Cognito operation failed for user {}: {}", email, e.awsErrorDetails().errorMessage());

            if (userCreated) {
                rollBackUser(email);
            }

            throw new RuntimeException("Failed to register user: " + e.awsErrorDetails().errorMessage());
        }
    }

    public void updateUserActivationStatus(String email, boolean enable) {
        try {
            if (enable) {
                enableUser(email);
                log.info("Successfully ENABLED user in Cognito: {}", email);
            } else {
                disableUser(email);
                log.info("Successfully DISABLED user in Cognito: {}", email);

                userGlobalSignOut(email);
                log.info("Global sign-out executed for disabled user: {}", email);
            }
        } catch (CognitoIdentityProviderException e) {
            log.error("Failed to update Cognito activation status for {}: {}", email, e.awsErrorDetails().errorMessage());
            throw new RuntimeException("Cognito synchronization failed: " + e.awsErrorDetails().errorMessage());
        }
    }

    private UUID createUserRequest(String email, String password) {
        AdminCreateUserRequest createUserRequest = AdminCreateUserRequest.builder()
                .userPoolId(getUserPoolId())
                .username(email)
                .temporaryPassword(password)
                .userAttributes(
                        AttributeType.builder().name("email").value(email).build(),
                        AttributeType.builder().name("email_verified").value("true").build()
                )
                .messageAction(MessageActionType.SUPPRESS)
                .build();

        AdminCreateUserResponse response = cognitoClient.adminCreateUser(createUserRequest);
        return getUserId(response);
    }

    private UUID getUserId(AdminCreateUserResponse response) {
        String userId = response.user().attributes().stream()
                .filter(attr -> "sub".equals(attr.name()))
                .map(AttributeType::value)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cognito user created but 'sub' attribute is missing"));

        return UUID.fromString(userId);
    }

    private void setPasswordRequestPermanent(String email, String password) {
        AdminSetUserPasswordRequest setPasswordRequest = AdminSetUserPasswordRequest.builder()
                .userPoolId(getUserPoolId())
                .username(email)
                .password(password)
                .permanent(true)
                .build();
        cognitoClient.adminSetUserPassword(setPasswordRequest);
        log.info("Password successfully set to PERMANENT for user: {}", email);
    }

    private void addUserToGroup(String email, UserRole groupName) {
        AdminAddUserToGroupRequest addToGroupRequest = AdminAddUserToGroupRequest.builder()
                .userPoolId(getUserPoolId())
                .username(email)
                .groupName(groupName.toString())
                .build();

        log.info("Added user {} to Cognito Group: {}", email, groupName);
        cognitoClient.adminAddUserToGroup(addToGroupRequest);
    }

    private void rollBackUser(String email) {
        log.warn("Rolling back Cognito user creation for {} due to group assignment failure.", email);
        try {
            cognitoClient.adminDeleteUser(AdminDeleteUserRequest.builder()
                    .userPoolId(getUserPoolId())
                    .username(email)
                    .build());
            log.warn("Rolled back Cognito user creation for {}", email);
        } catch (Exception ex) {
            log.error("Failed to delete orphaned user {} during rollback: {}", email, ex.getMessage());
            throw new RuntimeException("Failed to register user roll back: " + ex.getMessage());
        }
    }

    private void enableUser(String email){
        AdminEnableUserRequest enableRequest = AdminEnableUserRequest.builder()
                .userPoolId(getUserPoolId())
                .username(email)
                .build();
        cognitoClient.adminEnableUser(enableRequest);
    }

    private void disableUser(String email){
        AdminDisableUserRequest disableRequest = AdminDisableUserRequest.builder()
                .userPoolId(getUserPoolId())
                .username(email)
                .build();
        cognitoClient.adminDisableUser(disableRequest);
    }

    private void userGlobalSignOut(String email){
        AdminUserGlobalSignOutRequest signOutRequest = AdminUserGlobalSignOutRequest.builder()
                .userPoolId(getUserPoolId())
                .username(email)
                .build();
        cognitoClient.adminUserGlobalSignOut(signOutRequest);
    }

    private String getUserPoolId() {
        return appProperties.getAws().getCognitoUserPoolId();
    }
}
