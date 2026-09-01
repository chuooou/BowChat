import { publicHttp } from "@/shared/api/httpClient";

type LoginRequest = {
  email: string;
  password: string;
  autoLogin: boolean;
};

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresIn: number;
  userInfo: object;
};

export const login = async (requestData: LoginRequest) => {
  const { data } = await publicHttp.post<LoginResponse>("/auth/login", requestData);

  return data;
};
