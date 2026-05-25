import { signIn, signOut } from "aws-amplify/auth";
import { LoginRequest } from "../types/LoginRequest";
import { User } from "../types/User";
import { api } from "../../../app/config/api-config";
import { RegisterRequest } from "../types/RegisterRequest";

class AuthRepository {
  async login(data: LoginRequest): Promise<User> {
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

  async getMe(): Promise<User> {
    const response = await api.get<User>("/api/users/login");
    return response.data;
  }

  async logout(): Promise<void> {
    await signOut();
  }

  async register(
    data: RegisterRequest,
  ): Promise<{ message: string; email: string }> {
    const response = await api.post<{ message: string; email: string }>("/api/users/signup", data);
    return response.data;
  }
}

export const authRepository = new AuthRepository();
