import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <img 
            src="/lovable-uploads/c24bf7a8-2cc8-4ae6-9497-8bc1716e1451.png" 
            alt="MaxxLogix Logo"
            className="h-8"
          />
        </div>
        
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-lg text-gray-600">Signing out...</span>
        </div>
        
        <div className="text-sm text-gray-400">Please wait while we securely log you out</div>
      </div>
    </div>
  );
};

export default LoadingScreen;