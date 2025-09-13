import { supabase } from '../lib/supabase';
import { EncryptionService } from '../lib/encryption';

export interface SignupData {
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface OTPVerificationData {
  verificationId: string;
  code: string;
}

export interface UserProfile {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin' | 'moderator';
  avatarUrl?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export class AuthService {
  /**
   * Sign up user with OTP verification
   */
  static async signup(data: SignupData): Promise<{
    success: boolean;
    verificationId?: string;
    otpCode?: string;
    error?: string;
  }> {
    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone
          }
        }
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        return { success: false, error: 'Failed to create user account' };
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          email: data.email,
          phone: data.phone,
          first_name: data.firstName,
          last_name: data.lastName,
          encrypted_data: {
            phone: data.phone ? EncryptionService.encrypt(data.phone) : null
          }
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        return { success: false, error: 'Failed to create user profile' };
      }

      // Generate OTP for email verification
      const { data: otpData, error: otpError } = await supabase
        .rpc('create_otp_verification', {
          p_user_id: authData.user.id,
          p_email: data.email,
          p_phone: data.phone,
          p_type: 'email_signup'
        });

      if (otpError || !otpData.success) {
        console.error('OTP generation error:', otpError);
        return { success: false, error: otpData?.error || 'Failed to generate verification code' };
      }

