import { Navigate, Outlet } from "react-router";

import { useAuth } from "@/features/auth/model/useAuth";

type AuthGuardProps = {
  mode: "protected" | "guest";
};

const AuthGuard = ({ mode }: AuthGuardProps) => {
  const { isAuthenticated, isLoading, hasStoredToken } = useAuth();

  if (!hasStoredToken) {
    if (mode === "protected") {
      return <Navigate to="/login" replace />;
    }

    return <Outlet />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (mode === "protected" && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (mode === "guest" && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
