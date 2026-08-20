import { useMutation } from "@tanstack/react-query";

import { checkEmailDuplicate } from "./signupApi";

export const useCheckEmailMutation = () => {
  return useMutation({
    mutationFn: checkEmailDuplicate,
  });
};
