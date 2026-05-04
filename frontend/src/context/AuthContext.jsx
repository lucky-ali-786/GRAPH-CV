import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (local storage)
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('saas_suite_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        // Verify with backend
        await getCurrentUser();
      } else {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const getCurrentUser = async () => {
    try {
      const response = await fetch('http://localhost:8000/users/api/v1/getcurrentuser', {
        credentials: 'include'
      });
      const result = await response.json();
      
      if (response.ok && result.data) {
        setUser(result.data);
        localStorage.setItem('saas_suite_user', JSON.stringify(result.data));
      } else {
        // If unauthorized or error, clear session
        logout();
      }
    } catch (error) {
      console.error("Auth sync failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8000/users/api/v1/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important for cookies
        body: JSON.stringify({ email, password }),
      });
      
      const result = await response.json();
      
      if (response.ok && result.data && result.data.user) {
        const userData = result.data.user;
        setUser(userData);
        localStorage.setItem('saas_suite_user', JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, message: result.message || 'Login failed' };
      }
    } catch (error) {
      return { success: false, message: 'Server unreachable. Ensure backend is running on localhost:8000' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:8000/users/api/v1/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, message: result.message || 'Registration failed' };
      }
    } catch (error) {
      return { success: false, message: 'Server unreachable. Ensure backend is running on localhost:8000' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('saas_suite_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
