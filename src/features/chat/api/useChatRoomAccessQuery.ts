import { useQuery } from "@tanstack/react-query";

import { getChatRoomAccess } from "@/features/chat/api/chatApi";
import { chatQueryKeys } from "@/features/chat/api/chatQueryKeys";

export const useChatRoomAccessQuery = (roomId?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: chatQueryKeys.access(roomId),
    queryFn: () => getChatRoomAccess(roomId!),
    enabled: enabled && Boolean(roomId),
  });
};
