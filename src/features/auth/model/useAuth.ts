import { useMeQuery } from "@/features/auth/api/useMeQuery";
import { authStorage } from "@/shared/auth/authStorage";

export const useAuth = () => {
  const hasStoredToken = authStorage.hasStoredToken();

  const {
    data: user,
    isPending,
    isError,
  } = useMeQuery({
    enabled: hasStoredToken,
  });

  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading: hasStoredToken && isPending,
    isError,
    hasStoredToken,
  };
};
