import { http, publicHttp } from "@/shared/api/httpClient";
import { authStorage } from "@/shared/auth/authStorage";
import { tokenStore } from "@/shared/auth/tokenStore";

type RefreshResponse = {
  accessToken: string;
  refreshToken?: string;
  refreshTokenExpiresIn?: number;
};

export const refreshAccessToken = async () => {
  const refreshToken = authStorage.getRefreshToken();

  if (!refreshToken || authStorage.isRefreshTokenExpired()) {
    throw new Error("Refresh token is not available");
  }

  const { data } = await http.post<RefreshResponse>("/auth/refresh", {
    refreshToken,
  });

  tokenStore.setAccessToken(data.accessToken);

  if (data.refreshToken && data.refreshTokenExpiresIn) {
    authStorage.setRefreshToken(data.refreshToken, data.refreshTokenExpiresIn);
  }

  return data.accessToken;
};
