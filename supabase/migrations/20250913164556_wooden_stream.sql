/*
  # Complete Authentication System with OTP and Encryption

  1. New Tables
    - `user_profiles` - Extended user profile data
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `phone` (text, unique, optional)
      - `first_name` (text)
      - `last_name` (text)
      - `role` (text, default 'user')
      - `avatar_url` (text, optional)
      - `email_verified` (boolean, default false)
      - `phone_verified` (boolean, default false)
      - `encrypted_data` (jsonb, for sensitive data)
      - `last_login` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `otp_verifications` - OTP verification codes
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `email` (text, optional)
      - `phone` (text, optional)
      - `code_hash` (text, encrypted OTP code)
      - `type` (text, 'email_signup', 'phone_signup', 'password_reset', 'login_verification')
      - `expires_at` (timestamp)
      - `verified` (boolean, default false)
      - `attempts` (integer, default 0)
      - `max_attempts` (integer, default 3)
      - `created_at` (timestamp)
    
    - `user_sessions` - Active user sessions
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `session_token` (text, encrypted)
      - `device_info` (jsonb)
      - `ip_address` (inet)
      - `user_agent` (text)
      - `expires_at` (timestamp)
      - `last_activity` (timestamp)
      - `created_at` (timestamp)
    
    - `audit_logs` - Security audit trail
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key, optional)
      - `action` (text)
      - `resource` (text)
      - `details` (jsonb)
      - `ip_address` (inet)
      - `user_agent` (text)
      - `success` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add comprehensive security policies
    - Implement rate limiting for OTP requests
    - Add encryption functions for sensitive data

  3. Functions
    - Generate and send OTP codes
    - Verify OTP codes with rate limiting
    - Clean expired sessions and OTP codes
    - Audit logging functions
    - Encryption/decryption utilities
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  phone text UNIQUE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  avatar_url text,
  email_verified boolean DEFAULT false,
  phone_verified boolean DEFAULT false,
  encrypted_data jsonb DEFAULT '{}',
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- OTP verifications table
CREATE TABLE IF NOT EXISTS otp_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  phone text,
  code_hash text NOT NULL,
  type text NOT NULL CHECK (type IN ('email_signup', 'phone_signup', 'password_reset', 'login_verification')),
  expires_at timestamptz NOT NULL,
  verified boolean DEFAULT false,
  attempts integer DEFAULT 0,
  max_attempts integer DEFAULT 3,
  created_at timestamptz DEFAULT now()
);

-- User sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token text NOT NULL,
  device_info jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  expires_at timestamptz NOT NULL,
  last_activity timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  resource text NOT NULL,
  details jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  success boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Rate limiting table for OTP requests
CREATE TABLE IF NOT EXISTS rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL, -- email or phone
  action text NOT NULL, -- 'otp_request', 'login_attempt'
  attempts integer DEFAULT 1,
  window_start timestamptz DEFAULT now(),
  blocked_until timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(identifier, action)
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can read all profiles" ON user_profiles
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- OTP verifications policies
CREATE POLICY "Users can read own OTP codes" ON otp_verifications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert OTP codes" ON otp_verifications
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own OTP codes" ON otp_verifications
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- User sessions policies
CREATE POLICY "Users can read own sessions" ON user_sessions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own sessions" ON user_sessions
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own sessions" ON user_sessions
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own sessions" ON user_sessions
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- Audit logs policies
CREATE POLICY "Users can read own audit logs" ON audit_logs
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all audit logs" ON audit_logs
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Anyone can insert audit logs" ON audit_logs
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Rate limits policies
CREATE POLICY "Anyone can read rate limits" ON rate_limits
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert rate limits" ON rate_limits
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update rate limits" ON rate_limits
  FOR UPDATE TO anon, authenticated
  USING (true);

-- Utility functions
CREATE OR REPLACE FUNCTION generate_otp_code()
RETURNS text AS $$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 1000000)::text, 6, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION hash_otp_code(code text)
RETURNS text AS $$
BEGIN
  RETURN crypt(code, gen_salt('bf', 10));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION verify_otp_code(code text, hash text)
RETURNS boolean AS $$
BEGIN
  RETURN crypt(code, hash) = hash;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check rate limits
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_identifier text,
  p_action text,
  p_max_attempts integer DEFAULT 5,
  p_window_minutes integer DEFAULT 15
)
RETURNS boolean AS $$
DECLARE
  current_attempts integer;
  window_start timestamptz;
BEGIN
  -- Clean up old rate limit records
  DELETE FROM rate_limits 
  WHERE window_start < now() - interval '1 hour';
  
  -- Get current attempts for this identifier and action
  SELECT attempts, rate_limits.window_start 
  INTO current_attempts, window_start
  FROM rate_limits 
  WHERE identifier = p_identifier 
    AND action = p_action 
    AND window_start > now() - (p_window_minutes || ' minutes')::interval;
  
  -- If no record exists, create one
  IF current_attempts IS NULL THEN
    INSERT INTO rate_limits (identifier, action, attempts, window_start)
    VALUES (p_identifier, p_action, 1, now())
    ON CONFLICT (identifier, action) 
    DO UPDATE SET 
      attempts = 1, 
      window_start = now(),
      blocked_until = NULL;
    RETURN true;
  END IF;
  
  -- Check if blocked
  IF current_attempts >= p_max_attempts THEN
    -- Update blocked_until if not already set
    UPDATE rate_limits 
    SET blocked_until = now() + (p_window_minutes || ' minutes')::interval
    WHERE identifier = p_identifier AND action = p_action;
    RETURN false;
  END IF;
  
  -- Increment attempts
  UPDATE rate_limits 
  SET attempts = attempts + 1
  WHERE identifier = p_identifier AND action = p_action;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create OTP verification
CREATE OR REPLACE FUNCTION create_otp_verification(
  p_user_id uuid,
  p_email text DEFAULT NULL,
  p_phone text DEFAULT NULL,
  p_type text DEFAULT 'email_signup'
)
RETURNS jsonb AS $$
DECLARE
  otp_code text;
  code_hash text;
  verification_id uuid;
  identifier text;
BEGIN
  -- Determine identifier for rate limiting
  identifier := COALESCE(p_email, p_phone);
  
  -- Check rate limit
  IF NOT check_rate_limit(identifier, 'otp_request', 5, 15) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Too many OTP requests. Please try again later.'
    );
  END IF;
  
  -- Generate OTP code
  otp_code := generate_otp_code();
  code_hash := hash_otp_code(otp_code);
  
  -- Invalidate existing OTP codes for this user and type
  UPDATE otp_verifications 
  SET verified = true 
  WHERE user_id = p_user_id AND type = p_type AND verified = false;
  
  -- Insert new OTP verification
  INSERT INTO otp_verifications (
    user_id, email, phone, code_hash, type, expires_at
  ) VALUES (
    p_user_id, p_email, p_phone, code_hash, p_type, now() + interval '10 minutes'
  ) RETURNING id INTO verification_id;
  
  -- Log the action
  INSERT INTO audit_logs (user_id, action, resource, details)
  VALUES (p_user_id, 'otp_generated', 'otp_verifications', 
    jsonb_build_object('type', p_type, 'verification_id', verification_id));
  
  RETURN jsonb_build_object(
    'success', true,
    'verification_id', verification_id,
    'code', otp_code, -- In production, this would be sent via SMS/Email
    'expires_at', now() + interval '10 minutes'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify OTP code
CREATE OR REPLACE FUNCTION verify_otp_code(
  p_verification_id uuid,
  p_code text
)
RETURNS jsonb AS $$
DECLARE
  verification_record record;
  is_valid boolean;
BEGIN
  -- Get verification record
  SELECT * INTO verification_record
  FROM otp_verifications
  WHERE id = p_verification_id AND verified = false;
  
  -- Check if verification exists and not expired
  IF verification_record IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid or expired verification code'
    );
  END IF;
  
  -- Check if expired
  IF verification_record.expires_at < now() THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Verification code has expired'
    );
  END IF;
  
  -- Check attempts limit
  IF verification_record.attempts >= verification_record.max_attempts THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Maximum verification attempts exceeded'
    );
  END IF;
  
  -- Verify the code
  is_valid := verify_otp_code(p_code, verification_record.code_hash);
  
  -- Update attempts
  UPDATE otp_verifications 
  SET attempts = attempts + 1
  WHERE id = p_verification_id;
  
  IF is_valid THEN
    -- Mark as verified
    UPDATE otp_verifications 
    SET verified = true
    WHERE id = p_verification_id;
    
    -- Update user verification status
    IF verification_record.type = 'email_signup' THEN
      UPDATE user_profiles 
      SET email_verified = true, updated_at = now()
      WHERE id = verification_record.user_id;
    ELSIF verification_record.type = 'phone_signup' THEN
      UPDATE user_profiles 
      SET phone_verified = true, updated_at = now()
      WHERE id = verification_record.user_id;
    END IF;
    
    -- Log successful verification
    INSERT INTO audit_logs (user_id, action, resource, details, success)
    VALUES (verification_record.user_id, 'otp_verified', 'otp_verifications', 
      jsonb_build_object('type', verification_record.type), true);
    
    RETURN jsonb_build_object(
      'success', true,
      'message', 'Verification successful'
    );
  ELSE
    -- Log failed verification
    INSERT INTO audit_logs (user_id, action, resource, details, success)
    VALUES (verification_record.user_id, 'otp_verification_failed', 'otp_verifications', 
      jsonb_build_object('type', verification_record.type, 'attempts', verification_record.attempts + 1), false);
    
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid verification code'
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create user session
CREATE OR REPLACE FUNCTION create_user_session(
  p_user_id uuid,
  p_device_info jsonb DEFAULT '{}',
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
  session_token text;
  session_id uuid;
BEGIN
  -- Generate secure session token
  session_token := encode(gen_random_bytes(32), 'base64');
  
  -- Clean up old sessions for this user (keep only last 5)
  DELETE FROM user_sessions 
  WHERE user_id = p_user_id 
    AND id NOT IN (
      SELECT id FROM user_sessions 
      WHERE user_id = p_user_id 
      ORDER BY created_at DESC 
      LIMIT 5
    );
  
  -- Create new session
  INSERT INTO user_sessions (
    user_id, session_token, device_info, ip_address, user_agent, expires_at
  ) VALUES (
    p_user_id, crypt(session_token, gen_salt('bf')), p_device_info, 
    p_ip_address, p_user_agent, now() + interval '30 days'
  ) RETURNING id INTO session_id;
  
  -- Update last login
  UPDATE user_profiles 
  SET last_login = now(), updated_at = now()
  WHERE id = p_user_id;
  
  -- Log session creation
  INSERT INTO audit_logs (user_id, action, resource, details)
  VALUES (p_user_id, 'session_created', 'user_sessions', 
    jsonb_build_object('session_id', session_id));
  
  RETURN jsonb_build_object(
    'success', true,
    'session_id', session_id,
    'session_token', session_token,
    'expires_at', now() + interval '30 days'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cleanup expired data
CREATE OR REPLACE FUNCTION cleanup_expired_data()
RETURNS void AS $$
BEGIN
  -- Clean expired OTP codes
  DELETE FROM otp_verifications WHERE expires_at < now();
  
  -- Clean expired sessions
  DELETE FROM user_sessions WHERE expires_at < now();
  
  -- Clean old audit logs (keep last 90 days)
  DELETE FROM audit_logs WHERE created_at < now() - interval '90 days';
  
  -- Clean old rate limits
  DELETE FROM rate_limits WHERE window_start < now() - interval '1 hour';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to encrypt sensitive data
CREATE OR REPLACE FUNCTION encrypt_data(data text, key text DEFAULT 'default_encryption_key')
RETURNS text AS $$
BEGIN
  RETURN encode(encrypt(data::bytea, key::bytea, 'aes'), 'base64');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrypt sensitive data
CREATE OR REPLACE FUNCTION decrypt_data(encrypted_data text, key text DEFAULT 'default_encryption_key')
RETURNS text AS $$
BEGIN
  RETURN convert_from(decrypt(decode(encrypted_data, 'base64'), key::bytea, 'aes'), 'UTF8');
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_phone ON user_profiles(phone);
CREATE INDEX IF NOT EXISTS idx_otp_verifications_user_id ON otp_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_otp_verifications_expires_at ON otp_verifications(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON rate_limits(identifier, action);

-- Insert admin user
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Check if admin user already exists
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@shopmart.com';
  
  IF admin_user_id IS NULL THEN
    -- Create admin user in auth.users (this would normally be done through Supabase Auth)
    INSERT INTO auth.users (
      id, email, encrypted_password, email_confirmed_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(),
      'admin@shopmart.com',
      crypt('admin123', gen_salt('bf')),
      now(),
      now(),
      now()
    ) RETURNING id INTO admin_user_id;
  END IF;
  
  -- Create admin profile
  INSERT INTO user_profiles (
    id, email, first_name, last_name, role, email_verified
  ) VALUES (
    admin_user_id, 'admin@shopmart.com', 'Admin', 'User', 'admin', true
  ) ON CONFLICT (id) DO NOTHING;
END $$;