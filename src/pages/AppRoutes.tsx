import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import SuperAdminLogin from './SuperAdminLogin';
import SuperAdminOTPAuth from './SuperAdminOTPAuth';
import SuperAdminLayout from './SuperAdminLayout';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Super Admin Routes */}
      <Route path="/super-admin/login" element={<SuperAdminLogin />} />
      <Route path="/super-admin/otp-auth" element={<SuperAdminOTPAuth />} />
      <Route path="/super-admin/*" element={<SuperAdminLayout />} />
      
      {/* Redirect any unknown routes to landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
