import { http } from "@/shared/api/httpClient";

type ChatRoomResponse = {
  roomId: number;
  roomType: "DIRECT" | "GROUP" | "AUCTION";
  roomName: string;
};

export type ChatRoomAccessResponse = {
  canEnter: boolean;
};

export type ChatRoomDetailResponse = {
  roomId: number;
  roomType: "AUCTION";
  roomName: string;
  product: {
    productId: number;
    name: string;
    imageUrl: string;
    endAt: string;
  };
  auction: {
    highestBid: number;
    highestBidder: string;
    participantCount: number;
    myRank: number;
    isHighestBidder: boolean;
  };
  messages: {
    id: string;
    senderId: number;
    senderName: string;
    amount: number;
    messageType: "AUCTION_BID";
    createdAt: string;
  }[];
};

export type ChatMessagesResponse = {
  messages: {
    id: string;
    roomId: number;
    senderId: number;
    senderName: string;
    content: string;
    messageType: "AUCTION_BID";
    createDate: string;
  }[];
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

export const getChatRoomAccess = async (roomId: string) => {
  const { data } = await http.get<ChatRoomAccessResponse>(`/api/chat/rooms/${roomId}/access`);

  return data;
};

export const getChatRoom = async (roomId: string) => {
  const { data } = await http.get<ChatRoomDetailResponse>(`/api/chat/rooms/${roomId}`);

  return data;
};

export const getChatMessages = async (roomId: string) => {
  const { data } = await http.get<ChatMessagesResponse>(`/api/chat/messages/${roomId}`);

  return data;
};
