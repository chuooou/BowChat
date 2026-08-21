import { publicHttp } from "@/shared/api/httpClient";

type RefreshResponse = {
  accessToken: string;
  refreshToken?: string;
  refreshTokenExpiresIn?: number;
};

export const refreshAccessToken = async (refreshToken: string) => {
  const { data } = await publicHttp.post<RefreshResponse>("/auth/refresh", refreshToken);

  return data;
};
