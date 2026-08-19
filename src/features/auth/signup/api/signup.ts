import http from "@/shared/api/httpClient";

type DuplicateCheckResponse = {
  available: boolean;
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
