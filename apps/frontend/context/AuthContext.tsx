"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserProfile = {
  id: string;
  email: string;
  username: string;
  rating?: { id: string; rating: number }[];
  gameMember?: { id: string; status: string; gameId: string }[];
};

interface AuthContextType {
  token: string | null;
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const HTTP_BASE_URL = process.env.NEXT_PUBLIC_HTTP_URL || "http://localhost:4000";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("matiks_token");
    if (savedToken) {
      setToken(savedToken);
      fetchUser(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async (authToken: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${HTTP_BASE_URL}/api/v1/auth/me`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await res.json();
      if (res.ok && data.data?.user) {
        setUser(data.data.user);
      } else {
        // If fetch me failed, we still maintain token if present or fallback
        if (!user && data.data?.user) {
          setUser(data.data.user);
        }
      }
    } catch (err) {
      console.error("Failed to fetch user context", err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${HTTP_BASE_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || "Login failed" };
      }

      const jwtToken = data.data?.token;
      if (jwtToken) {
        localStorage.setItem("matiks_token", jwtToken);
        setToken(jwtToken);
        await fetchUser(jwtToken);
        return { success: true, message: data.message };
      }

      return { success: false, message: "No token returned" };
    } catch (err: any) {
      return { success: false, message: err.message || "Network error during login" };
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const res = await fetch(`${HTTP_BASE_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || "Registration failed" };
      }

      return { success: true, message: data.message || "Registration successful! Please login." };
    } catch (err: any) {
      return { success: false, message: err.message || "Network error during registration" };
    }
  };

  const logout = () => {
    localStorage.removeItem("matiks_token");
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (token) {
      await fetchUser(token);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
