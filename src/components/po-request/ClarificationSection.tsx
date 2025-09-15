import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HelpCircle, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { discussionsApi } from "@/services/poRequest";

export type POStatus =
  | "submitted"
  | "approved"
  | "rejected"
  | "query"
  | "discussion";

export interface LineItem {
  id: string;
  itemCode: string;
  description: string;
  quantity: number;
  uom?: string; // Unit of Measure
  uomId?: string; // Unit of Measure
  unitPrice: number;
  totalPrice: number;
}
export interface PurchaseOrder {
  id: string;
  reference: string;
  title: string;
  vendor: string;
  department: string;
  requestor: string;
  totalAmount: number;
  status: POStatus;
  lineItems: LineItem[];
  createdAt: Date;
  updatedAt: Date;
  expectedDeliveryDate?: Date | null;
  deliveryAddress?: string;
  paymentTerms?: string;
  notes?: string;
}
interface ClarificationSectionProps {
  onRespond: (response: string) => void;
  po: PurchaseOrder;
  readOnly?: boolean;
}

export interface discussionsType {
  id: number;
  po_id: number;
  user_id: number;
  user_name: string;
  message: string;
  created_at: string;
}

const ClarificationSection: React.FC<ClarificationSectionProps> = ({
  onRespond,
  po,
  readOnly = false,
}) => {
  const [response, setResponse] = useState("");
  const [discussions, setDiscussions] = useState<discussionsType[]>();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [discussions]);

  useEffect(() => {
    const fetchDiscussion = async () => {
      const discussionResponse: discussionsType[] =
        await discussionsApi.getById(Number(po.id));
      console.log("discussionResponse ", discussionResponse);
      setDiscussions(discussionResponse);
    };

    fetchDiscussion();
  }, [po.id]);

  // if (!clarification) return null

  const handleSubmit = async () => {
    if (!response.trim()) return toast.error("Please enter a response");

    try {
      await discussionsApi.create({
        po_id: Number(po.id),
        message: response,
        user_name: "John Reviewer",
      });

      // Refetch updated discussions
      const updated = await discussionsApi.getById(Number(po.id));
      setDiscussions(updated);

      onRespond(response);
      setResponse("");
      toast.success("Response submitted successfully");
    } catch (error) {
      toast.error("Submission failed");
    }
  };

  return (
    <Card className="mb-6 border-purple-200 bg-purple-50/30">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-purple-500" />
          <CardTitle className="text-lg text-purple-700">
            Discussion Request
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={chatContainerRef}
          className="space-y-4 max-h-[400px] overflow-y-auto"
        >
          {discussions?.map((discussion) => (
            <div
              key={discussion.id}
              className="bg-white p-4 rounded-md border border-purple-100"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">
                  {discussion.user_name === "John Requester"
                    ? discussion.user_name
                    : "Your response"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(discussion.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="text-gray-700">{discussion.message}</p>
            </div>
          ))}

          <div className="space-y-3 mt-4">
            <p className="text-sm font-medium">Your Response</p>
            <div className="flex items-end gap-2">
              <Textarea
                placeholder="Type your response here..."
                className="min-h-[40px] resize-none"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
              />
              <Button variant="default" onClick={handleSubmit} className="h-10">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClarificationSection;
