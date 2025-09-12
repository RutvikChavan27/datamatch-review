import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !password || !confirmPassword) return;
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pl-8 md:pl-16" style={{
      backgroundImage: 'url(/lovable-uploads/6f96d7c5-807b-44ca-89c7-1c7492ab35bc.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      <div className="w-[30%] ml-auto mr-16 min-w-[440px]">
        <Card className="bg-white shadow-2xl border-2 border-white rounded-3xl relative overflow-hidden py-8" style={{
          backgroundImage: `url(/lovable-uploads/840626b0-2ee3-4c74-be74-32f412aad530.png)`,
          backgroundOrigin: 'border-box',
          backgroundPosition: 'right -64px top -64px',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'calc(100% + 128px) auto'
        }}>
          <CardHeader className="text-left pb-8 pt-12 px-10">
            <div className="flex items-center justify-between mb-6">
              <img 
                src="/lovable-uploads/b67a7bdb-02a4-404b-b798-78b25e423e97.png" 
                alt="Company Logo"
                className="w-16 h-16 md:w-20 md:h-20 object-contain"
              />
              <img 
                src="/lovable-uploads/c24bf7a8-2cc8-4ae6-9497-8bc1716e1451.png" 
                alt="MaxxLogix Logo"
                className="h-8"
              />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-600">Please confirm your email and create a new password.</p>
          </CardHeader>
          <CardContent className="pb-12 px-10">
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
                  Enter OTP received on your Email
                </Label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full"
                  placeholder="Please enter your OTP"
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
                    placeholder="Please enter your new Password"
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
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pr-10"
                    placeholder="Please confirm your new Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <Button
                type="submit"
                size="lg"
                className="w-full mt-6"
                disabled={loading || !otp || !password || !confirmPassword}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'RESET PASSWORD'
                )}
              </Button>
              
              <div className="text-center mt-4">
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
        
        {/* Subtitle */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-900 pt-6">AI Productivity Platform | Powered by MaxxLogix</p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;