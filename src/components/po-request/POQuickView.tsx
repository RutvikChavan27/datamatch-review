import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PurchaseOrder } from "@/types/po-types";
import StatusBadge from "./StatusBadge";
// import { formatCurrency } from '@/lib/formatters';

// Local formatCurrency function
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ClarificationSection from "./ClarificationSection";
import { User, Calendar } from "lucide-react";

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
    console.log("Clarification response:", response);
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
            <span className="text-sm font-fira-code text-muted-foreground">
              {po.reference}
            </span>
          </SheetTitle>
        </SheetHeader>

        {/* Show Clarification Section if status is discussion */}
        {po.status === "discussion" && po.clarificationRequest && (
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
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Requestor
                </h3>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4 text-gray-400" />
                  <p className="font-medium">{po.requestor}</p>
                </div>
                <p className="text-sm">Department: {po.department}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Vendor
                </h3>
                <p className="font-medium">{po.vendor}</p>
                {po.paymentTerms && (
                  <p className="text-sm">Terms: {po.paymentTerms}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Amount
                </h3>
                <p className="font-bold text-xl">
                  {formatCurrency(po.totalAmount)}
                </p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <p className="text-sm">
                    Created: {po.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="border rounded-md overflow-hidden mb-4">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50 transition-colors">
                  <TableHead 
                    className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t px-4"
                    style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}
                  >
                    Item Code
                  </TableHead>
                  <TableHead 
                    className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t px-4"
                    style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}
                  >
                    Description
                  </TableHead>
                  <TableHead 
                    className="text-right font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t px-4"
                    style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}
                  >
                    Quantity
                  </TableHead>
                  <TableHead 
                    className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t px-4"
                    style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}
                  >
                    {po.lineItems[0]?.uom ? "UoM" : ""}
                  </TableHead>
                  <TableHead 
                    className="text-right font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t px-4"
                    style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}
                  >
                    Unit Price
                  </TableHead>
                  <TableHead 
                    className="text-right font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t px-4"
                    style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}
                  >
                    Total
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {po.lineItems.slice(0, 3).map((item) => (
                  <TableRow key={item.id} className="h-10 hover:bg-muted/50 transition-colors">
                    <TableCell className="font-fira-code text-sm font-medium py-2 border-r-0 text-foreground truncate px-4">
                      <div className="truncate" title={item.itemCode}>
                        {item.itemCode}
                      </div>
                    </TableCell>
                    <TableCell className="py-2 border-r-0 text-sm text-foreground truncate px-4">
                      <div className="truncate" title={item.description}>
                        {item.description}
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-2 border-r-0 text-sm text-foreground px-4">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="py-2 border-r-0 text-sm text-foreground px-4">
                      {item.uom || ""}
                    </TableCell>
                    <TableCell className="text-right py-2 border-r-0 text-sm text-foreground px-4">
                      {formatCurrency(item.unitPrice)}
                    </TableCell>
                    <TableCell className="text-right font-medium py-2 border-r-0 text-sm text-foreground px-4">
                      {formatCurrency(item.totalPrice)}
                    </TableCell>
                  </TableRow>
                ))}

                {po.lineItems.length > 3 && (
                  <TableRow className="h-10 hover:bg-muted/50 transition-colors">
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground py-2 border-r-0 text-sm px-4"
                    >
                      + {po.lineItems.length - 3} more items
                    </TableCell>
                  </TableRow>
                )}

                <TableRow className="bg-muted/20">
                  <TableCell colSpan={5} className="text-right font-medium py-2 border-r-0 text-sm text-foreground px-4">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-bold py-2 border-r-0 text-sm text-foreground px-4">
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
          <Button onClick={handleViewDetails}>View Full Details</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default POQuickView;
