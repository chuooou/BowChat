import { createContext, type ReactNode, useEffect, useState } from "react";

import { initializeAuth } from "@/features/auth/model/initializeAuth";

type AuthStatus = "initializing" | "authenticated" | "unauthenticated";

export const AuthContext = createContext<AuthStatus>("initializing");

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<AuthStatus>("initializing");

  useEffect(() => {
    const initialize = async () => {
      const isAuthenticated = await initializeAuth();

      setStatus(isAuthenticated ? "authenticated" : "unauthenticated");
    };

    initialize();
  }, []);

  if (status === "initializing") {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={status}>{children}</AuthContext.Provider>;
};
