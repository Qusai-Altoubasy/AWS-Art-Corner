import {signIn, signOut} from "aws-amplify/auth";
import {LoginRequest} from "../types/LoginRequest";
import {UserResponse} from "../types/UserResponse.ts";
import {api} from "../../../app/config/api-config";

class AuthRepository {
    async login(data: LoginRequest): Promise<UserResponse> {
        const response = await signIn({
            username: data.email,
            password: data.password,
        });

        if (!response.isSignedIn) {
            throw new Error("Invalid credentials");
        }
        try {
            return await this.getMe();
        } catch (error) {
            await signOut();
            throw error;
        }
    }

    async getMe(): Promise<UserResponse> {
        const response = await api.get("/api/users/login");
        return response.data;
    }

    async logout(): Promise<void> {
        await signOut();
    }
}

export const authRepository = new AuthRepository();
