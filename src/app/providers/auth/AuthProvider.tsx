import { type ReactNode, useEffect, useState } from "react";

import { AuthContext, type AuthStatus } from "@/app/providers/auth/AuthContext";
import { clearToken, initializeAuth } from "@/features/auth/model/initializeAuth";
// import { authEvents } from "@/shared/auth/authEvents";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<AuthStatus>("initializing");

  useEffect(() => {
    const initialize = async () => {
      const isAuthenticated = await initializeAuth();
      console.log("??", isAuthenticated);

      setStatus(isAuthenticated ? "authenticated" : "unauthenticated");
    };

    initialize();

    // const unsubscribe =
    //   authEvents.subscribeUnauthorized(() => {
    //     setStatus("unauthenticated");
    //   });

    // return unsubscribe;
  }, []);

  const setAuthenticated = () => {
    setStatus("authenticated");
  };

  const logout = async () => {
    try {
      await logout();
    } catch {
      // 필요하다면 로그
    } finally {
      clearToken();

      setStatus("unauthenticated");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        status,
        setAuthenticated,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
