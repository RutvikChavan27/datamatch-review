import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Building2 } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">MaxxLogix</h1>
          <p className="text-lg text-gray-600">Data Match Review Portal</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Tenant Login Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/login")}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Login as Tenant</CardTitle>
              <CardDescription>Access your tenant dashboard and manage documents</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button className="w-full" size="lg" onClick={(e) => {
                e.stopPropagation();
                navigate("/login");
              }}>
                Tenant Login
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                Manage your workflows, documents, and data matching tasks
              </p>
            </CardContent>
          </Card>

          {/* Super Admin Login Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/super-admin/login")}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-2xl">Login as Super Admin</CardTitle>
              <CardDescription>Administrative access to manage tenants and system</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button className="w-full" size="lg" variant="secondary" onClick={(e) => {
                e.stopPropagation();
                navigate("/super-admin/login");
              }}>
                Super Admin Login
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                Manage tenants, view audits, and configure system settings
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8 text-sm text-gray-500">
          Powered by MaxxLogix™
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
