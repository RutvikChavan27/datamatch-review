
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ClarificationRequest } from '@/types/po-types';
import { HelpCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface ClarificationSectionProps {
  clarification: ClarificationRequest | undefined;
  onRespond: (response: string) => void;
  readOnly?: boolean;
}

const ClarificationSection: React.FC<ClarificationSectionProps> = ({ 
  clarification, 
  onRespond,
  readOnly = false
}) => {
  const [response, setResponse] = useState('');

  if (!clarification) return null;

  const handleSubmit = () => {
    if (!response.trim()) {
      toast.error('Please enter a response');
      return;
    }
    
    onRespond(response);
    setResponse('');
    toast.success('Response submitted successfully');
  };

  return (
    <Card className="mb-6 border-purple-200 bg-purple-50/30">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-purple-500" />
          <CardTitle className="text-lg text-purple-700">Discussion Request</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-md border border-purple-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">{clarification.askedBy}</span>
              <span className="text-xs text-muted-foreground">
                {clarification.askedAt && formatDistanceToNow(clarification.askedAt, { addSuffix: true })}
              </span>
            </div>
            <p className="text-gray-700">{clarification.question}</p>
          </div>

          {clarification.response ? (
            <div className="bg-white p-4 rounded-md border border-green-100 ml-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">Your response</span>
                <span className="text-xs text-muted-foreground">
                  {clarification.respondedAt && 
                    formatDistanceToNow(clarification.respondedAt, { addSuffix: true })}
                </span>
              </div>
              <p className="text-gray-700">{clarification.response}</p>
            </div>
          ) : !readOnly ? (
            <div className="space-y-3">
              <p className="text-sm font-medium">Your Response</p>
              <Textarea 
                placeholder="Type your response here..."
                className="min-h-[100px]"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
              />
            </div>
          ) : null}
        </div>
      </CardContent>
      
      {!clarification.response && !readOnly && (
        <CardFooter className="flex justify-end border-t bg-muted/20 p-3">
          <Button variant="default" onClick={handleSubmit}>
            Submit Response
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ClarificationSection;
