import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, fetchUserAttributes, signOut } from 'aws-amplify/auth';

interface User {
  username?: string;
  userId?: string;
  signInDetails?: any;
  attributes?: Record<string, any>;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  checkAuth: () => Promise<void>;
  refreshUserAttributes: () => Promise<void>;
  logout: (errorMessage?: string | null) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = async (errorMessage: string | null = null) => {
    try {
      // Clear all auth state
      setUser(null);
      setIsAuthenticated(false);

      // Clear sessionStorage
      sessionStorage.clear();

      // Clear localStorage
      localStorage.clear();

      // Sign out from Cognito (commented out for static login)
      // await signOut();

      // Show error message if provided
      if (errorMessage) {
        console.error(errorMessage);
      }

      // Redirect to login page
      window.location.href = '/';
    } catch (err) {
      console.error('Logout error:', err);
      // Force redirect even if signOut fails
      window.location.href = '/';
    }
  };

  const checkAuth = async () => {
    try {
      // Static authentication check
      const isAuth = sessionStorage.getItem('isAuthenticated') === 'true';
      const username = sessionStorage.getItem('username') || '';
      
      if (isAuth && username) {
        const userWithAttributes: User = { 
          username,
          attributes: {
            email: username,
          }
        };
        setUser(userWithAttributes);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }

      /* COGNITO AUTH CHECK - COMMENTED OUT
      const currentUser = await getCurrentUser();
      const userAttributes = await fetchUserAttributes();
      
      const userWithAttributes: User = { 
        ...currentUser, 
        attributes: userAttributes 
      };
      setUser(userWithAttributes);
      setIsAuthenticated(true);
      */
    } catch (err) {
      console.error('Auth check error:', err);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserAttributes = async () => {
    try {
      const userAttributes = await fetchUserAttributes();
      setUser((prev) => ({ ...prev, attributes: userAttributes }));
    } catch (err) {
      console.error('Error refreshing user attributes:', err);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    loading,
    checkAuth,
    refreshUserAttributes,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
