import { createContext } from "react";

export type AuthStatus = "initializing" | "authenticated" | "unauthenticated";

export type AuthContextValue = {
  status: AuthStatus;
  setAuthenticated: () => void;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
