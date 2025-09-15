import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PurchaseOrder } from "@/types/po-types";
// import { formatCurrency } from '@/lib/formatters';

// Local formatCurrency function
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};
import { Check, ArrowRight, FileText } from "lucide-react";

const Confirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [po, setPo] = useState<Partial<PurchaseOrder> | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Get PO data from location state
    if (location.state?.po) {
      setPo(location.state.po);
    } else {
      // Redirect if no PO data
      navigate("/po-requests");
    }

    // Trigger animation completion
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 800);

    return () => clearTimeout(timer);
  }, [location.state, navigate]);

  const handleCreateAnother = () => {
    navigate("/po-requests/create");
  };

  const handleViewPOs = () => {
    navigate("/po-requests");
  };

  if (!po) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 max-w-3xl py-8">
      <div className="text-center mb-8 space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-blue-600 w-20 h-20 flex items-center justify-center">
            <div className="relative w-10 h-10">
              <Check
                className={`h-10 w-10 text-white animate-check-mark absolute left-0 top-0`}
                strokeWidth={3}
              />
            </div>
          </div>
        </div>

        <div
          className={`space-y-2 transition-opacity duration-300 ${
            animationComplete ? "opacity-100" : "opacity-0"
          }`}
        >
          <h1 className="text-3xl font-bold">Purchase Order Submitted!</h1>
          <p className="text-muted-foreground">
            Your purchase order has been successfully submitted and is now
            awaiting approval.
          </p>
        </div>
      </div>

      <Card
        className={`mb-8 border-l-4 border-l-po-statusSubmitted transition-opacity duration-500 ${
          animationComplete ? "opacity-100" : "opacity-0"
        }`}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Purchase Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">PO Reference</p>
              <p className="font-medium">{po.reference}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Vendor</p>
              <p className="font-medium">{po.vendor}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Department</p>
              <p className="font-medium">{po.department}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="font-bold">{formatCurrency(po.totalAmount || 0)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Items</p>
              <p className="font-medium">{po.lineItems?.length || 0} items</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Submitted Date</p>
              <p className="font-medium">
                {po.createdAt?.toLocaleDateString()}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Approval Timeline
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <div className="h-4 w-4 rounded-full bg-po-statusSubmitted"></div>
              <p>Submitted</p>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="h-4 w-4 rounded-full bg-po-statusPending"></div>
              <p>Department Review</p>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="h-4 w-4 rounded-full bg-muted"></div>
              <p>Financial Review</p>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="h-4 w-4 rounded-full bg-muted"></div>
              <p>Final Approval</p>
            </div>
          </div>

          <div className="bg-muted/30 p-4 rounded-md text-sm">
            <p>
              <span className="font-medium">Expected approval timeline:</span>{" "}
              Your purchase order is expected to be processed within 2-3
              business days.
            </p>
          </div>
        </CardContent>
      </Card>

      <div
        className={`flex gap-4 justify-center transition-opacity duration-700 ${
          animationComplete ? "opacity-100" : "opacity-0"
        }`}
      >
        <Button
          variant="outline"
          className="flex-1 sm:flex-none"
          onClick={handleCreateAnother}
        >
          <FileText className="mr-2 h-4 w-4" />
          Create Another PO
        </Button>
        <Button onClick={handleViewPOs} className="flex-1 sm:flex-none">
          View My POs
        </Button>
      </div>
    </div>
  );
};

export default Confirmation;
