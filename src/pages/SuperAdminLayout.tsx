import React, { useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import SuperAdminSidebar from '../components/SuperAdminSidebar';
import SuperAdminDashboard from '../components/SuperAdminDashboard';
import Tenants from '../components/Tenants';
import AddTenantWizard from '../components/AddTenantWizard';
import TenantUsersGroups from '../components/TenantUsersGroups';
import SuperAdminReportsAnalytics from '../components/SuperAdminReportsAnalytics';

const SuperAdminLayout = () => {
  const [sidebarOpen] = useState(true);
  const location = useLocation();

  // Check if user is authenticated as super admin
  const isSuperAdminAuthenticated = sessionStorage.getItem('userRole') === 'super-admin';

  if (!isSuperAdminAuthenticated) {
    return <Navigate to="/super-admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center px-6 z-50">
        <div className="flex items-center space-x-4">
          <img 
            src="/lovable-uploads/c24bf7a8-2cc8-4ae6-9497-8bc1716e1451.png" 
            alt="MaxxLogix Logo"
            className="h-8"
          />
          <div className="border-l border-gray-300 h-6"></div>
          <h1 className="text-lg font-semibold text-gray-900">Super Admin Portal</h1>
        </div>
      </div>

      <div className="flex flex-1 pt-14">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-60 bg-white border-r border-gray-200 flex-shrink-0 fixed left-0 top-14 bottom-0 overflow-y-auto">
            <SuperAdminSidebar />
          </div>
        )}
        
        {/* Main Content */}
        <main className={`flex-1 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden ${
          sidebarOpen ? 'ml-60' : ''
        }`}>
          <div className="h-full overflow-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/super-admin/dashboard" replace />} />
              <Route path="/dashboard" element={<SuperAdminDashboard />} />
              <Route path="/tenants" element={<Tenants />} />
              <Route path="/tenants/add" element={<AddTenantWizard />} />
              <Route path="/tenants/:tenantId/users-groups" element={<TenantUsersGroups />} />
              <Route path="/reports" element={<SuperAdminReportsAnalytics />} />
              <Route path="/audits" element={<div className="p-6"><h1 className="text-2xl font-semibold">Audits (Coming Soon)</h1></div>} />
            </Routes>
          </div>
          
          {/* Global Footer */}
          <div className="fixed bottom-0 right-0 py-2 px-4 z-40">
            <div className="text-sm text-muted-foreground">Powered by MaxxLogix™</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
