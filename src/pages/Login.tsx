import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Eye, EyeOff, Loader2, Mail, Phone, ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const otpSchema = z.object({
  code: z.string().length(6, 'OTP code must be 6 digits')
});

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
});

const newPasswordSchema = z.object({
  code: z.string().length(6, 'OTP code must be 6 digits'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Login = () => {
  const { login, register, verifyOTP, requestPasswordReset, resetPassword, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [step, setStep] = useState<'form' | 'otp' | 'reset-request' | 'reset-otp'>('form');
  const [verificationId, setVerificationId] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>(''); // For demo purposes
  const [resetEmail, setResetEmail] = useState<string>('');

  const from = location.state?.from?.pathname || '/';

  // Form hooks
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { 
      email: '', 
      password: '', 
      confirmPassword: '', 
      firstName: '', 
      lastName: '', 
      phone: '' 
    }
  });

  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: '' }
  });

  const resetForm = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: '' }
  });

  const newPasswordForm = useForm({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { code: '', newPassword: '', confirmPassword: '' }
  });

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    const result = await login(data.email, data.password);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      toast({
        title: "Login Failed",
        description: result.error || 'Login failed',
        variant: "destructive"
      });
    }
  };

  const handleRegister = async (data: z.infer<typeof registerSchema>) => {
    const result = await register(
      data.email,
      data.password,
      data.firstName,
      data.lastName,
      data.phone
    );
    
    if (result.success) {
      setVerificationId(result.verificationId || '');
      setOtpCode(result.otpCode || ''); // For demo - in production this would be sent via email/SMS
      setStep('otp');
      toast({
        title: "Account Created",
        description: "Please verify your email with the OTP code."
      });
    } else {
      toast({
        title: "Registration Failed",
        description: result.error || 'Registration failed',
        variant: "destructive"
      });
    }
  };

  const handleOTPVerification = async (data: z.infer<typeof otpSchema>) => {
    const result = await verifyOTP(verificationId, data.code);
    
    if (result.success) {
      setStep('form');
      setActiveTab('login');
      toast({
        title: "Email Verified",
        description: "You can now sign in."
      });
    } else {
      toast({
        title: "Verification Failed",
        description: result.error || 'Invalid OTP code',
        variant: "destructive"
      });
    }
  };

  const handlePasswordResetRequest = async (data: z.infer<typeof resetPasswordSchema>) => {
    const result = await requestPasswordReset(data.email);
    
    if (result.success) {
      setVerificationId(result.verificationId || '');
      setOtpCode(result.otpCode || '');
      setResetEmail(data.email);
      setStep('reset-otp');
      toast({
        title: "Reset Code Sent",
        description: "Check your email for the reset code."
      });
    } else {
      toast({
        title: "Reset Failed",
        description: result.error || 'Failed to send reset code',
        variant: "destructive"
      });
    }
  };

  const handlePasswordReset = async (data: z.infer<typeof newPasswordSchema>) => {
    const result = await resetPassword(verificationId, data.code, data.newPassword);
    
    if (result.success) {
      setStep('form');
      setActiveTab('login');
      toast({
        title: "Password Reset",
        description: "You can now sign in with your new password."
      });
    } else {
      toast({
        title: "Reset Failed",
        description: result.error || 'Failed to reset password',
        variant: "destructive"
      });
    }
  };

  const resetToForm = () => {
    setStep('form');
    setVerificationId('');
    setOtpCode('');
    setResetEmail('');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <img src="/logo.svg" alt="Logo" className="h-12 mx-auto mb-4" />
          </Link>
          <h1 className="text-2xl font-bold">Welcome to ShopMart</h1>
          <p className="text-muted-foreground">
            {step === 'otp' ? 'Verify your email address' :
             step === 'reset-request' ? 'Reset your password' :
             step === 'reset-otp' ? 'Enter reset code' :
             'Sign in to your account or create a new one'}
          </p>
        </div>

        <Card>
          {step === 'otp' && (
            <>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={resetToForm}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <CardTitle>Verify Email</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    We've sent a 6-digit verification code to your email address.
                  </p>
                  {otpCode && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">Demo OTP Code: {otpCode}</p>
                      <p className="text-xs text-muted-foreground">In production, this would be sent via email</p>
                    </div>
                  )}
                </div>
                
                <form onSubmit={otpForm.handleSubmit(handleOTPVerification)} className="space-y-4">
                  <div>
                    <Label htmlFor="otp-code">Verification Code</Label>
                    <Input
                      id="otp-code"
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      {...otpForm.register('code')}
                      className="text-center text-lg tracking-widest"
                    />
                    {otpForm.formState.errors.code && (
                      <p className="text-sm text-destructive mt-1">
                        {otpForm.formState.errors.code.message}
                      </p>
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify Email'
                    )}
                  </Button>
                </form>
              </CardContent>
            </>
          )}

          {step === 'reset-request' && (
            <>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={resetToForm}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <CardTitle>Reset Password</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={resetForm.handleSubmit(handlePasswordResetRequest)} className="space-y-4">
                  <div>
                    <Label htmlFor="reset-email">Email Address</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="Enter your email"
                      {...resetForm.register('email')}
                    />
                    {resetForm.formState.errors.email && (
                      <p className="text-sm text-destructive mt-1">
                        {resetForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Reset Code'
                    )}
                  </Button>
                </form>
              </CardContent>
            </>
          )}

          {step === 'reset-otp' && (
            <>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => setStep('reset-request')}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <CardTitle>Enter New Password</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground">
                    Enter the verification code sent to {resetEmail}
                  </p>
                  {otpCode && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">Demo OTP Code: {otpCode}</p>
                    </div>
                  )}
                </div>
                
                <form onSubmit={newPasswordForm.handleSubmit(handlePasswordReset)} className="space-y-4">
                  <div>
                    <Label htmlFor="reset-code">Verification Code</Label>
                    <Input
                      id="reset-code"
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      {...newPasswordForm.register('code')}
                      className="text-center text-lg tracking-widest"
                    />
                    {newPasswordForm.formState.errors.code && (
                      <p className="text-sm text-destructive mt-1">
                        {newPasswordForm.formState.errors.code.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      {...newPasswordForm.register('newPassword')}
                    />
                    {newPasswordForm.formState.errors.newPassword && (
                      <p className="text-sm text-destructive mt-1">
                        {newPasswordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                    <Input
                      id="confirm-new-password"
                      type="password"
                      {...newPasswordForm.register('confirmPassword')}
                    />
                    {newPasswordForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive mt-1">
                        {newPasswordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </Button>
                </form>
              </CardContent>
            </>
          )}

          {step === 'form' && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <CardHeader>
                  <CardTitle>Sign In</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                    <div>
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="admin@shopmart.com"
                        {...loginForm.register('email')}
                      />
                      {loginForm.formState.errors.email && (
                        <p className="text-sm text-destructive mt-1">
                          {loginForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          {...loginForm.register('password')}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {loginForm.formState.errors.password && (
                        <p className="text-sm text-destructive mt-1">
                          {loginForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </form>
                  
                  <div className="mt-4 text-center">
                    <Button 
                      variant="link" 
                      onClick={() => setStep('reset-request')}
                      className="text-sm"
                    >
                      Forgot your password?
                    </Button>
                  </div>
                  
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-2">Demo Account:</p>
                    <p className="text-xs text-muted-foreground">
                      Email: admin@shopmart.com<br />
                      Password: admin123
                    </p>
                  </div>
                </CardContent>
              </TabsContent>

              <TabsContent value="register">
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="register-firstName">First Name</Label>
                        <Input
                          id="register-firstName"
                          {...registerForm.register('firstName')}
                        />
                        {registerForm.formState.errors.firstName && (
                          <p className="text-sm text-destructive mt-1">
                            {registerForm.formState.errors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="register-lastName">Last Name</Label>
                        <Input
                          id="register-lastName"
                          {...registerForm.register('lastName')}
                        />
                        {registerForm.formState.errors.lastName && (
                          <p className="text-sm text-destructive mt-1">
                            {registerForm.formState.errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        {...registerForm.register('email')}
                      />
                      {registerForm.formState.errors.email && (
                        <p className="text-sm text-destructive mt-1">
                          {registerForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="register-phone">Phone (Optional)</Label>
                      <Input
                        id="register-phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        {...registerForm.register('phone')}
                      />
                      {registerForm.formState.errors.phone && (
                        <p className="text-sm text-destructive mt-1">
                          {registerForm.formState.errors.phone.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        {...registerForm.register('password')}
                      />
                      {registerForm.formState.errors.password && (
                        <p className="text-sm text-destructive mt-1">
                          {registerForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="register-confirmPassword">Confirm Password</Label>
                      <Input
                        id="register-confirmPassword"
                        type="password"
                        {...registerForm.register('confirmPassword')}
                      />
                      {registerForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-destructive mt-1">
                          {registerForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </TabsContent>
            </Tabs>
          )}
        </Card>

        <div className="text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;