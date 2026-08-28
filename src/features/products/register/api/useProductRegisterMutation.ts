import { useMutation } from "@tanstack/react-query";

import { productRegister } from "@/features/products/register/api/productRegisterApi";

export const useProductRegisterMutation = () => {
  return useMutation({ mutationFn: productRegister });
};
