import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

// Admin & Brand use sessionStorage  → auto-logout when browser/tab closes
// Customer uses localStorage        → stays logged in across sessions
function getStorage(role) {
  if (role === "admin" || role === "brand") return sessionStorage;
  return localStorage;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    try {
      // Check sessionStorage first (admin/brand), then localStorage (customer)
      const fromSession = sessionStorage.getItem("user");
      const fromLocal   = localStorage.getItem("user");
      const raw = fromSession || fromLocal;

      if (raw) {
        const parsed = JSON.parse(raw);
        // Safety: if a customer was in localStorage, keep them there.
        // If an admin/brand was somehow in localStorage (old data), move them to sessionStorage.
        if ((parsed.role === "admin" || parsed.role === "brand") && fromLocal && !fromSession) {
          sessionStorage.setItem("user", raw);
          localStorage.removeItem("user");
        }
        setUser(parsed);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Auth load failed:", err);
      setUser(null);
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    const storage = getStorage(userData.role);
    // Clear both storages first to avoid stale data
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    storage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);