export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PurchaseOrder {
  // Header Information
  poNumber: string;
  issueDate: string;
  deliveryDate: string;
  
  // Client Information (Logo section)
  clientName: string;
  clientAddress: string;
  clientCity: string;
  clientState: string;
  clientZip: string;
  clientEmail: string;
  clientWebsite: string;
  
  // Vendor Information
  vendorName: string;
  vendorAddress: string;
  vendorCity: string;
  vendorState: string;
  vendorZip: string;
  vendorPhone: string;
  vendorEmail: string;
  
  // Company Information (renamed from companyName, etc.)
  companyName: string;
  companyAddress: string;
  companyCity: string;
  companyState: string;
  companyZip: string;
  companyPhone: string;
  companyEmail: string;
  
  // Shipping Information
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  
  // Order Details
  lineItems: LineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  shippingCost: number;
  total: number;
  
  // Additional Information
  paymentTerms: string;
  notes: string;
  authorizedBy: string;
  department: string;
}