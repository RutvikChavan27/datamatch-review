
import React from 'react';
import { useParams } from 'react-router-dom';
import PurchaseOrderDetailView from './PurchaseOrderDetailView';

const PurchaseOrderDetail = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Purchase Order Not Found</h2>
          <p className="text-gray-600">No purchase order ID provided.</p>
        </div>
      </div>
    );
  }

  return <PurchaseOrderDetailView />;
};

export default PurchaseOrderDetail;
