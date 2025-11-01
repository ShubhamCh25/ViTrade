import React, { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const signup = async (form) => {
    const res = await api.post("/auth/signup", form);
    const { user: u, token: t } = res.data;
    localStorage.setItem("user", JSON.stringify(u));
    localStorage.setItem("token", t);
    setUser(u);
    setToken(t);
    return res.data;
  };

  const login = async (username, password) => {
    const res = await api.post("/auth/login", { username, password });
    const { user, token } = res.data;
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    setUser(user);
    setToken(token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
