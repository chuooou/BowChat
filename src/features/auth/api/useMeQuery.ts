import { useQuery } from "@tanstack/react-query";

import { getMe } from "./authApi";

type UseMeQueryParams = {
  enabled?: boolean;
};

export const AUTH_ME_QUERY_KEY = ["auth", "me"] as const;

export const useMeQuery = ({ enabled = true }: UseMeQueryParams = {}) => {
  return useQuery({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: getMe,
    enabled,
    retry: false,
  });
};
