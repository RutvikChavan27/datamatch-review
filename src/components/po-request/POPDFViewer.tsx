import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, Printer, FileText } from 'lucide-react';
import { PurchaseOrder } from '@/types/po-types';
import { formatCurrency } from '@/lib/formatters';
import { format } from 'date-fns';

interface POPDFViewerProps {
  po: PurchaseOrder;
  onClose?: () => void;
}

const POPDFViewer: React.FC<POPDFViewerProps> = ({ po, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    const blob = new Blob([generatePDFContent(po)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${po.reference}_approved.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generatePDFContent = (po: PurchaseOrder) => {
    return `
PURCHASE ORDER - ${po.reference}
Status: APPROVED
Generated: ${format(new Date(), 'PPP')}

========================================

VENDOR INFORMATION:
${po.vendor}

REQUESTOR INFORMATION:
Name: ${po.requestor}
Department: ${po.department}

DELIVERY INFORMATION:
Address: ${po.deliveryAddress || 'Not specified'}
Expected Date: ${po.expectedDeliveryDate ? format(po.expectedDeliveryDate, 'PP') : 'Not specified'}

PAYMENT TERMS:
${po.paymentTerms || 'Not specified'}

========================================

LINE ITEMS:
${po.lineItems?.map(item => 
  `${item.itemCode} | ${item.description} | Qty: ${item.quantity} ${item.uom} | Unit: ${formatCurrency(item.unitPrice)} | Total: ${formatCurrency(item.totalPrice)}`
).join('\n') || 'No items'}

========================================

TOTAL AMOUNT: ${formatCurrency(po.totalAmount || 0)}

NOTES:
${po.notes || 'No additional notes'}

========================================

APPROVAL INFORMATION:
Approved Date: ${format(new Date(), 'PPP')}
Approved By: Manager

This purchase order has been approved and is ready for processing.
    `;
  };

  return (
    <div className="max-w-4xl mx-auto bg-white">
      {/* PDF Viewer Header */}
      <div className="flex justify-between items-center p-4 border-b print:hidden">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Purchase Order PDF</h2>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            APPROVED
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          {onClose && (
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      {/* PDF Content */}
      <div className="p-8 print:p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">PURCHASE ORDER</h1>
          <div className="text-lg font-medium">{po.reference}</div>
          <div className="text-sm text-muted-foreground mt-2">
            Generated on {format(new Date(), 'PPPP')}
          </div>
        </div>

        {/* PO Details Grid */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">VENDOR</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-semibold text-lg">{po.vendor}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">REQUESTOR</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-semibold">{po.requestor}</div>
              <div className="text-sm text-muted-foreground">{po.department}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">DELIVERY</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">{po.deliveryAddress || 'Not specified'}</div>
              <div className="text-sm text-muted-foreground mt-1">
                Expected: {po.expectedDeliveryDate ? format(po.expectedDeliveryDate, 'PP') : 'Not specified'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">PAYMENT TERMS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-medium">{po.paymentTerms || 'Not specified'}</div>
            </CardContent>
          </Card>
        </div>

        {/* Line Items */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Line Items</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium text-sm">Item Code</th>
                    <th className="text-left p-3 font-medium text-sm">Description</th>
                    <th className="text-right p-3 font-medium text-sm">Quantity</th>
                    <th className="text-right p-3 font-medium text-sm">UoM</th>
                    <th className="text-right p-3 font-medium text-sm">Unit Price</th>
                    <th className="text-right p-3 font-medium text-sm">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {po.lineItems?.map((item, index) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-3 font-fira-code text-sm">{item.itemCode}</td>
                      <td className="p-3 text-sm">{item.description}</td>
                      <td className="p-3 text-right text-sm">{item.quantity}</td>
                      <td className="p-3 text-right text-sm">{item.uom || 'Each'}</td>
                      <td className="p-3 text-right text-sm">{formatCurrency(item.unitPrice)}</td>
                      <td className="p-3 text-right text-sm font-medium">{formatCurrency(item.totalPrice)}</td>
                    </tr>
                  ))}
                  <tr className="border-b-2 border-black bg-muted/20">
                    <td colSpan={5} className="p-3 text-right font-bold">TOTAL AMOUNT:</td>
                    <td className="p-3 text-right font-bold text-lg">{formatCurrency(po.totalAmount || 0)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        {po.notes && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{po.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Approval Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-700">APPROVAL STATUS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
                ✓ APPROVED
              </Badge>
              <div className="text-sm">
                <div>Approved by: <span className="font-medium">Manager</span></div>
                <div>Date: <span className="font-medium">
                  {format(new Date(), 'PPP')}
                </span></div>
              </div>
            </div>
            <Separator className="my-4" />
            <p className="text-sm text-muted-foreground">
              This purchase order has been approved and authorized for processing. 
              Please proceed with procurement according to company policies.
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 pt-4 border-t text-center text-xs text-muted-foreground">
          <p>This document was generated electronically and is valid without signature.</p>
          <p>Document ID: {po.reference} | Generated: {format(new Date(), 'PPP p')}</p>
        </div>
      </div>
    </div>
  );
};

export default POPDFViewer;