import { createContext, useState, useContext, useEffect } from "react";
import authService from "../api/authService";

// Create context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user on initial render if token exists
  useEffect(() => {
    async function loadUser() {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (err) {
          console.error("Failed to load user:", err);
          authService.logout();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  // Register a new user
  const register = async (userData) => {
    try {
      setError(null);
      const result = await authService.register(userData);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setError(null);
      const result = await authService.login(credentials);

      // Get user details after successful login
      const userData = await authService.getCurrentUser();
      setUser(userData);

      return result;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
