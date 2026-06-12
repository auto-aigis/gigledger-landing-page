"use client";

import { useContext, useState, useEffect, useCallback } from "react";
import { AuthContext } from "@/app/_components/AuthProvider";
import { authApi } from "./api";
import { User } from "./types";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const useRefreshUser = () => {
  const auth = useAuth();
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const user = await authApi.me();
      auth.setUser(user as User);
    } catch (error) {
      auth.setUser(null);
    } finally {
      setLoading(false);
    }
  }, [auth]);

  return { refresh, loading };
};
