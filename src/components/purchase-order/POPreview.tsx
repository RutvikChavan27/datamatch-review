import { Card, CardContent } from "@/components/ui/card";
import { PurchaseOrder } from "@/types/purchase-order";
import { POHeaderLayouts } from "./POHeaderLayouts";

interface POPreviewProps {
  purchaseOrder: PurchaseOrder;
  layout: "classic" | "centered" | "modern";
}

export const POPreview = ({ purchaseOrder, layout }: POPreviewProps) => {
  return (
    <div className="space-y-4">
      <Card className="w-full max-w-4xl mx-auto print:shadow-none print:border-0">
        <CardContent className="p-8 print:p-6">
          {/* Header with Layout Options */}
          <POHeaderLayouts purchaseOrder={purchaseOrder} layout={layout} />

          {/* Client, Vendor and Delivery Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-document-header mb-3 pb-1 border-b border-table-border print:text-black print:border-gray-400">Client:</h3>
              <div className="space-y-1 text-sm text-document-text print:text-gray-700">
                <p className="font-bold text-base text-document-header print:text-black">{purchaseOrder.clientName}</p>
                <p>{purchaseOrder.clientAddress}</p>
                <p>{purchaseOrder.clientCity}, {purchaseOrder.clientState} {purchaseOrder.clientZip}</p>
                <p>{purchaseOrder.clientEmail}</p>
                <p className="text-primary print:text-blue-600">{purchaseOrder.clientWebsite}</p>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-document-header mb-3 pb-1 border-b border-table-border print:text-black print:border-gray-400">Vendor:</h3>
              <div className="space-y-1 text-sm text-document-text print:text-gray-700">
                <p className="font-semibold print:text-black">{purchaseOrder.vendorName}</p>
                <p>{purchaseOrder.vendorAddress}</p>
                <p>{purchaseOrder.vendorCity}, {purchaseOrder.vendorState} {purchaseOrder.vendorZip}</p>
                <p>{purchaseOrder.vendorPhone}</p>
                <p>{purchaseOrder.vendorEmail}</p>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-document-header mb-3 pb-1 border-b border-table-border print:text-black print:border-gray-400">Delivery Address:</h3>
              <div className="space-y-1 text-sm text-document-text print:text-gray-700">
                <p className="font-semibold print:text-black">{purchaseOrder.companyName}</p>
                <p>{purchaseOrder.companyAddress}</p>
                <p>{purchaseOrder.companyCity}, {purchaseOrder.companyState} {purchaseOrder.companyZip}</p>
                <p>{purchaseOrder.companyPhone}</p>
                <p>{purchaseOrder.companyEmail}</p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <p className="text-xs text-muted-foreground print:text-gray-600">Payment Terms:</p>
              <p className="text-sm font-medium text-document-text print:text-black">{purchaseOrder.paymentTerms}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground print:text-gray-600">Authorized By:</p>
              <p className="text-sm font-medium text-document-text print:text-black">{purchaseOrder.authorizedBy}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground print:text-gray-600">Department:</p>
              <p className="text-sm font-medium text-document-text print:text-black">{purchaseOrder.department}</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="mb-8">
            <h3 className="font-bold text-document-header mb-4 pb-2 border-b border-table-border print:text-black print:border-gray-400">Items:</h3>
            <div className="border border-table-border rounded-lg overflow-hidden print:border-gray-400 print:rounded-none">
              {/* Table Header */}
              <div className="bg-table-header grid grid-cols-12 gap-4 p-3 font-semibold text-sm text-document-header print:bg-gray-100 print:text-black">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Unit Price</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              
              {/* Table Rows - Show only first 3 items for preview */}
              {purchaseOrder.lineItems.slice(0, 3).map((item, index) => (
                <div key={item.id} className={`grid grid-cols-12 gap-4 p-3 text-sm border-b border-table-border/30 print:border-gray-300 ${index % 2 === 0 ? 'bg-background print:bg-white' : 'bg-document-light print:bg-gray-50'}`}>
                  <div className="col-span-6 text-document-text print:text-black">{item.description}</div>
                  <div className="col-span-2 text-center text-document-text print:text-black">{item.quantity}</div>
                  <div className="col-span-2 text-right text-document-text print:text-black">${item.unitPrice.toFixed(2)}</div>
                  <div className="col-span-2 text-right font-medium text-document-text print:text-black">${item.total.toFixed(2)}</div>
                </div>
              ))}
              
              {/* Show "..." for remaining items */}
              {purchaseOrder.lineItems.length > 3 && (
                <div className="grid grid-cols-12 gap-4 p-3 text-sm border-b border-table-border/30">
                  <div className="col-span-12 text-center text-muted-foreground">
                    ... and {purchaseOrder.lineItems.length - 3} more items
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-document-text print:text-black">Subtotal:</span>
                <span className="font-medium text-document-text print:text-black">${purchaseOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-document-text print:text-black">Tax ({purchaseOrder.taxRate}%):</span>
                <span className="font-medium text-document-text print:text-black">${purchaseOrder.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-document-text print:text-black">Shipping:</span>
                <span className="font-medium text-document-text print:text-black">${purchaseOrder.shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-table-border pt-2 print:border-gray-400">
                <span className="text-document-header print:text-black">Total:</span>
                <span className="text-primary print:text-black">${purchaseOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {purchaseOrder.notes && (
            <div className="mt-8 p-4 bg-document-light border-l-4 border-primary rounded-r print:bg-gray-50 print:border-gray-400 print:rounded-none">
              <h4 className="font-bold text-document-header mb-2 print:text-black">Notes:</h4>
              <p className="text-sm text-document-text whitespace-pre-wrap print:text-black">{purchaseOrder.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-table-border text-center print:border-gray-400">
            <p className="text-xs text-muted-foreground print:text-gray-600">
              {purchaseOrder.clientName} • Purchase Order #{purchaseOrder.poNumber}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};