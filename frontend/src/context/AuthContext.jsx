import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check id user is already logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/user");
      const data = await res.json();
    
      if (data.authenticated && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        console.log("✅ User is authenticated:", data.user.username);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        console.log("❌ User not authenticated");
      }
    } catch (err) {
      console.error("Error checking auth:", err);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUser(data.user);
        setIsAuthenticated(true);
        console.log("✅ Login successful:", data.user.username);
        return { success: true, user: data.user };
      } else {
        console.log("❌ Login failed:", data.error);
        return { success: false, error: data.error};
      }
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const logout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok) {
        setUser(null);
        setIsAuthenticated(false);
        console.log("Logout successful");
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error("Logout error:", err);
      return { success: false, error: "Network error" };
    }
  };

  const value = { user, isAuthenticated, loading, login, logout, checkAuth };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}