import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import type { ChatMessagesResponse } from "@/features/chat/api/chatApi";
import { chatQueryKeys } from "@/features/chat/api/chatQueryKeys";
import type {
  BiddingRoomSocketMessage,
  ChatRoomResponse,
  PlaceBidMessage,
} from "@/features/chat/model/socketTypes";

type UseBiddingRoomSocketParams = {
  roomId: string;
  enabled: boolean;
};

export const useBiddingRoomSocket = ({ roomId, enabled }: UseBiddingRoomSocketParams) => {
  const queryClient = useQueryClient();

  const socketRef = useRef<WebSocket | null>(null);
  const pendingRequestIdRef = useRef<string | null>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [isBidPending, setIsBidPending] = useState(false);

  useEffect(() => {
    if (!enabled || !roomId) {
      return;
    }

    const socket = new WebSocket(`${import.meta.env.VITE_WS_BASE_URL}/ws/chat/${roomId}`);

    socketRef.current = socket;

    const handleOpen = () => {
      setIsConnected(true);
    };

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data) as BiddingRoomSocketMessage;

        switch (data.type) {
          case "BID_PLACED": {
            const isMyBid = data.requestId === pendingRequestIdRef.current;

            queryClient.setQueryData<ChatRoomResponse>(chatQueryKeys.room(roomId), (prev) => {
              if (!prev) return prev;

              return {
                ...prev,

                auction: {
                  ...prev.auction,

                  highestBid: data.highestBid,
                  highestBidder: data.highestBidder,
                  isHighestBidder: isMyBid,
                },
              };
            });

            queryClient.setQueryData<ChatMessagesResponse>(
              chatQueryKeys.messages(roomId),
              (prev) => {
                if (!prev) return prev;

                return {
                  ...prev,

                  messages: [...prev.messages, data.message],
                };
              },
            );

            if (isMyBid) {
              pendingRequestIdRef.current = null;
              setIsBidPending(false);
            }

            break;
          }

          case "BID_REJECTED": {
            if (data.requestId === pendingRequestIdRef.current) {
              pendingRequestIdRef.current = null;
              setIsBidPending(false);
            }

            toast.error(data.reason);

            break;
          }
        }
      } catch (error) {
        console.error("WebSocket 메시지를 처리하지 못했습니다.", error);
      }
    };

    const handleClose = () => {
      setIsConnected(false);
      socketRef.current = null;
    };

    const handleError = (error: Event) => {
      console.error("WebSocket 에러", error);
      setIsConnected(false);
    };

    socket.addEventListener("open", handleOpen);
    socket.addEventListener("message", handleMessage);
    socket.addEventListener("close", handleClose);
    socket.addEventListener("error", handleError);

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [enabled, roomId, queryClient]);

  const sendBid = useCallback(
    (amount: number) => {
      const socket = socketRef.current;

      if (!socket || socket.readyState !== WebSocket.OPEN) {
        toast.error("실시간 연결을 확인해주세요.");
        return false;
      }

      if (pendingRequestIdRef.current) {
        return false;
      }

      const requestId = crypto.randomUUID();

      const message: PlaceBidMessage = {
        type: "PLACE_BID",
        requestId,
        roomId,
        amount,
      };

      pendingRequestIdRef.current = requestId;
      setIsBidPending(true);

      socket.send(JSON.stringify(message));

      return true;
    },
    [roomId],
  );

  return {
    isConnected,
    isBidPending,
    sendBid,
  };
};
