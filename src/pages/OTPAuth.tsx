import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const OTPAuth = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username || '';

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      // Navigate to workspace
      navigate('/workspace');
    }, 1500);
  };

  const handleResendOTP = () => {
    setResendTimer(30);
    setCanResend(false);
    // Simulate resend API call
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      backgroundImage: 'linear-gradient(to bottom right, rgba(248, 250, 252, 0.3), rgba(219, 234, 254, 0.3), rgba(199, 210, 254, 0.3)), url(/lovable-uploads/d46396b4-e874-4b0a-a6ca-8a0d8a14c135.png)',
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
                className="h-10"
              />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Login</h1>
            <p className="text-gray-600">Authenticate Your Login</p>
          </CardHeader>
          <CardContent className="pb-8">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
                  OTP
                </Label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP sent to your email"
                  className="w-full text-center tracking-widest"
                  maxLength={6}
                  required
                />
              </div>
              
              <Button
                type="submit"
                size="lg"
                className="w-full mt-6"
                disabled={loading || !otp}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Authenticating...
                  </div>
                ) : (
                  'Login'
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleResendOTP}
                disabled={!canResend}
                className="w-full mt-3"
              >
                {canResend ? 'Resend OTP' : `Resend OTP in ${resendTimer}s`}
              </Button>
              
              <div className="text-center mt-4">
                <Link
                  to="/login"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OTPAuth;