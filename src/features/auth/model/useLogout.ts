import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { logout } from "@/features/auth/api/authApi";
import { authStorage } from "@/shared/auth/authStorage";

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      authStorage.clear();

      queryClient.removeQueries();

      navigate("/", {
        replace: true,
      });
    }
  };

  return handleLogout;
};
