import { useQuery } from "@tanstack/react-query";

import { getChatMessages } from "@/features/chat/api/chatApi";
import { chatQueryKeys } from "@/features/chat/api/chatQueryKeys";

export const useChatMessagesQuery = (roomId?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: chatQueryKeys.messages(roomId),
    queryFn: () => getChatMessages(roomId!),
    enabled: enabled && Boolean(roomId),
  });
};
