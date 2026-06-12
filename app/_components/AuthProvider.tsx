"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "@/app/_lib/api";
import { User } from "@/app/_lib/types";

export const AuthContext = createContext<
  | {
      user: User | null;
      loading: boolean;
      setUser: (user: User | null) => void;
      refresh: () => Promise<void>;
      logout: () => Promise<void>;
    }
  | undefined
>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await authApi.me();
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const refresh = async () => {
    try {
      const data = await authApi.me();
      setUser(data);
    } catch {
      setUser(null);
    }
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