      return {
        success: true,
        verificationId: otpData.verification_id,
        otpCode: otpData.code // In production, this would be sent via email/SMS
      };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'An unexpected error occurred during signup' };
    }
  }

  /**
   * Verify OTP code
   */
  static async verifyOTP(data: OTPVerificationData): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const { data: verificationData, error } = await supabase
        .rpc('verify_otp_code', {
          p_verification_id: data.verificationId,
          p_code: data.code
        });

      if (error) {
        console.error('OTP verification error:', error);
        return { success: false, error: 'Verification failed' };
      }

      return {
        success: verificationData.success,
        error: verificationData.error
      };
    } catch (error) {
      console.error('OTP verification error:', error);
      return { success: false, error: 'An unexpected error occurred during verification' };
    }
  }

  /**
   * Sign in user
   */
  static async signin(data: LoginData): Promise<{
    success: boolean;
    user?: UserProfile;
    error?: string;
  }> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (authError) {
        // Log failed login attempt
        await supabase.from('audit_logs').insert({
          action: 'login_failed',
          resource: 'auth',
          details: { email: data.email, error: authError.message },
          success: false
        });
        
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        return { success: false, error: 'Login failed' };
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile) {
        console.error('Profile fetch error:', profileError);
        return { success: false, error: 'Failed to load user profile' };
      }

      // Create session
      const sessionResult = await supabase.rpc('create_user_session', {
        p_user_id: authData.user.id,
        p_device_info: { userAgent: navigator.userAgent },
        p_user_agent: navigator.userAgent
      });

      // Log successful login
      await supabase.from('audit_logs').insert({
        user_id: authData.user.id,
        action: 'login_success',
        resource: 'auth',
        details: { email: data.email },
        success: true
      });

      return {
        success: true,
        user: {
          id: profile.id,
          email: profile.email,
          phone: profile.phone,
          firstName: profile.first_name,
          lastName: profile.last_name,
          role: profile.role,
          avatarUrl: profile.avatar_url,
          emailVerified: profile.email_verified,
          phoneVerified: profile.phone_verified,
          lastLogin: profile.last_login,
          createdAt: profile.created_at,
          updatedAt: profile.updated_at
        }
      };
    } catch (error) {
      console.error('Signin error:', error);
      return { success: false, error: 'An unexpected error occurred during signin' };
    }
  }

  /**
   * Sign out user
   */
  static async signout(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Signout error:', error);
      return { success: false, error: 'An unexpected error occurred during signout' };
    }
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<{
    success: boolean;
    user?: UserProfile;
    error?: string;
  }> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        return { success: false, error: 'Not authenticated' };
      }

      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        return { success: false, error: 'Failed to load user profile' };
      }

      return {
        success: true,
        user: {
          id: profile.id,
          email: profile.email,
          phone: profile.phone,
          firstName: profile.first_name,
          lastName: profile.last_name,
          role: profile.role,
          avatarUrl: profile.avatar_url,
          emailVerified: profile.email_verified,
          phoneVerified: profile.phone_verified,
          lastLogin: profile.last_login,
          createdAt: profile.created_at,
          updatedAt: profile.updated_at
        }
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return { success: false, error: 'Failed to get current user' };
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(updates: Partial<UserProfile>): Promise<{
    success: boolean;
    user?: UserProfile;
    error?: string;
  }> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        return { success: false, error: 'Not authenticated' };
      }

      const updateData: any = {};
      
      if (updates.firstName) updateData.first_name = updates.firstName;
      if (updates.lastName) updateData.last_name = updates.lastName;
      if (updates.phone) {
        updateData.phone = updates.phone;
        updateData.encrypted_data = {
          phone: EncryptionService.encrypt(updates.phone)
        };
      }
      if (updates.avatarUrl) updateData.avatar_url = updates.avatarUrl;

      const { data: profile, error: updateError } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) {
        console.error('Profile update error:', updateError);
        return { success: false, error: 'Failed to update profile' };
      }

      // Log profile update
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'profile_updated',
        resource: 'user_profiles',
        details: { updated_fields: Object.keys(updateData) },
        success: true
      });

      return {
        success: true,
        user: {
          id: profile.id,
          email: profile.email,
          phone: profile.phone,
          firstName: profile.first_name,
          lastName: profile.last_name,
          role: profile.role,
          avatarUrl: profile.avatar_url,
          emailVerified: profile.email_verified,
          phoneVerified: profile.phone_verified,
          lastLogin: profile.last_login,
          createdAt: profile.created_at,
          updatedAt: profile.updated_at
        }
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'An unexpected error occurred while updating profile' };
    }
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(email: string): Promise<{
    success: boolean;
    verificationId?: string;
    otpCode?: string;
    error?: string;
  }> {
    try {
      // Get user by email
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (profileError || !profile) {
        return { success: false, error: 'User not found' };
      }

      // Generate OTP for password reset
      const { data: otpData, error: otpError } = await supabase
        .rpc('create_otp_verification', {
          p_user_id: profile.id,
          p_email: email,
          p_type: 'password_reset'
        });

      if (otpError || !otpData.success) {
        return { success: false, error: otpData?.error || 'Failed to generate reset code' };
      }

      return {
        success: true,
        verificationId: otpData.verification_id,
        otpCode: otpData.code
      };
    } catch (error) {
      console.error('Password reset request error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Reset password with OTP
   */
  static async resetPassword(
    verificationId: string,
    otpCode: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Verify OTP first
      const verificationResult = await this.verifyOTP({
        verificationId,
        code: otpCode
      });

      if (!verificationResult.success) {
        return verificationResult;
      }

      // Update password in Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: 'An unexpected error occurred while resetting password' };
    }
  }

  /**
   * Delete user account
   */
  static async deleteAccount(): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        return { success: false, error: 'Not authenticated' };
      }

      // Log account deletion
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'account_deleted',
        resource: 'user_profiles',
        details: { email: user.email },
        success: true
      });

      // Delete user profile (cascade will handle related data)
      const { error: deleteError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', user.id);

      if (deleteError) {
        console.error('Profile deletion error:', deleteError);
        return { success: false, error: 'Failed to delete account' };
      }

      // Sign out user
      await supabase.auth.signOut();

      return { success: true };
    } catch (error) {
      console.error('Account deletion error:', error);
      return { success: false, error: 'An unexpected error occurred while deleting account' };
    }
  }

  /**
   * Get user sessions
   */
  static async getUserSessions(): Promise<{
    success: boolean;
    sessions?: any[];
    error?: string;
  }> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        return { success: false, error: 'Not authenticated' };
      }

      const { data: sessions, error: sessionsError } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (sessionsError) {
        return { success: false, error: 'Failed to load sessions' };
      }

      return { success: true, sessions: sessions || [] };
    } catch (error) {
      console.error('Get sessions error:', error);
      return { success: false, error: 'Failed to load sessions' };
    }
  }

  /**
   * Revoke session
   */
  static async revokeSession(sessionId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        return { success: false, error: 'Not authenticated' };
      }

      const { error: deleteError } = await supabase
        .from('user_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (deleteError) {
        return { success: false, error: 'Failed to revoke session' };
      }

      // Log session revocation
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'session_revoked',
        resource: 'user_sessions',
        details: { session_id: sessionId },
        success: true
      });

      return { success: true };
    } catch (error) {
      console.error('Revoke session error:', error);
      return { success: false, error: 'Failed to revoke session' };
    }
  }
}