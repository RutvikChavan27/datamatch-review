// src/types/po-types.ts
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
  uom?: string; // Unit of Measure name for display
  uomId?: number; // Unit of Measure ID for API
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
  clarificationRequest?: ClarificationRequest;
  discussion?: Discussion;
}

export interface POApprovalStage {
  id: string;
  name: string;
  approver: string;
  status: "pending" | "approved" | "rejected" | "query";
  timestamp?: Date;
  comments?: string;
}

export interface POApprovalFlow {
  id: string;
  poId: string;
  currentStage: number;
  stages: POApprovalStage[];
}

export interface ClarificationRequest {
  id: string;
  question?: string;
  askedBy?: string;
  askedAt?: Date;
  requestedBy?: string;
  requestedAt?: Date;
  response?: string;
  respondedAt?: Date;
  isResolved?: boolean;
}

export interface DiscussionMessage {
  id: string;
  message: string;
  author: string;
  timestamp: Date;
  type: "user" | "system";
}

export interface Discussion {
  id: string;
  poId: string;
  messages: DiscussionMessage[];
  isActive: boolean;
  startedAt: Date;
  lastActivity: Date;
}

export interface Vendor {
  id: number;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
}

export interface POItem {
  id: number;
  po_id: number;
  item_code: string;
  description: string;
  quantity: number;
  uom: number;
  unit_price: string;
  status: string;
}

export interface PurchaseOrderSummary {
  id: number;
  title: string;
  reference: string;
  vendor_id: number;
  vendor: Vendor;
  requester: string;
  department: string;
  address: string;
  payment_terms: string | null;
  due_date: string;
  notes: string;
  total: string;
  status: string;
  created_at: string;
  updated_at: string;
  items: POItem[];
}
