import { http, publicHttp } from "@/shared/api/httpClient";

type DuplicateCheckResponse = {
  available: boolean;
};

type SignUpRequest = {
  email: string;
  password: string;
  nickName: string;
};

export const checkEmailDuplicate = async (email: string) => {
  const { data } = await http.get<DuplicateCheckResponse>("/user/check-email", {
    params: { email },
  });

  return data;
};

export const checkNicknameDuplicate = async (nickname: string) => {
  const { data } = await http.get<DuplicateCheckResponse>("/user/check-nickname", {
    params: { nickname },
  });

  return data;
};

export const signUp = async (requestData: SignUpRequest) => {
  const { data } = await publicHttp.post("/user/signup", requestData);

  return data;
};
