import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, ExternalLink } from 'lucide-react';

const PORequestsList = () => {
  const handleViewPORequests = () => {
    window.open('https://po-requestor-ui.lovable.app/', '_blank');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">PO Requests</h2>
          </div>
          
          <Button 
            onClick={handleViewPORequests}
            className="button-primary flex items-center space-x-2"
            size="lg"
          >
            <span>View PO Requests</span>
            <ExternalLink className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PORequestsList;