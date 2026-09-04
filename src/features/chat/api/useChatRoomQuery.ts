import { useQuery } from "@tanstack/react-query";

import { getChatRoom } from "@/features/chat/api/chatApi";
import { chatQueryKeys } from "@/features/chat/api/chatQueryKeys";

export const useChatRoomQuery = (roomId?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: chatQueryKeys.room(roomId),
    queryFn: () => getChatRoom(roomId!),
    enabled: enabled && Boolean(roomId),
  });
};
