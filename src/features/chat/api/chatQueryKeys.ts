export const chatQueryKeys = {
  all: ["chat"] as const,
  rooms: () => [...chatQueryKeys.all, "rooms"] as const,
  room: (roomId?: string) => [...chatQueryKeys.rooms(), roomId] as const,
  access: (roomId?: string) => [...chatQueryKeys.room(roomId), "access"] as const,
  messages: (roomId?: string) => [...chatQueryKeys.room(roomId), "messages"] as const,
};
