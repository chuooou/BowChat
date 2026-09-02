import { useMutation } from "@tanstack/react-query";

import { chatEnter, type ChatEnterRequest } from "@/features/chat/api/chatApi";

export const useChatEnterMutation = () => {
  return useMutation({
    mutationFn: ({ roomType, productId }: ChatEnterRequest) => chatEnter({ roomType, productId }),
  });
};
