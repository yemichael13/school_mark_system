import React, { createContext, useContext, useMemo, useState } from "react";
import api, { setAuthToken } from "./api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }){
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const login = async ({ email, password, role }) => {
    const res = await api.post("/auth/login", { email, password, role });
    const token = res.data?.token;
    const userInfo = res.data?.user || null;
    setAuthToken(token);
    setUser(userInfo);
    localStorage.setItem("user", JSON.stringify(userInfo));
    return { token, user: userInfo };
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(){
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}


