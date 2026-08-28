import { http } from "@/shared/api/httpClient";

type ProductRegisterRequest = {
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  saleType: "AUCTION" | "DIRECT";
};

export const productRegister = async (requestData: ProductRegisterRequest) => {
  const { data } = await http.post("/api/products", requestData);

  return data;
};
