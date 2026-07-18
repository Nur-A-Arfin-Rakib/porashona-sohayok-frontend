"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Cookies from "js-cookie";
import api from "@/lib/api";
import { User } from "@/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, studyClass: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        setLoading(false);
        return;
      }
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch {
      Cookies.remove("token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = (token: string, userData: User) => {
    Cookies.set("token", token, { expires: 7 });
    setUser(userData);
  };

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    persist(data.token, data.user);
  };

  const register = async (name: string, email: string, password: string, studyClass: string) => {
    const { data } = await api.post("/auth/register", { name, email, password, studyClass });
    persist(data.token, data.user);
  };

  const demoLogin = async () => {
    const { data } = await api.post("/auth/demo-login");
    persist(data.token, data.user);
  };

  const googleLogin = async (idToken: string) => {
    const { data } = await api.post("/auth/google", { idToken });
    persist(data.token, data.user);
  };

  const logout = async () => {
    await api.post("/auth/logout").catch(() => {});
    Cookies.remove("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, demoLogin, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth অবশ্যই AuthProvider এর ভেতরে ব্যবহার করতে হবে");
  return ctx;
}
