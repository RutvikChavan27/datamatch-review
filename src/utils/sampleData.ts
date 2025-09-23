import { PurchaseOrder } from "@/types/purchase-order";

export const createSamplePO = (): PurchaseOrder => {
  return {
    // Header Information
    poNumber: "PO-25786",
    issueDate: "2024-07-29",
    deliveryDate: "2024-08-12",
    
    // Client Information (Logo section)
    clientName: "TechCorp Solutions",
    clientAddress: "456 Business Plaza",
    clientCity: "San Francisco",
    clientState: "CA",
    clientZip: "94105",
    clientEmail: "contact@techcorp.com",
    clientWebsite: "www.techcorp.com",
    
    // Vendor Information
    vendorName: "Vistaprint",
    vendorAddress: "789 Innovation Rd",
    vendorCity: "Tech Center",
    vendorState: "CA",
    vendorZip: "90210",
    vendorPhone: "(555) 123-4567",
    vendorEmail: "orders@vistaprint.com",
    
    // Company Information (Delivery Address)
    companyName: "Research Center",
    companyAddress: "789 Innovation Rd",
    companyCity: "Tech Center",
    companyState: "CA",
    companyZip: "90210",
    companyPhone: "(555) 987-6543",
    companyEmail: "purchasing@researchcenter.com",
    
    // Shipping Information
    shippingAddress: "Research Center, 789 Innovation Rd",
    shippingCity: "Tech Center",
    shippingState: "CA",
    shippingZip: "90210",
    
    // Order Details
    lineItems: [
      {
        id: "DESK-001",
        description: "Executive Desk - Mahogany",
        quantity: 2,
        unitPrice: 1200.00,
        total: 2400.00
      },
      {
        id: "CHAIR-002",
        description: "Ergonomic Office Chair - Black",
        quantity: 4,
        unitPrice: 350.00,
        total: 1400.00
      },
      {
        id: "SHELF-003",
        description: "Bookshelf - Walnut",
        quantity: 3,
        unitPrice: 550.00,
        total: 1650.00
      },
      {
        id: "OS-001",
        description: "Pens (box of 12)",
        quantity: 5,
        unitPrice: 10.00,
        total: 50.00
      },
      {
        id: "OS-002",
        description: "Paper (500 sheets)",
        quantity: 10,
        unitPrice: 20.00,
        total: 200.00
      },
      {
        id: "IT-001",
        description: "Laptop - Dell XPS 15",
        quantity: 3,
        unitPrice: 1500.00,
        total: 4500.00
      },
      {
        id: "IT-002",
        description: "27\" Monitor",
        quantity: 6,
        unitPrice: 500.00,
        total: 3000.00
      },
      {
        id: "LAMP-001",
        description: "Desk Lamp - LED",
        quantity: 8,
        unitPrice: 75.00,
        total: 600.00
      },
      {
        id: "KB-001",
        description: "Wireless Keyboard",
        quantity: 6,
        unitPrice: 120.00,
        total: 720.00
      },
      {
        id: "MOUSE-001",
        description: "Ergonomic Mouse - Wireless",
        quantity: 6,
        unitPrice: 60.00,
        total: 360.00
      }
    ],
    subtotal: 14880.00,
    taxRate: 8.25,
    taxAmount: 1227.60,
    shippingCost: 150.00,
    total: 16257.60,
    
    // Additional Information
    paymentTerms: "Net 60",
    notes: "HR Training materials order",
    authorizedBy: "Alex Johnson",
    department: "Marketing"
  };
};