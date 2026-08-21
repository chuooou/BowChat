import { refreshAccessToken } from "@/features/auth/api/authApi";
import { authStorage } from "@/shared/auth/authStorage";
import { tokenStore } from "@/shared/auth/tokenStore";

export const initializeAuth = async () => {
  const refreshToken = authStorage.getRefreshToken();

  if (!refreshToken) {
    return false;
  }

  if (authStorage.isRefreshTokenExpired()) {
    tokenStore.clearAccessToken();
    authStorage.clear();

    return false;
  }

  try {
    const data = await refreshAccessToken(refreshToken);

    tokenStore.setAccessToken(data.accessToken);

    if (data.refreshToken && data.refreshTokenExpiresIn) {
      authStorage.setRefreshToken(data.refreshToken, data.refreshTokenExpiresIn);
    }

    return true;
  } catch {
    tokenStore.clearAccessToken();
    authStorage.clear();

    return false;
  }
};
