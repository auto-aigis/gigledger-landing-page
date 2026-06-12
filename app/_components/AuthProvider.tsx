"use client";

import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { authApi } from "@/app/_lib/api";
import { User, Subscription } from "@/app/_lib/types";

export const AuthContext = createContext<
  | {
      user: User | null;
      subscription: Subscription | null;
      loading: boolean;
      setUser: (user: User | null) => void;
      refresh: () => Promise<void>;
      logout: () => Promise<void>;
    }
  | undefined
>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await authApi.me();
        setUser(data);
        // Fetch subscription data
        try {
          const subData = await authApi.getSubscription();
          setSubscription(subData);
        } catch {
          setSubscription(null);
        }
      } catch {
        setUser(null);
        setSubscription(null);
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
      try {
        const subData = await authApi.getSubscription();
        setSubscription(subData);
      } catch {
        setSubscription(null);
      }
    } catch {
      setUser(null);
      setSubscription(null);
    }
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setSubscription(null);
  };

  return (
    <AuthContext.Provider value={{ user, subscription, loading, setUser, refresh, logout }}>

      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}