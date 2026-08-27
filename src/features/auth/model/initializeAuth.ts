import { refreshAccessToken } from "@/features/auth/api/authApi";
import { authStorage } from "@/shared/auth/authStorage";
import { tokenStore } from "@/shared/auth/tokenStore";

export const initializeAuth = async () => {
  const refreshToken = authStorage.getRefreshToken();

  if (!refreshToken) {
    return false;
  }

  if (authStorage.isRefreshTokenExpired()) {
    clearToken();

    return false;
  }

  try {
    await refreshAccessToken();

    return true;
  } catch {
    clearToken();

    return false;
  }
};

export const clearToken = () => {
  tokenStore.clearAccessToken();
  authStorage.clear();
};
