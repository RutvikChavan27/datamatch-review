
// This file contains a sample PO with discussion status for testing
import { PurchaseOrder, POStatus } from '@/types/po-types';

export const sampleDiscussionPO: PurchaseOrder = {
  id: "disc-1",
  reference: "PO-2025-001",
  title: "Office Furniture Discussion PO",
  vendor: "Modern Office Supplies Inc.",
  department: "Administration",
  requestor: "Maria Rodriguez",
  totalAmount: 2450.00,
  status: "discussion" as POStatus,
  lineItems: [
    {
      id: "disc-item-1",
      itemCode: "DESK-001",
      description: "Executive Desk - Mahogany",
      quantity: 1,
      uom: "Each",
      unitPrice: 1200.00,
      totalPrice: 1200.00
    },
    {
      id: "disc-item-2",
      itemCode: "CHAIR-002",
      description: "Ergonomic Office Chair - Black",
      quantity: 2,
      uom: "Each",
      unitPrice: 350.00,
      totalPrice: 700.00
    },
    {
      id: "disc-item-3",
      itemCode: "SHELF-003",
      description: "Bookshelf - Walnut",
      quantity: 1,
      uom: "Each",
      unitPrice: 550.00,
      totalPrice: 550.00
    }
  ],
  createdAt: new Date(2025, 3, 15), // April 15, 2025
  updatedAt: new Date(2025, 3, 17), // April 17, 2025
  expectedDeliveryDate: new Date(2025, 4, 15), // May 15, 2025
  deliveryAddress: "Corporate HQ, Floor 5, 123 Business Blvd, Enterprise City",
  paymentTerms: "Net 30",
  notes: "This furniture is for the new executive office being set up for the VP of Operations.",
  clarificationRequest: {
    id: "clarif-1",
    question: "Can you provide the manufacturer details and LOT numbers for these furniture pieces? We need to verify they meet our sustainability requirements.",
    askedBy: "Procurement Reviewer",
    askedAt: new Date(2025, 3, 17, 10, 30), // April 17, 2025, 10:30 AM
    response: undefined,
    respondedAt: undefined
  }
};
