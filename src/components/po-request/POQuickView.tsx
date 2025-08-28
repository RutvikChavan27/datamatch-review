
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PurchaseOrder } from '@/types/po-types';
import StatusBadge from './StatusBadge';
// import { formatCurrency } from '@/lib/formatters';

// Local formatCurrency function
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ClarificationSection from './ClarificationSection';
import { User, Calendar } from 'lucide-react';

interface POQuickViewProps {
  po: PurchaseOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

const POQuickView: React.FC<POQuickViewProps> = ({ po, isOpen, onClose }) => {
  const navigate = useNavigate();
  
  if (!po) return null;
  
  const handleViewDetails = () => {
    navigate(`/po-requests/po/${po.id}`);
    onClose();
  };

  const handleClarificationResponse = (response: string) => {
    // In a real app, we would update the PO in the backend
    console.log('Clarification response:', response);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span>{po.title}</span>
              <StatusBadge status={po.status} />
            </div>
            <span className="text-sm font-fira-code text-muted-foreground">{po.reference}</span>
          </SheetTitle>
        </SheetHeader>
        
        {/* Show Clarification Section if status is discussion */}
        {po.status === 'discussion' && po.clarificationRequest && (
          <div className="mb-4">
            <ClarificationSection 
              clarification={po.clarificationRequest}
              onRespond={handleClarificationResponse}
              readOnly={false} // Allow response in quick view
            />
          </div>
        )}
        
        <div className="py-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Requestor</h3>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4 text-gray-400" />
                  <p className="font-medium">{po.requestor}</p>
                </div>
                <p className="text-sm">Department: {po.department}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Vendor</h3>
                <p className="font-medium">{po.vendor}</p>
                {po.paymentTerms && (
                  <p className="text-sm">Terms: {po.paymentTerms}</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Amount</h3>
                <p className="font-bold text-xl">{formatCurrency(po.totalAmount)}</p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <p className="text-sm">Created: {po.createdAt.toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="border rounded-md overflow-hidden mb-4">
            <Table>
              <TableHeader>
                <TableRow className="bg-[hsl(var(--table-header-bg))]">
                  <TableHead>Item Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead>{po.lineItems[0]?.uom ? 'UoM' : ''}</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {po.lineItems.slice(0, 3).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-fira-code">{item.itemCode}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell>{item.uom || ''}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.totalPrice)}</TableCell>
                  </TableRow>
                ))}
                
                {po.lineItems.length > 3 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      + {po.lineItems.length - 3} more items
                    </TableCell>
                  </TableRow>
                )}
                
                <TableRow className="bg-muted/20">
                  <TableCell colSpan={5} className="text-right font-medium">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(po.totalAmount)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          {po.notes && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">Notes</h3>
              <div className="bg-muted/30 p-3 rounded-md text-sm">
                <p>{po.notes}</p>
              </div>
            </div>
          )}
        </div>
        
        <SheetFooter className="mt-6">
          <Button variant="outline" onClick={onClose} className="mr-2">
            Close
          </Button>
          <Button onClick={handleViewDetails}>
            View Full Details
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default POQuickView;
