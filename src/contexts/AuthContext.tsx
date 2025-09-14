import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService, UserProfile } from '../services/authService';
import { supabase } from '../lib/supabase';
import { toast } from '../components/ui/use-toast';

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, firstName: string, lastName: string, phone?: string) => Promise<{ success: boolean; verificationId?: string; otpCode?: string; error?: string }>;
  verifyOTP: (verificationId: string, code: string) => Promise<{ success: boolean; error?: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; verificationId?: string; otpCode?: string; error?: string }>;
  resetPassword: (verificationId: string, otpCode: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const result = await AuthService.getCurrentUser();
          if (result.success && result.user) {
            setUser(result.user);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const result = await AuthService.getCurrentUser();
          if (result.success && result.user) {
            setUser(result.user);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      const result = await AuthService.signin({ email, password });
      
      if (result.success && result.user) {
        setUser(result.user);
        toast({
          title: "Welcome back!",
          description: "You have been successfully signed in."
        });
      }
      
      setIsLoading(false);
      return { success: result.success, error: result.error };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const register = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    phone?: string
  ): Promise<{ success: boolean; verificationId?: string; otpCode?: string; error?: string }> => {
    setIsLoading(true);

    try {
      const result = await AuthService.signup({
        email,
        password,
        firstName,
        lastName,
        phone
      });
      
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: 'An unexpected error occurred during registration' };
    }
  };

  const verifyOTP = async (verificationId: string, code: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await AuthService.verifyOTP({ verificationId, code });
      
      if (result.success) {
        toast({
          title: "Verification Successful",
          description: "Your email has been verified."
        });
        // Refresh user data
        const userResult = await AuthService.getCurrentUser();
        if (userResult.success && userResult.user) {
          setUser(userResult.user);
        }
      }
      
      return result;
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred during verification' };
    }
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; verificationId?: string; otpCode?: string; error?: string }> => {
    try {
      return await AuthService.requestPasswordReset(email);
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const resetPassword = async (verificationId: string, otpCode: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await AuthService.resetPassword(verificationId, otpCode, newPassword);
      
      if (result.success) {
        toast({
          title: "Password Reset",
          description: "Your password has been reset successfully."
        });
      }
      
      return result;
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred while resetting password' };
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await AuthService.updateProfile(updates);
      
      if (result.success && result.user) {
        setUser(result.user);
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully."
        });
      }
      
      return { success: result.success, error: result.error };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred while updating profile' };
    }
  };

  const deleteAccount = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await AuthService.deleteAccount();
      
      if (result.success) {
        setUser(null);
        toast({
          title: "Account Deleted",
          description: "Your account has been deleted successfully."
        });
      }
      
      return result;
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred while deleting account' };
    }
  };

  const logout = async () => {
    try {
      await AuthService.signout();
      setUser(null);
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully."
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Error signing out",
        variant: "destructive"
      });
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      verifyOTP,
      requestPasswordReset,
      resetPassword,
      updateProfile,
      deleteAccount,
      logout,
      isLoading,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};