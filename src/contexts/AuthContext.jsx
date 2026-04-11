import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // 🔥 LOAD USER SAFELY ON APP START
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Auth load failed:", err);
      setUser(null);
      localStorage.removeItem("user");
    } finally {
      // ⭐ MOST IMPORTANT LINE
      setAuthLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        authLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
