import { useMutation } from "@tanstack/react-query";

import { checkNicknameDuplicate } from "./signupApi";

export const useCheckNicknameMutation = () => {
  return useMutation({
    mutationFn: checkNicknameDuplicate,
  });
};
