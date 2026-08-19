import { useMutation } from "@tanstack/react-query";

import { checkEmailDuplicate } from "./signup";

export const useCheckEmailMutation = () => {
  return useMutation({
    mutationFn: checkEmailDuplicate,
  });
};
