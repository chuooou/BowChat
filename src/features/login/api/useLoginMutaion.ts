import { useMutation } from "@tanstack/react-query";

import { login } from "@/features/login/api/loginApi";

export const useLoginMutaion = () => {
  return useMutation({ mutationFn: login });
};
