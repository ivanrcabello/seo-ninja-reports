
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';

// Mock types for the Supabase integration
interface User {
  id: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock authentication provider (replace with actual Supabase code later)
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Mock session check - replace with actual Supabase
        const storedUser = localStorage.getItem('seo-ninja-user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Sign in user
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Mock sign in - replace with actual Supabase
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, any email/password combo works
      const mockUser = { id: crypto.randomUUID(), email };
      localStorage.setItem('seo-ninja-user', JSON.stringify(mockUser));
      setUser(mockUser);
      toast.success('Signed in successfully');
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error('Failed to sign in');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign up user
  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Mock sign up - replace with actual Supabase
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, any email/password combo works
      const mockUser = { id: crypto.randomUUID(), email };
      localStorage.setItem('seo-ninja-user', JSON.stringify(mockUser));
      setUser(mockUser);
      toast.success('Account created successfully');
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error('Failed to create account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out user
  const signOut = async () => {
    try {
      setLoading(true);
      // Mock sign out - replace with actual Supabase
      localStorage.removeItem('seo-ninja-user');
      setUser(null);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    signIn,
    signUp,
    signOut,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
