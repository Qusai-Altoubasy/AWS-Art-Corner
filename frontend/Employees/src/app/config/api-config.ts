import axios from "axios";
import { authSession } from "../utils/AuthSession";
import { useUserStore } from "../../features/auth/store/useUserStore";
import { authRepository } from "../../features/auth/repository/AuthRepository";
import { ROUTES } from "../router/routes";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await authSession();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const status = error.response?.data?.status;

    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    if (status === 401) {
      await authRepository.logout();
      useUserStore.getState().clearUser();

      window.location.href = ROUTES.LOGIN;
    }

    return Promise.reject(new Error(message));
  },
);
