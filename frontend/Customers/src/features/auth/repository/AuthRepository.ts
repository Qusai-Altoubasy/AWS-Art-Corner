import { signIn, signOut } from "aws-amplify/auth";
import { LoginRequest } from "../types/LoginRequest";
import { User } from "../types/User";
import { api } from "../../../app/config/api-config";

class AuthRepository {
  async login(data: LoginRequest): Promise<User> {
    const response = await signIn({
      username: data.email,
      password: data.password,
    });

    if (!response.isSignedIn) {
      throw new Error("Invalid credentials");
    }
    return this.getMe();
  }

  async getMe(): Promise<User> {
    const response = await api.get("/api/users/login");
    return response.data;
  }

  async logout(): Promise<void> {
    await signOut();
  }
}

export const authRepository = new AuthRepository();
