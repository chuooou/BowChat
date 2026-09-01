import { useQuery } from "@tanstack/react-query";

import { getProductDetail } from "@/features/products/detail/api/productDetailApi";

export const productDetailQueryKeys = {
  all: ["products"] as const,
  detail: (productId: string | number) =>
    [...productDetailQueryKeys.all, "detail", productId] as const,
};

export const useProductDetailQuery = (productId: string | number, enabled: boolean) => {
  return useQuery({
    queryKey: productDetailQueryKeys.detail(productId),
    queryFn: () => getProductDetail(productId),
    enabled: enabled,
  });
};
