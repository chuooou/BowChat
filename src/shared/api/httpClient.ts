import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import { refreshAccessToken } from "@/features/auth/api/authApi";
import { clearToken } from "@/features/auth/model/initializeAuth";
import { authEvents } from "@/shared/auth/authEvents";
import { tokenStore } from "@/shared/auth/tokenStore";

type RefreshResponse = {
  accessToken: string;
  refreshToken?: string;
  refreshTokenExpiresIn?: number;
};

type RetryRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const config = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
};

const publicHttp = axios.create(config);
const http = axios.create(config);

http.interceptors.request.use(
  (config) => {
    const accessToken = tokenStore.getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

let refreshPromise: Promise<string> | null = null;

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig;
    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return http(originalRequest);
    } catch (refreshError) {
      clearToken();

      authEvents.emitUnauthorized();

      return Promise.reject(refreshError);
    }
  },
);

export { http, publicHttp };
