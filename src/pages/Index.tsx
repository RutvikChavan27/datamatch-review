
import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import MatchingQueue from '../components/MatchingQueue';
import ManualReviewDetail from '../components/ManualReviewDetail';
import InvoicesList from '../components/InvoicesList';
import PurchaseOrdersList from '../components/PurchaseOrdersList';
import GoodsReceiptNotesList from '../components/GoodsReceiptNotesList';
import PORequestsList from '../components/PORequestsList';
import InvoiceDetail from '../components/InvoiceDetail';
import PurchaseOrderDetail from '../components/PurchaseOrderDetail';
import GoodsReceiptNoteDetail from '../components/GoodsReceiptNoteDetail';
import PORequestDetail from '../components/PORequestDetail';
import Dashboard from '../components/Dashboard';
import NotFound from './NotFound';
import { useClientModules } from '../hooks/useClientModules';
import PORequestDashboard from './po-request/PORequestDashboard';
import CreatePO from './po-request/CreatePO';
import PODetails from './po-request/PODetails';
import Confirmation from './po-request/Confirmation';
import DocumentPreviewPage from "../components/DocumentPreviewPage";
import WorkflowsList from '../components/WorkflowsList';
import ReportsAnalytics from '../components/ReportsAnalytics';
import Workspace from '../components/Workspace';

import WorkspaceTaskDocumentView from '../components/WorkspaceTaskDocumentView';
import Storage from '../components/Storage';
import Settings from '../components/Settings';


// Helper hook to determine if we need full width (no padding)
function useFullWidth() {
  const location = useLocation();
  const path = location.pathname;
  // Full width for document preview pages
  return path.includes('/preview');
}

const Index = () => {
  const { enabledModules, loading } = useClientModules();
  const fullWidth = useFullWidth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopBar onMenuToggle={handleMenuToggle} />
      
      <div className="flex flex-1 overflow-hidden pt-14">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-60 bg-white border-r border-gray-200 z-40 flex-shrink-0 transition-all duration-300">
            <Sidebar enabledModules={enabledModules} />
          </div>
        )}
        
        <main className={`flex-1 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden ${
          !fullWidth ? "px-4" : ""
        } flex flex-col`}>
          <div className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<MatchingQueue />} />
              <Route path="/matching" element={<MatchingQueue />} />
              <Route path="/matching/sets/:setId" element={<ManualReviewDetail />} />
              <Route path="/matching/sets/:setId/preview" element={<DocumentPreviewPage />} />
              <Route path="/documents/invoices" element={<InvoicesList />} />
              <Route path="/documents/invoices/:id" element={<InvoiceDetail />} />
              <Route path="/documents/purchase-orders" element={<PurchaseOrdersList />} />
              <Route path="/documents/purchase-orders/:id" element={<PurchaseOrderDetail />} />
              <Route path="/documents/goods-receipt-notes" element={<GoodsReceiptNotesList />} />
              <Route path="/documents/goods-receipt-notes/:id" element={<GoodsReceiptNoteDetail />} />
              <Route path="/documents/po-requests" element={<PORequestsList />} />
              <Route path="/documents/po-requests/:id" element={<PORequestDetail />} />
              {/* PO Request Module Routes */}
              <Route path="/po-requests" element={<PORequestDashboard />} />
              <Route path="/po-requests/create" element={<CreatePO />} />
              <Route path="/po-requests/po/:id" element={<PODetails />} />
              <Route path="/po-requests/confirm" element={<Confirmation />} />
              <Route path="/workflows" element={<WorkflowsList />} />
              <Route path="/reports" element={<ReportsAnalytics />} />
              <Route path="/workspace" element={<Workspace />} />
              <Route path="/workspace/task/:taskId" element={<WorkspaceTaskDocumentView />} />
              <Route path="/storage" element={<Storage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          
          {/* Global Footer - Fixed at bottom */}
          <div className={`fixed bottom-0 right-0 py-2 px-4 z-40 transition-all duration-300 ${
            sidebarOpen ? "left-60" : "left-0"
          }`}>
            <div className="text-sm text-muted-foreground">Powered by MaxxLogix™</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
