import { http } from "msw";

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

export const signUp = async (formData: SignUpRequest) => {
  const { data } = await http.post("/user/signup", formData);

  return data;
};
