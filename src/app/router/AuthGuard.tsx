// app/router/guards/AuthGuard.tsx

import { Navigate, Outlet } from "react-router";

import { useAuth } from "@/app/providers/auth/useAuth";

type AuthGuardProps = {
  mode: "protected" | "guest";
};

const AuthGuard = ({ mode }: AuthGuardProps) => {
  const { status } = useAuth();

  if (status === "initializing") {
    return <div>Loading...</div>;
  }

  if (mode === "protected" && status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  if (mode === "guest" && status === "authenticated") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
