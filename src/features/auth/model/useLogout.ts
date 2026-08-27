// features/auth/model/useLogout.ts

import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { authStorage } from "@/shared/auth/authStorage";

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logout = async () => {
    try {
      await logout();
    } finally {
      authStorage.clear();

      queryClient.removeQueries();

      navigate("/login", {
        replace: true,
      });
    }
  };

  return logout;
};
