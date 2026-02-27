import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { Eye, EyeOff, TrendingUp } from 'lucide-react';

interface LoginProps {
  onLogin: (user: any) => void;
}

// Mock user data
const DEMO_USER = {
  email: 'demo@stratify.com',
  password: 'password123',
  profile: {
    name: 'Alex Johnson',
    email: 'demo@stratify.com',
    avatar: 'AJ',
    accountType: 'Pro',
    joinDate: '2024-01-15',
    totalStrategies: 8,
    activeStrategies: 3,
    portfolioValue: 125847,
    totalReturn: 28.5,
    riskTolerance: 'Medium',
    tradingExperience: 'Advanced',
    preferredTimeframes: ['1h', '4h', '1d'],
    brokerConnections: ['Interactive Brokers', 'Alpaca'],
    notifications: {
      trades: true,
      alerts: true,
      educational: false,
      marketing: false
    }
  }
};

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-fill demo credentials for convenience
  useEffect(() => {
    setEmail('demo@stratify.com');
    setPassword('password123');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      // Save login state
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userProfile', JSON.stringify(DEMO_USER.profile));
      
      toast.success('Welcome to Stratify! Login successful.');
      onLogin(DEMO_USER.profile);
    } else {
      toast.error('Invalid credentials. Please use demo@stratify.com / password123');
    }
    
    setIsLoading(false);
  };

  const startDemo = async () => {
    setIsLoading(true);
    
    // Simulate brief loading
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Save demo mode state
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userProfile', JSON.stringify({
      ...DEMO_USER.profile,
      name: 'Demo User',
      email: 'demo.user@stratify.com'
    }));
    
    toast.success('Welcome to Stratify Demo! Explore all features.');
    onLogin({
      ...DEMO_USER.profile,
      name: 'Demo User',
      email: 'demo.user@stratify.com'
    });
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl text-gray-900">Stratify</h1>
          </div>
          <p className="text-gray-600">Your AI-Powered Trading Platform</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your trading strategies and analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={startDemo}
                disabled={isLoading}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Start Demo (No Login Required)
              </Button>

              {/* Demo Credentials Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><strong>Email:</strong> demo@stratify.com</p>
                  <p><strong>Password:</strong> password123</p>
                </div>
                <p className="text-xs text-blue-600 mt-2">Or click "Start Demo" to explore without credentials</p>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-600">
          <p>© 2024 Stratify. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}