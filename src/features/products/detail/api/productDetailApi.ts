import { http } from "@/shared/api/httpClient";

export type ProductDetailResponse = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  sellerNickname: string;
  saleType: "AUCTION" | "DIRECT";
  auctionStatus: "BEFORE_START" | "IN_PROGRESS" | "ENDED";
  remainingSeconds: number;
  isSeller: boolean;
};

export const getProductDetail = async (productId: string | number) => {
  const { data } = await http.get<ProductDetailResponse>(`/api/products/${productId}`);

  return data;
};
