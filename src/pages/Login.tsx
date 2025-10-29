import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "aws-amplify/auth";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import "@/utils/amplifyConfig";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const handleGetOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setLoading(true);
    setError("");

    try {
      const { isSignedIn, nextStep } = await signIn({
        username,
        password,
        options: {
          authFlowType: "USER_SRP_AUTH",
        },
      });

      if (nextStep?.signInStep === "DONE" && isSignedIn) {
        await checkAuth();
        navigate("/workspace", { replace: true });
        return;
      }

      if (
        nextStep?.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
      ) {
        sessionStorage.setItem("cognitoUser", username);
        navigate("/new-password");
        return;
      }

      if (nextStep?.signInStep === "CONFIRM_SIGN_IN_WITH_EMAIL_CODE") {
        sessionStorage.setItem("cognitoUser", username);
        navigate("/otp-auth", { state: { username } });
        return;
      }

      setError("Unexpected authentication step");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err.name === "NotAuthorizedException"
          ? "Invalid username or password"
          : err.message || "An error occurred during login"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 pl-8 md:pl-16"
      style={{
        backgroundImage:
          "url(/lovable-uploads/6f96d7c5-807b-44ca-89c7-1c7492ab35bc.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-[30%] ml-auto mr-16 min-w-[440px]">
        <Card
          className="bg-white shadow-2xl border-2 border-white rounded-3xl relative overflow-hidden py-8"
          style={{
            backgroundImage: `url(/lovable-uploads/840626b0-2ee3-4c74-be74-32f412aad530.png)`,
            backgroundOrigin: "border-box",
            backgroundPosition: "right -64px top -64px",
            backgroundRepeat: "no-repeat",
            backgroundSize: "calc(100% + 128px) auto",
          }}
        >
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
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Login</h1>
            <p className="text-gray-600">Welcome back! Log in to continue.</p>
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </CardHeader>
          <CardContent className="pb-12 px-10">
            <form onSubmit={handleGetOTP} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-700"
                >
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full"
                  placeholder="Please enter your Username"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pr-10"
                    placeholder="Please enter your Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
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
                  "Get OTP"
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

        {/* Subtitle */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-900 pt-6">
            AI Productivity Platform | Powered by MaxxLogix
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
