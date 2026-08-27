import { http, publicHttp } from "@/shared/api/httpClient";
import { authStorage } from "@/shared/auth/authStorage";

type RefreshResponse = {
  accessToken: string;
  refreshToken?: string;
  refreshTokenExpiresIn?: number;
};

export type UserInfo = {
  id: number;
  email: string;
  nickname: string;
};

export const refreshAccessToken = async () => {
  const refreshToken = authStorage.getRefreshToken();

  if (!refreshToken || authStorage.isRefreshTokenExpired()) {
    throw new Error("Refresh token is not available");
  }

  const { data } = await publicHttp.post<RefreshResponse>("/auth/refresh", {
    refreshToken,
  });

  authStorage.setAccessToken(data.accessToken);

  if (data.refreshToken && data.refreshTokenExpiresIn) {
    authStorage.setTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      refreshTokenExpiresIn: data.refreshTokenExpiresIn,
    });
  }

  return data.accessToken;
};

export const getMe = async () => {
  const { data } = await http.get<UserInfo>("/auth/me");

  return data;
};

export const logout = async () => {
  const { data } = await http.post("/auth/logout");

  return data;
};
