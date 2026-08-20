import { useMutation } from "@tanstack/react-query";

import { signUp } from "@/features/signup/api/signupApi";

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: signUp,
  });
};
