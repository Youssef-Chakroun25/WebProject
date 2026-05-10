import { createContext, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(() => {
    const rawUser = localStorage.getItem("user");
    return rawUser ? JSON.parse(rawUser) : null;
  });
  const [authError, setAuthError] = useState("");

  const persistSession = (nextUser, nextToken) => {
    localStorage.setItem("token", nextToken);
    localStorage.setItem("user", JSON.stringify(nextUser));
    setToken(nextToken);
    setCurrentUser(nextUser);
  };

  const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setCurrentUser(null);
  };

  const register = async (payload) => {
    setAuthError("");
    const { data } = await client.post("/register", payload);
    persistSession(data.user, data.token);
    navigate("/notes", { replace: true });
  };

  const login = async (payload) => {
    setAuthError("");
    const { data } = await client.post("/login", payload);
    persistSession(data.user, data.token);
    navigate("/notes", { replace: true });
  };

  const logout = async () => {
    try {
      await client.post("/logout");
    } finally {
      clearSession();
      navigate("/login", { replace: true });
    }
  };

  const value = useMemo(
    () => ({
      token,
      currentUser,
      authError,
      setAuthError,
      register,
      login,
      logout
    }),
    [token, currentUser, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
