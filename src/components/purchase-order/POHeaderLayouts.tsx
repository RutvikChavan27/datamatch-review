import { PurchaseOrder } from "@/types/purchase-order";
import { Building2 } from "lucide-react";

interface HeaderLayoutProps {
  purchaseOrder: PurchaseOrder;
  layout: "classic" | "centered" | "modern";
}

export const POHeaderLayouts = ({ purchaseOrder, layout }: HeaderLayoutProps) => {
  const LogoPlaceholder = () => (
    <div className="flex items-center">
      <div className="w-[120px] h-[120px] bg-gray-200 rounded flex items-center justify-center">
        <Building2 className="w-12 h-12 text-gray-500" />
      </div>
    </div>
  );

  const ClientInfo = () => (
    <div className="text-sm space-y-1 text-document-text print:text-gray-700">
      <p className="font-semibold text-document-header print:text-black">{purchaseOrder.clientName}</p>
      <p>{purchaseOrder.clientAddress}</p>
      <p>{purchaseOrder.clientCity}, {purchaseOrder.clientState} {purchaseOrder.clientZip}</p>
      <p>{purchaseOrder.clientEmail}</p>
      <p className="text-primary print:text-blue-600">{purchaseOrder.clientWebsite}</p>
    </div>
  );

  const PODetails = () => (
    <div className="text-left">
      <p className="text-lg font-bold text-document-header print:text-black">PO# {purchaseOrder.poNumber}</p>
      <p className="text-sm text-document-text print:text-gray-700">Issue Date: {purchaseOrder.issueDate}</p>
      <p className="text-sm text-document-text print:text-gray-700">Delivery Date: {purchaseOrder.deliveryDate}</p>
    </div>
  );

  if (layout === "classic") {
    return (
      <div className="mb-8 pb-4 border-b-2 border-primary print:border-black">
        <div className="flex justify-between items-start mb-4">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-document-header print:text-black mb-2">PURCHASE ORDER</h1>
            <PODetails />
          </div>
          <LogoPlaceholder />
        </div>
      </div>
    );
  }

  if (layout === "centered") {
    return (
      <div className="mb-8 pb-4 border-b-2 border-primary print:border-black text-center">
        <div className="flex justify-center mb-4">
          <LogoPlaceholder />
        </div>
        <h1 className="text-3xl font-bold text-document-header print:text-black mb-4">PURCHASE ORDER</h1>
        <PODetails />
      </div>
    );
  }

  // Modern layout
  return (
    <div className="mb-8 pb-6 border-b border-primary/20 print:border-gray-300">
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 print:bg-gray-50 -mx-8 -mt-8 mb-6 p-6 rounded-b-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <LogoPlaceholder />
            <div>
              <h1 className="text-2xl font-bold text-document-header print:text-black">PURCHASE ORDER</h1>
              <p className="text-primary print:text-blue-600 font-medium">#{purchaseOrder.poNumber}</p>
            </div>
          </div>
          <div className="text-right text-sm">
            <p className="text-document-text print:text-gray-700">Issue: {purchaseOrder.issueDate}</p>
            <p className="text-document-text print:text-gray-700">Delivery: {purchaseOrder.deliveryDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};