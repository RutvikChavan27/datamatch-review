import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGetOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      navigate('/otp-auth', { state: { username } });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      backgroundImage: 'linear-gradient(to bottom right, hsl(var(--primary) / 0.1), hsl(var(--primary) / 0.2), hsl(var(--background) / 0.3)), url(/lovable-uploads/876af0c6-75c3-4f4e-923e-5d0b0009f3fe.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      <div className="w-full max-w-md">
        <Card className="bg-white shadow-2xl border-0 rounded-2xl">
          <CardHeader className="text-left pb-6 pt-8">
            <div className="flex items-center justify-start mb-6">
              <img 
                src="/lovable-uploads/c24bf7a8-2cc8-4ae6-9497-8bc1716e1451.png" 
                alt="MaxxLogix Logo"
                className="h-16"
              />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Login</h1>
            <p className="text-gray-600">Welcome back! Log in to continue.</p>
          </CardHeader>
          <CardContent className="pb-8">
            <form onSubmit={handleGetOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <Button
                type="submit"
                size="lg"
                className="w-full mt-6"
                disabled={loading || !username || !password}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Get OTP'
                )}
              </Button>
              
              <div className="text-center mt-4">
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Forgot Password?
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      
      {/* Footer */}
      <div className="fixed bottom-0 left-0 py-2 px-4 z-40">
        <div className="text-sm text-muted-foreground">Powered by MaxxLogix™</div>
      </div>
    </div>
  );
};

export default Login;