import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiService, setAccessToken } from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if there's a stored token
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          setAccessToken(storedToken);
          try {
            const currentUser = await apiService.getMe();
            setUser(currentUser);
          } catch (error) {
            console.log("Stored token is invalid, trying refresh...");
            // Try to refresh the token
            const refreshResponse = await apiService.refreshToken();
            setAccessToken(refreshResponse.data.accessToken);
            const currentUser = await apiService.getMe();
            setUser(currentUser);
          }
        } else {
          // Try to refresh the token
          const refreshResponse = await apiService.refreshToken();
          setAccessToken(refreshResponse.data.accessToken);
          const currentUser = await apiService.getMe();
          setUser(currentUser);
        }
      } catch (error) {
        console.log("No active session or refresh failed:", error.message);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      console.log('Logging in with credentials:', credentials);
      const response = await apiService.login(credentials);
      console.log('Login response:', response);
      setAccessToken(response.accessToken);
      setUser(response.user);
      return response; // Return both token and user
    } catch (error) {
      console.error('Login failed:', error);
      // Extract error message
      const errorMessage = error.message || error.response?.data?.message || 'Login failed. Please check your credentials.';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      setAccessToken('');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isInitialized,
  };

  if (!isInitialized) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #0a3d3f 0%, #00C853 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>Loading...</div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};