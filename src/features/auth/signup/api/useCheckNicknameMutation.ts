import { useMutation } from "@tanstack/react-query";

import { checkNicknameDuplicate } from "./signup";

export const useCheckNicknameMutation = () => {
  return useMutation({
    mutationFn: checkNicknameDuplicate,
  });
};
