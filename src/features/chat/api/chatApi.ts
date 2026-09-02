import { http } from "@/shared/api/httpClient";

type ChatRoomResponse = {
  roomId: number;
  roomType: "DIRECT" | "GROUP" | "AUCTION";
  roomName: string;
};

export type ChatEnterRequest = {
  roomType: "DIRECT" | "GROUP" | "AUCTION";
  productId: number;
};

export const chatEnter = async ({ roomType, productId }: ChatEnterRequest) => {
  const { data } = await http.post<ChatRoomResponse>("/api/chat/rooms/enter", {
    roomType,
    productId,
  });
  return data;
};
