import { FolderNode, Document, IndexForm, FormField } from "@/types/storage";

// Mock folder structure
export const mockFolderStructure: FolderNode = {
  id: "root",
  name: "All Documents",
  type: "storage",
  docCount: 15420,
  size: "2.3 TB",
  created: new Date("2023-01-01"),
  createdBy: "System",
  children: [
    {
      id: "finance",
      name: "Finance Department",
      type: "department",
      docCount: 8750,
      size: "1.2 TB",
      parentId: "root",
      created: new Date("2023-01-15"),
      createdBy: "Admin",
      children: [
        {
          id: "fin-active",
          name: "Active Projects",
          type: "project",
          docCount: 2340,
          size: "650 GB",
          parentId: "finance",
          created: new Date("2023-02-01"),
          createdBy: "Finance Manager",
          children: [
            {
              id: "fin-active-q1",
              name: "Q1 2024 Projects",
              type: "project",
              docCount: 580,
              size: "1.7 GB",
              parentId: "fin-active",
              created: new Date("2024-01-01"),
              createdBy: "Project Manager",
            },
            {
              id: "fin-active-q2",
              name: "Q2 2024 Projects",
              type: "project",
              docCount: 230,
              size: "890 MB",
              parentId: "fin-active",
              created: new Date("2024-04-01"),
              createdBy: "Project Manager",
            },
            {
              id: "fin-active-budgets",
              name: "Budget Reviews",
              type: "project",
              docCount: 145,
              size: "2.3 GB",
              parentId: "fin-active",
              created: new Date("2024-01-15"),
              createdBy: "Budget Analyst",
            },
          ],
        },
        {
          id: "fin-archived",
          name: "Archived",
          type: "archived",
          docCount: 5200,
          size: "480 GB",
          parentId: "finance",
          created: new Date("2023-01-20"),
          createdBy: "Finance Manager",
        },
        {
          id: "fin-templates",
          name: "Templates",
          type: "project",
          docCount: 180,
          size: "15 GB",
          parentId: "finance",
          created: new Date("2023-01-25"),
          createdBy: "Finance Manager",
        },
        {
          id: "fin-invoices",
          name: "Invoices 2024",
          type: "project",
          docCount: 1030,
          size: "85 GB",
          parentId: "finance",
          created: new Date("2024-01-01"),
          createdBy: "Finance Manager",
        },
      ],
    },
    {
      id: "hr",
      name: "Human Resources",
      type: "department",
      docCount: 3420,
      size: "450 GB",
      parentId: "root",
      created: new Date("2023-01-15"),
      createdBy: "Admin",
      children: [
        {
          id: "hr-personnel",
          name: "Personnel Files",
          type: "project",
          docCount: 1850,
          size: "250 GB",
          parentId: "hr",
          created: new Date("2023-02-01"),
          createdBy: "HR Manager",
          children: [
            {
              id: "hr-personnel-active",
              name: "Active Employees",
              type: "project",
              docCount: 420,
              size: "85 GB",
              parentId: "hr-personnel",
              created: new Date("2024-01-01"),
              createdBy: "HR Specialist",
            },
            {
              id: "hr-personnel-terminated",
              name: "Terminated Employees",
              type: "archived",
              docCount: 180,
              size: "45 GB",
              parentId: "hr-personnel",
              created: new Date("2023-06-01"),
              createdBy: "HR Manager",
            },
            {
              id: "hr-personnel-contractors",
              name: "Contractors & Consultants",
              type: "project",
              docCount: 95,
              size: "15 GB",
              parentId: "hr-personnel",
              created: new Date("2024-02-01"),
              createdBy: "Contract Manager",
            },
          ],
        },
        {
          id: "hr-policies",
          name: "Policies & Procedures",
          type: "project",
          docCount: 320,
          size: "45 GB",
          parentId: "hr",
          created: new Date("2023-01-20"),
          createdBy: "HR Manager",
        },
        {
          id: "hr-training",
          name: "Training Materials",
          type: "project",
          docCount: 1250,
          size: "155 GB",
          parentId: "hr",
          created: new Date("2023-03-01"),
          createdBy: "Training Coordinator",
        },
      ],
    },
    {
      id: "operations",
      name: "Operations",
      type: "department",
      docCount: 2180,
      size: "380 GB",
      parentId: "root",
      created: new Date("2023-01-15"),
      createdBy: "Admin",
      children: [
        {
          id: "ops-procedures",
          name: "Standard Procedures",
          type: "project",
          docCount: 680,
          size: "120 GB",
          parentId: "operations",
          created: new Date("2023-02-15"),
          createdBy: "Operations Manager",
          children: [
            {
              id: "ops-procedures-manufacturing",
              name: "Manufacturing SOPs",
              type: "project",
              docCount: 320,
              size: "3.2 GB",
              parentId: "ops-procedures",
              created: new Date("2024-01-01"),
              createdBy: "Manufacturing Manager",
            },
            {
              id: "ops-procedures-safety",
              name: "Safety Protocols",
              type: "project",
              docCount: 155,
              size: "1.8 GB",
              parentId: "ops-procedures",
              created: new Date("2024-01-15"),
              createdBy: "Safety Officer",
            },
          ],
        },
        {
          id: "ops-reports",
          name: "Monthly Reports",
          type: "project",
          docCount: 720,
          size: "95 GB",
          parentId: "operations",
          created: new Date("2023-01-25"),
          createdBy: "Operations Manager",
        },
        {
          id: "ops-quality",
          name: "Quality Control",
          type: "project",
          docCount: 780,
          size: "165 GB",
          parentId: "operations",
          created: new Date("2023-03-01"),
          createdBy: "Quality Manager",
        },
      ],
    },
    {
      id: "it",
      name: "IT Department",
      type: "department",
      docCount: 890,
      size: "220 GB",
      parentId: "root",
      created: new Date("2023-01-15"),
      createdBy: "Admin",
      children: [
        {
          id: "it-documentation",
          name: "System Documentation",
          type: "project",
          docCount: 450,
          size: "85 GB",
          parentId: "it",
          created: new Date("2023-02-01"),
          createdBy: "IT Manager",
        },
        {
          id: "it-security",
          name: "Security Policies",
          type: "project",
          docCount: 180,
          size: "25 GB",
          parentId: "it",
          created: new Date("2023-01-30"),
          createdBy: "Security Officer",
        },
        {
          id: "it-backups",
          name: "Backup Procedures",
          type: "project",
          docCount: 260,
          size: "110 GB",
          parentId: "it",
          created: new Date("2023-02-15"),
          createdBy: "IT Manager",
        },
      ],
    },
    {
      id: "legal",
      name: "Legal Department",
      type: "department",
      docCount: 1180,
      size: "95 GB",
      parentId: "root",
      created: new Date("2023-01-15"),
      createdBy: "Admin",
      children: [
        {
          id: "legal-contracts",
          name: "Contracts",
          type: "project",
          docCount: 620,
          size: "45 GB",
          parentId: "legal",
          created: new Date("2023-02-01"),
          createdBy: "Legal Counsel",
        },
        {
          id: "legal-compliance",
          name: "Compliance Documents",
          type: "project",
          docCount: 280,
          size: "25 GB",
          parentId: "legal",
          created: new Date("2023-01-25"),
          createdBy: "Compliance Officer",
        },
        {
          id: "legal-archived",
          name: "Archived Legal Files",
          type: "archived",
          docCount: 280,
          size: "25 GB",
          parentId: "legal",
          created: new Date("2023-01-20"),
          createdBy: "Legal Counsel",
        },
      ],
    },
  ],
};

// Mock documents for folders
export const mockDocuments: { [folderId: string]: Document[] } = {
  "fin-active": [
    {
      id: "doc-1",
      name: "Q4 Budget Analysis.pdf",
      type: "pdf",
      size: "2.4 MB",
      modified: new Date("2024-01-15"),
      created: new Date("2024-01-10"),
      createdBy: "Finance Analyst",
      folderId: "fin-active",
      url: "/lovable-uploads/40a647b5-00f5-4bd4-825e-8b58cca2e7c2.png",
      workflowStatus: "completed",
    },
    {
      id: "doc-2",
      name: "Expense Report Template.xlsx",
      type: "xls",
      size: "156 KB",
      modified: new Date("2024-01-12"),
      created: new Date("2024-01-05"),
      createdBy: "Finance Manager",
      folderId: "fin-active",
      url: "/lovable-uploads/dd02edfb-b909-4512-a7c0-542a9b5663b1.png",
      workflowStatus: "pending",
    },
    {
      id: "doc-3",
      name: "Purchase Order PO-2024-0456.pdf",
      type: "pdf",
      size: "1.8 MB",
      modified: new Date("2024-01-14"),
      created: new Date("2024-01-08"),
      createdBy: "Procurement Officer",
      folderId: "fin-active",
      url: "/lovable-uploads/00aad332-2016-4d6e-a7be-aca80f0f4d7f.png",
      workflowStatus: "processing",
    },
    {
      id: "doc-4",
      name: "Invoice INV-2024-0789.pdf",
      type: "pdf",
      size: "950 KB",
      modified: new Date("2024-01-13"),
      created: new Date("2024-01-07"),
      createdBy: "Accounts Payable",
      folderId: "fin-active",
      url: "/lovable-uploads/fe9ef048-4144-4080-b58f-6cbe02f0092c.png",
      workflowStatus: "completed",
    },
    {
      id: "doc-5",
      name: "Contract Amendment.docx",
      type: "doc",
      size: "245 KB",
      modified: new Date("2024-01-11"),
      created: new Date("2024-01-04"),
      createdBy: "Legal Team",
      folderId: "fin-active",
      url: "/lovable-uploads/8d20aef4-a52a-4ed0-81da-2967f1edeb99.png",
      workflowStatus: "failed",
    },
  ],
  "hr-personnel": [
    {
      id: "doc-6",
      name: "Employee Handbook 2024.pdf",
      type: "pdf",
      size: "5.2 MB",
      modified: new Date("2024-01-10"),
      created: new Date("2024-01-01"),
      createdBy: "HR Manager",
      folderId: "hr-personnel",
      url: "/lovable-uploads/9350d5be-a2a4-40bf-bed5-2cfe0c53c749.png",
      workflowStatus: "completed",
    },
    {
      id: "doc-7",
      name: "Performance Review Template.xlsx",
      type: "xls",
      size: "89 KB",
      modified: new Date("2024-01-09"),
      created: new Date("2023-12-15"),
      createdBy: "HR Specialist",
      folderId: "hr-personnel",
      url: "/lovable-uploads/c24bf7a8-2cc8-4ae6-9497-8bc1716e1451.png",
      workflowStatus: "completed",
    },
    {
      id: "doc-8",
      name: "Onboarding Checklist.docx",
      type: "doc",
      size: "125 KB",
      modified: new Date("2024-01-08"),
      created: new Date("2023-12-20"),
      createdBy: "HR Coordinator",
      folderId: "hr-personnel",
      url: "/lovable-uploads/ea5c7c4b-cbd2-4fe4-842a-0ecc8485c9c7.png",
      workflowStatus: "pending",
    },
  ],
  "ops-procedures": [
    {
      id: "doc-9",
      name: "Standard Operating Procedure.pdf",
      type: "pdf",
      size: "3.1 MB",
      modified: new Date("2024-01-07"),
      created: new Date("2023-12-10"),
      createdBy: "Operations Manager",
      folderId: "ops-procedures",
      url: "/lovable-uploads/e985abc6-5657-4a27-9ac2-09e11b193728.png",
      workflowStatus: "completed",
    },
    {
      id: "doc-10",
      name: "Quality Control Checklist.xlsx",
      type: "xls",
      size: "78 KB",
      modified: new Date("2024-01-06"),
      created: new Date("2023-12-05"),
      createdBy: "Quality Manager",
      folderId: "ops-procedures",
      url: "/lovable-uploads/f0c1a91c-b05a-4693-aac8-540f63f64924.png",
      workflowStatus: "processing",
    },
  ],
};

// Generate additional documents for other folders
const generateDocumentsForFolder = (
  folderId: string,
  count: number
): Document[] => {
  const baseDocuments = [
    { name: "Annual Report", type: "pdf" as const, size: "2.1 MB" },
    { name: "Project Proposal", type: "doc" as const, size: "456 KB" },
    { name: "Budget Spreadsheet", type: "xls" as const, size: "89 KB" },
    { name: "Meeting Minutes", type: "pdf" as const, size: "234 KB" },
    { name: "Policy Document", type: "doc" as const, size: "567 KB" },
    { name: "Data Analysis", type: "xls" as const, size: "1.2 MB" },
    { name: "Training Material", type: "pdf" as const, size: "3.4 MB" },
    { name: "Compliance Report", type: "pdf" as const, size: "890 KB" },
  ];

  const statuses: ("pending" | "processing" | "completed" | "failed")[] = [
    "pending",
    "processing",
    "completed",
    "completed",
    "completed",
    "failed",
  ];

  const urls = [
    "/lovable-uploads/40a647b5-00f5-4bd4-825e-8b58cca2e7c2.png",
    "/lovable-uploads/dd02edfb-b909-4512-a7c0-542a9b5663b1.png",
    "/lovable-uploads/00aad332-2016-4d6e-a7be-aca80f0f4d7f.png",
    "/lovable-uploads/fe9ef048-4144-4080-b58f-6cbe02f0092c.png",
    "/lovable-uploads/8d20aef4-a52a-4ed0-81da-2967f1edeb99.png",
    "/lovable-uploads/9350d5be-a2a4-40bf-bed5-2cfe0c53c749.png",
  ];

  const users = ["Manager", "Analyst", "Coordinator", "Specialist", "Officer"];

  return Array.from({ length: count }, (_, index) => {
    const baseDoc = baseDocuments[index % baseDocuments.length];
    const dayOffset = Math.floor(Math.random() * 30);
    const created = new Date();
    created.setDate(created.getDate() - dayOffset - 5);
    const modified = new Date(created);
    modified.setDate(modified.getDate() + Math.floor(Math.random() * 5));

    return {
      id: `${folderId}-doc-${index + 1}`,
      name: `${baseDoc.name} ${index + 1}.${
        baseDoc.type === "xls"
          ? "xlsx"
          : baseDoc.type === "doc"
          ? "docx"
          : "pdf"
      }`,
      type: baseDoc.type,
      size: baseDoc.size,
      modified,
      created,
      createdBy: `${folderId.split("-")[0].toUpperCase()} ${
        users[index % users.length]
      }`,
      folderId,
      url: urls[index % urls.length],
      workflowStatus: statuses[index % statuses.length],
    };
  });
};

// Add generated documents to all folders including parent folders with subfolders
const allFolderIds = [
  // Root level folders with mixed content (subfolders + documents)
  "finance",
  "hr",
  "operations",
  "it",
  "legal",
  // Mid-level folders with mixed content
  "fin-active",
  "hr-personnel",
  "ops-procedures",
  // Leaf folders
  "fin-archived",
  "fin-templates",
  "fin-invoices",
  "fin-active-q1",
  "fin-active-q2",
  "fin-active-budgets",
  "hr-policies",
  "hr-training",
  "hr-personnel-active",
  "hr-personnel-terminated",
  "hr-personnel-contractors",
  "ops-reports",
  "ops-quality",
  "ops-procedures-manufacturing",
  "ops-procedures-safety",
  "it-documentation",
  "it-security",
  "it-backups",
  "legal-contracts",
  "legal-compliance",
  "legal-archived",
];

allFolderIds.forEach((folderId) => {
  if (!mockDocuments[folderId]) {
    // Generate fewer documents for parent folders, more for leaf folders
    const isParentFolder = [
      "finance",
      "hr",
      "operations",
      "it",
      "legal",
      "fin-active",
      "hr-personnel",
      "ops-procedures",
    ].includes(folderId);
    const count = isParentFolder
      ? Math.floor(Math.random() * 8) + 3
      : Math.floor(Math.random() * 15) + 5; // 3-10 for parents, 5-20 for leaves
    mockDocuments[folderId] = generateDocumentsForFolder(folderId, count);
  }
});

// Mock index forms
export const mockIndexForms: IndexForm[] = [
  {
    id: "form-invoice",
    name: "Invoice Processing Form",
    fields: [
      {
        id: "invoice-number",
        label: "Invoice Number",
        type: "text",
        required: true,
      },
      { id: "vendor", label: "Vendor", type: "text", required: true },
      { id: "amount", label: "Total Amount", type: "number", required: true },
      { id: "date", label: "Invoice Date", type: "date", required: true },
      { id: "po-number", label: "PO Number", type: "text", required: false },
      {
        id: "department",
        label: "Department",
        type: "select",
        required: true,
        options: ["Finance", "HR", "Operations", "IT", "Legal"],
      },
    ],
  },
  {
    id: "form-contract",
    name: "Contract Management Form",
    fields: [
      {
        id: "contract-number",
        label: "Contract Number",
        type: "text",
        required: true,
      },
      {
        id: "party-name",
        label: "Contracting Party",
        type: "text",
        required: true,
      },
      { id: "start-date", label: "Start Date", type: "date", required: true },
      { id: "end-date", label: "End Date", type: "date", required: true },
      { id: "value", label: "Contract Value", type: "number", required: false },
      {
        id: "type",
        label: "Contract Type",
        type: "select",
        required: true,
        options: [
          "Service Agreement",
          "Purchase Contract",
          "Employment Contract",
          "NDA",
        ],
      },
    ],
  },
  {
    id: "form-general",
    name: "General Document Form",
    fields: [
      { id: "title", label: "Document Title", type: "text", required: true },
      {
        id: "category",
        label: "Category",
        type: "select",
        required: true,
        options: ["Policy", "Procedure", "Report", "Correspondence", "Other"],
      },
      {
        id: "description",
        label: "Description",
        type: "textarea",
        required: false,
      },
      {
        id: "priority",
        label: "Priority",
        type: "select",
        required: false,
        options: ["High", "Medium", "Low"],
      },
    ],
  },
];

// Helper function to get documents for a folder
export const getDocumentsForFolder = (folderId: string): Document[] => {
  return mockDocuments[folderId] || [];
};

// Helper function to get mixed content (subfolders + documents) for a folder
export const getMixedContentForFolder = (
  folderId: string
): { folders: FolderNode[]; documents: Document[] } => {
  const folder = getFolderById(folderId);
  const folders = folder?.children || [];
  const documents = mockDocuments[folderId] || [];

  return { folders, documents };
};

// Helper function to get folder by id
export const getFolderById = (
  id: string,
  node: FolderNode = mockFolderStructure
): FolderNode | null => {
  if (node.id === id) return node;

  if (node.children) {
    for (const child of node.children) {
      const found = getFolderById(id, child);
      if (found) return found;
    }
  }

  return null;
};

// Helper function to get breadcrumb path
export const getBreadcrumbPath = (folderId: string): FolderNode[] => {
  const path: FolderNode[] = [];

  const findPath = (node: FolderNode, targetId: string): boolean => {
    path.push(node);

    if (node.id === targetId) {
      return true;
    }

    if (node.children) {
      for (const child of node.children) {
        if (findPath(child, targetId)) {
          return true;
        }
      }
    }

    path.pop();
    return false;
  };

  findPath(mockFolderStructure, folderId);
  return path;
};

// Helper function to format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Purchase Order Template Types
export interface POLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PurchaseOrderData {
  poNumber: string;
  issueDate: string;
  deliveryDate: string;
  clientName: string;
  clientAddress: string;
  clientCity: string;
  clientState: string;
  clientZip: string;
  clientEmail: string;
  clientWebsite: string;
  vendorName: string;
  vendorAddress: string;
  vendorCity: string;
  vendorState: string;
  vendorZip: string;
  vendorPhone: string;
  vendorEmail: string;
  companyName: string;
  companyAddress: string;
  companyCity: string;
  companyState: string;
  companyZip: string;
  companyPhone: string;
  companyEmail: string;
  lineItems: POLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  shippingCost: number;
  total: number;
  paymentTerms: string;
  notes?: string;
  authorizedBy: string;
  department: string;
}

// Classic Purchase Order Template
// export function pdfHtmlClassicPO(purchaseOrder: PurchaseOrderData): string {
//   return `
// <!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta charset="utf-8" />
//     <title>Purchase Order - PO-00055</title>
//     <link
//       href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap"
//       rel="stylesheet"
//     />
//     <style>
//       body {
//         font-family: "Inter", sans-serif;
//         margin: 0;
//         background-color: #ffffff;
//         color: #1f2937;
//       }
//       .po-container {
//         max-width: 800px;
//         margin: 0 auto;
//         padding: 32px;
//         background-color: #fff;
//       }
//       .header-section {
//         display: flex;
//         justify-content: space-between;
//         align-items: flex-start;
//         margin-bottom: 32px;
//         padding-bottom: 16px;
//         border-bottom: 2px solid #3b82f6;
//       }
//       .company-logo {
//         width: 120px;
//         height: 120px;
//         background-color: #e5e7eb;
//         border-radius: 8px;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         color: #6b7280;
//       }
//       .po-title {
//         font-size: 2rem;
//         font-weight: 700;
//         color: #111827;
//         margin-bottom: 16px;
//       }
//       .po-details p {
//         margin: 4px 0;
//         font-size: 0.875rem;
//         color: #374151;
//       }
//       .po-number {
//         font-size: 1.125rem;
//         font-weight: 600;
//         color: #111827;
//       }
//       .info-grid {
//         display: grid;
//         grid-template-columns: 1fr 1fr 1fr;
//         gap: 32px;
//         margin-bottom: 32px;
//       }
//       .info-section h3 {
//         font-weight: 700;
//         color: #111827;
//         margin-bottom: 12px;
//         padding-bottom: 4px;
//         border-bottom: 1px solid #d1d5db;
//         font-size: 0.875rem;
//       }
//       .info-section p {
//         margin: 4px 0;
//         font-size: 0.875rem;
//         color: #374151;
//         line-height: 1.6;
//       }
//       .client-name {
//         font-weight: 600;
//         font-size: 1rem;
//         color: #111827;
//       }
//       .vendor-name,
//       .company-name {
//         font-weight: 600;
//         color: #111827;
//       }
//       .additional-info {
//         display: grid;
//         grid-template-columns: 1fr 1fr 1fr;
//         gap: 24px;
//         margin-bottom: 32px;
//       }
//       .additional-info div {
//         font-size: 0.875rem;
//       }
//       .additional-info .label {
//         font-size: 0.75rem;
//         color: #6b7280;
//         margin-bottom: 2px;
//       }
//       .additional-info .value {
//         font-weight: 500;
//         color: #111827;
//       }
//       .items-section h3 {
//         font-weight: 700;
//         color: #111827;
//         margin-bottom: 16px;
//         padding-bottom: 8px;
//         border-bottom: 1px solid #d1d5db;
//       }
//       table {
//         width: 100%;
//         border-collapse: collapse;
//         border: 1px solid #d1d5db;
//         border-radius: 8px;
//         overflow: hidden;
//         margin-bottom: 32px;
//       }
//       th {
//         background-color: #f3f4f6;
//         padding: 12px 8px;
//         text-align: left;
//         font-weight: 600;
//         font-size: 0.875rem;
//         color: #111827;
//         border-bottom: 1px solid #e5e7eb;
//       }
//       th:nth-child(2),
//       th:nth-child(3),
//       th:nth-child(4) {
//         text-align: center;
//       }
//       th:nth-child(3),
//       th:nth-child(4) {
//         text-align: right;
//       }
//       td {
//         padding: 12px 8px;
//         font-size: 0.875rem;
//         color: #111827;
//       }
//       .totals-section {
//         display: flex;
//         justify-content: flex-end;
//         margin-bottom: 32px;
//       }
//       .totals-table {
//         width: 256px;
//       }
//       .totals-table div {
//         display: flex;
//         justify-content: space-between;
//         padding: 4px 0;
//         font-size: 0.875rem;
//       }
//       .totals-table .total-row {
//         border-top: 1px solid #d1d5db;
//         padding-top: 8px;
//         font-size: 1.125rem;
//         font-weight: 700;
//       }
//       .total-row .label {
//         color: #111827;
//       }
//       .total-row .amount {
//         color: #3b82f6;
//       }
//       .notes-section {
//         margin-top: 32px;
//         padding: 16px;
//         background-color: #f9fafb;
//         border-left: 4px solid #3b82f6;
//         border-radius-right: 8px;
//       }
//       .notes-section h4 {
//         font-weight: 700;
//         color: #111827;
//         margin-bottom: 8px;
//       }
//       .notes-section p {
//         font-size: 0.875rem;
//         color: #111827;
//         white-space: pre-wrap;
//         margin: 0;
//       }
//       .footer {
//         margin-top: 32px;
//         padding-top: 16px;
//         border-top: 1px solid #d1d5db;
//         text-align: center;
//         font-size: 0.75rem;
//         color: #6b7280;
//       }
//     </style>
//   </head>
//   <body>
//     <div class="po-container">
//       <!-- Header Section -->
//       <div class="header-section">
//         <div>
//           <h1 class="po-title">PURCHASE ORDER</h1>
//           <div class="po-details">
//             <p class="po-number">PO# PO-00055</p>
//             <p>Issue Date: 16/09/2025</p>
//             <p>Delivery Date: 29/09/2025</p>
//           </div>
//         </div>
//         <div class="company-logo">
//           <span>LOGO</span>
//         </div>
//       </div>
//       <!-- Client, Vendor and Delivery Information -->
//       <div class="info-grid">
//         <div class="info-section">
//           <h3>Client:</h3>
//           <p class="client-name">Company Name</p>
//           <p>123 Company Street</p>
//           <p>City, State 12345</p>
//           <p>company@example.com</p>
//           <p style="color: #3b82f6">www.company.com</p>
//         </div>
//         <div class="info-section">
//           <h3>Vendor:</h3>
//           <p class="vendor-name">CyberSafe Inc.</p>
//           <p>Vendor Address</p>
//           <p>Vendor City, Vendor State 54321</p>
//           <p>(555) 123-4567</p>
//           <p>vendor@example.com</p>
//         </div>
//         <div class="info-section">
//           <h3>Delivery Address:</h3>
//           <p class="company-name">Delivery Company</p>
//           <p>Nashik</p>
//           <p>Anytown, USA 12345</p>
//           <p>(555) 987-6543</p>
//           <p>delivery@example.com</p>
//         </div>
//       </div>
//       <!-- Additional Information -->
//       <div class="additional-info">
//         <div>
//           <div class="label">Payment Terms:</div>
//           <div class="value">Net 30</div>
//         </div>
//         <div>
//           <div class="label">Authorized By:</div>
//           <div class="value">John Requester</div>
//         </div>
//         <div>
//           <div class="label">Department:</div>
//           <div class="value">Purchasing</div>
//         </div>
//       </div>
//       <!-- Line Items Table -->
//       <div class="items-section">
//         <h3>Items:</h3>
//         <table>
//           <thead>
//             <tr>
//               <th>Description</th>
//               <th>Quantity</th>
//               <th>Unit Price</th>
//               <th>Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr style="background-color: #ffffff">
//               <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb">
//                 Executive Desk - Mahogany
//               </td>
//               <td
//                 style="
//                   padding: 12px 8px;
//                   border-bottom: 1px solid #e5e7eb;
//                   text-align: center;
//                 "
//               >
//                 1
//               </td>
//               <td
//                 style="
//                   padding: 12px 8px;
//                   border-bottom: 1px solid #e5e7eb;
//                   text-align: right;
//                 "
//               >
//                 $1,200.00
//               </td>
//               <td
//                 style="
//                   padding: 12px 8px;
//                   border-bottom: 1px solid #e5e7eb;
//                   text-align: right;
//                   font-weight: 600;
//                 "
//               >
//                 $1,200.00
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//       <!-- Totals -->
//       <div class="totals-section">
//         <div class="totals-table">
//           <div>
//             <span>Subtotal:</span>
//             <span>$1,080.00</span>
//           </div>
//           <div>
//             <span>Tax (10%):</span>
//             <span>$120.00</span>
//           </div>
//           <div>
//             <span>Shipping:</span>
//             <span>$0.00</span>
//           </div>
//           <div class="total-row">
//             <span class="label">Total:</span>
//             <span class="amount">$1,200.00</span>
//           </div>
//         </div>
//       </div>

//       <!-- Notes -->
//       <div class="notes-section">
//         <h4>Notes:</h4>
//         <p>Notes 112233</p>
//       </div>
//       <!-- Footer -->
//       <div class="footer">
//         <p>Company Name • Purchase Order #PO-00055</p>
//       </div>
//     </div>
//   </body>
// </html>
// `;
// }
export function pdfHtmlClassicPO(purchaseOrder: PurchaseOrderData): string {
  const lineItemsHtml = purchaseOrder.lineItems
    .map(
      (item, index) => `
      <tr ${
        index % 2 === 0
          ? 'style="background-color: #ffffff;"'
          : 'style="background-color: #f9fafb;"'
      }>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb;">${
          item.description
        }</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${
          item.quantity
        }</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(
          item.unitPrice
        )}</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${formatCurrency(
          item.total
        )}</td>
      </tr>
    `
    )
    .join("");

  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>Purchase Order - ${purchaseOrder.poNumber}</title>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap"
        rel="stylesheet"
      />
      <style>
        body {
          font-family: "Inter", sans-serif;
          margin: 0;
          background-color: #ffffff;
          color: #1f2937;
        }
        .po-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 32px;
          background-color: #fff;
        }
        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          padding-bottom: 16px;
          border-bottom: 2px solid #3b82f6;
        }
        .company-logo {
          width: 120px;
          height: 120px;
          background-color: #e5e7eb;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
        }
        .po-title {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 16px;
        }
        .po-details p {
          margin: 4px 0;
          font-size: 0.875rem;
          color: #374151;
        }
        .po-number {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 32px;
          margin-bottom: 32px;
        }
        .info-section h3 {
          font-weight: 700;
          color: #111827;
          margin-bottom: 12px;
          padding-bottom: 4px;
          border-bottom: 1px solid #d1d5db;
          font-size: 0.875rem;
        }
        .info-section p {
          margin: 4px 0;
          font-size: 0.875rem;
          color: #374151;
          line-height: 1.6;
        }
        .client-name {
          font-weight: 600;
          font-size: 1rem;
          color: #111827;
        }
        .vendor-name, .company-name {
          font-weight: 600;
          color: #111827;
        }
        .additional-info {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }
        .additional-info div {
          font-size: 0.875rem;
        }
        .additional-info .label {
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 2px;
        }
        .additional-info .value {
          font-weight: 500;
          color: #111827;
        }
        .items-section h3 {
          font-weight: 700;
          color: #111827;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid #d1d5db;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 32px;
        }
        th {
          background-color: #f3f4f6;
          padding: 12px 8px;
          text-align: left;
          font-weight: 600;
          font-size: 0.875rem;
          color: #111827;
          border-bottom: 1px solid #e5e7eb;
        }
        th:nth-child(2), th:nth-child(3), th:nth-child(4) {
          text-align: center;
        }
        th:nth-child(3), th:nth-child(4) {
          text-align: right;
        }
        td {
          padding: 12px 8px;
          font-size: 0.875rem;
          color: #111827;
        }
        .totals-section {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 32px;
        }
        .totals-table {
          width: 256px;
        }
        .totals-table div {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          font-size: 0.875rem;
        }
        .totals-table .total-row {
          border-top: 1px solid #d1d5db;
          padding-top: 8px;
          font-size: 1.125rem;
          font-weight: 700;
        }
        .total-row .label {
          color: #111827;
        }
        .total-row .amount {
          color: #3b82f6;
        }
        .notes-section {
          margin-top: 32px;
          padding: 16px;
          background-color: #f9fafb;
          border-left: 4px solid #3b82f6;
          border-radius-right: 8px;
        }
        .notes-section h4 {
          font-weight: 700;
          color: #111827;
          margin-bottom: 8px;
        }
        .notes-section p {
          font-size: 0.875rem;
          color: #111827;
          white-space: pre-wrap;
          margin: 0;
        }
        .footer {
          margin-top: 32px;
          padding-top: 16px;
          border-top: 1px solid #d1d5db;
          text-align: center;
          font-size: 0.75rem;
          color: #6b7280;
        }
      </style>
    </head>
    <body>
      <div class="po-container">
        <!-- Header Section -->
        <div class="header-section">
          <div>
            <h1 class="po-title">PURCHASE ORDER</h1>
            <div class="po-details">
              <p class="po-number">PO# ${purchaseOrder.poNumber}</p>
              <p>Issue Date: ${purchaseOrder.issueDate}</p>
              <p>Delivery Date: ${purchaseOrder.deliveryDate}</p>
            </div>
          </div>
          <div class="company-logo">
            <span>LOGO</span>
          </div>
        </div>
        <!-- Client, Vendor and Delivery Information -->
        <div class="info-grid">
          <div class="info-section">
            <h3>Client:</h3>
            <p class="client-name">${purchaseOrder.clientName}</p>
            <p>${purchaseOrder.clientAddress}</p>
            <p>${purchaseOrder.clientCity}, ${purchaseOrder.clientState} ${
    purchaseOrder.clientZip
  }</p>
            <p>${purchaseOrder.clientEmail}</p>
            <p style="color: #3b82f6;">${purchaseOrder.clientWebsite}</p>
          </div>
          <div class="info-section">
            <h3>Vendor:</h3>
            <p class="vendor-name">${purchaseOrder.vendorName}</p>
            <p>${purchaseOrder.vendorAddress}</p>
            <p>${purchaseOrder.vendorCity}, ${purchaseOrder.vendorState} ${
    purchaseOrder.vendorZip
  }</p>
            <p>${purchaseOrder.vendorPhone}</p>
            <p>${purchaseOrder.vendorEmail}</p>
          </div>
          <div class="info-section">
            <h3>Delivery Address:</h3>
            <p class="company-name">${purchaseOrder.companyName}</p>
            <p>${purchaseOrder.companyAddress}</p>
            <p>${purchaseOrder.companyCity}, ${purchaseOrder.companyState} ${
    purchaseOrder.companyZip
  }</p>
            <p>${purchaseOrder.companyPhone}</p>
            <p>${purchaseOrder.companyEmail}</p>
          </div>
        </div>
        <!-- Additional Information -->
        <div class="additional-info">
          <div>
            <div class="label">Payment Terms:</div>
            <div class="value">${purchaseOrder.paymentTerms}</div>
          </div>
          <div>
            <div class="label">Authorized By:</div>
            <div class="value">${purchaseOrder.authorizedBy}</div>
          </div>
          <div>
            <div class="label">Department:</div>
            <div class="value">${purchaseOrder.department}</div>
          </div>
        </div>
        <!-- Line Items Table -->
        <div class="items-section">
          <h3>Items:</h3>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${lineItemsHtml}
            </tbody>
          </table>
        </div>
        <!-- Totals -->
        <div class="totals-section">
          <div class="totals-table">
            <div>
              <span>Subtotal:</span>
              <span>${formatCurrency(purchaseOrder.subtotal)}</span>
            </div>
            <div>
              <span>Tax (${purchaseOrder.taxRate}%):</span>
              <span>${formatCurrency(purchaseOrder.taxAmount)}</span>
            </div>
            <div>
              <span>Shipping:</span>
              <span>${formatCurrency(purchaseOrder.shippingCost)}</span>
            </div>
            <div class="total-row">
              <span class="label">Total:</span>
              <span class="amount">${formatCurrency(purchaseOrder.total)}</span>
            </div>
          </div>
        </div>
        ${
          purchaseOrder.notes
            ? `
        <!-- Notes -->
        <div class="notes-section">
          <h4>Notes:</h4>
          <p>${purchaseOrder.notes}</p>
        </div>`
            : ""
        }
        <!-- Footer -->
        <div class="footer">
          <p>${purchaseOrder.clientName} • Purchase Order #${
    purchaseOrder.poNumber
  }</p>
        </div>
      </div>
    </body>
  </html>`;
}

// Centered Purchase Order Template
export function pdfHtmlCenteredPO(purchaseOrder: PurchaseOrderData): string {
  const lineItemsHtml = purchaseOrder.lineItems
    .map(
      (item, index) => `
      <tr ${
        index % 2 === 0
          ? 'style="background-color: #ffffff;"'
          : 'style="background-color: #f9fafb;"'
      }>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb;">${
          item.description
        }</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${
          item.quantity
        }</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(
          item.unitPrice
        )}</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${formatCurrency(
          item.total
        )}</td>
      </tr>
    `
    )
    .join("");

  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>Purchase Order - ${purchaseOrder.poNumber}</title>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap"
        rel="stylesheet"
      />
      <style>
        body {
          font-family: "Inter", sans-serif;
          margin: 0;
          background-color: #ffffff;
          color: #1f2937;
        }
        .po-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 32px;
          background-color: #fff;
        }
        .header-section {
          text-align: center;
          margin-bottom: 32px;
          padding-bottom: 16px;
          border-bottom: 2px solid #3b82f6;
        }
        .company-logo {
          width: 120px;
          height: 120px;
          background-color: #e5e7eb;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          margin: 0 auto 16px auto;
        }
        .po-title {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 16px;
        }
        .po-details {
          text-align: left;
          display: inline-block;
        }
        .po-details p {
          margin: 4px 0;
          font-size: 0.875rem;
          color: #374151;
        }
        .po-number {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 32px;
          margin-bottom: 32px;
        }
        .info-section h3 {
          font-weight: 700;
          color: #111827;
          margin-bottom: 12px;
          padding-bottom: 4px;
          border-bottom: 1px solid #d1d5db;
          font-size: 0.875rem;
        }
        .info-section p {
          margin: 4px 0;
          font-size: 0.875rem;
          color: #374151;
          line-height: 1.6;
        }
        .client-name {
          font-weight: 600;
          font-size: 1rem;
          color: #111827;
        }
        .vendor-name, .company-name {
          font-weight: 600;
          color: #111827;
        }
        .additional-info {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }
        .additional-info div {
          font-size: 0.875rem;
        }
        .additional-info .label {
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 4px;
        }
        .additional-info .value {
          font-weight: 500;
          color: #111827;
        }
        .items-section h3 {
          font-weight: 700;
          color: #111827;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid #d1d5db;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 32px;
        }
        th {
          background-color: #f3f4f6;
          padding: 12px 8px;
          text-align: left;
          font-weight: 600;
          font-size: 0.875rem;
          color: #111827;
          border-bottom: 1px solid #e5e7eb;
        }
        th:nth-child(2), th:nth-child(3), th:nth-child(4) {
          text-align: center;
        }
        th:nth-child(3), th:nth-child(4) {
          text-align: right;
        }
        td {
          padding: 12px 8px;
          font-size: 0.875rem;
          color: #111827;
        }
        .totals-section {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 32px;
        }
        .totals-table {
          width: 256px;
        }
        .totals-table div {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          font-size: 0.875rem;
        }
        .totals-table .total-row {
          border-top: 1px solid #d1d5db;
          padding-top: 8px;
          font-size: 1.125rem;
          font-weight: 700;
        }
        .total-row .label {
          color: #111827;
        }
        .total-row .amount {
          color: #3b82f6;
        }
        .notes-section {
          margin-top: 32px;
          padding: 16px;
          background-color: #f9fafb;
          border-left: 4px solid #3b82f6;
          border-radius-right: 8px;
        }
        .notes-section h4 {
          font-weight: 700;
          color: #111827;
          margin-bottom: 8px;
        }
        .notes-section p {
          font-size: 0.875rem;
          color: #111827;
          white-space: pre-wrap;
          margin: 0;
        }
        .footer {
          margin-top: 32px;
          padding-top: 16px;
          border-top: 1px solid #d1d5db;
          text-align: center;
          font-size: 0.75rem;
          color: #6b7280;
        }
      </style>
    </head>
    <body>
      <div class="po-container">
        <!-- Header Section -->
        <div class="header-section">
          <div class="company-logo">
            <span>LOGO</span>
          </div>
          <h1 class="po-title">PURCHASE ORDER</h1>
          <div class="po-details">
            <p class="po-number">PO# ${purchaseOrder.poNumber}</p>
            <p>Issue Date: ${purchaseOrder.issueDate}</p>
            <p>Delivery Date: ${purchaseOrder.deliveryDate}</p>
          </div>
        </div>

        <!-- Client, Vendor and Delivery Information -->
        <div class="info-grid">
          <div class="info-section">
            <h3>Client:</h3>
            <p class="client-name">${purchaseOrder.clientName}</p>
            <p>${purchaseOrder.clientAddress}</p>
            <p>${purchaseOrder.clientCity}, ${purchaseOrder.clientState} ${
    purchaseOrder.clientZip
  }</p>
            <p>${purchaseOrder.clientEmail}</p>
            <p style="color: #3b82f6;">${purchaseOrder.clientWebsite}</p>
          </div>
          <div class="info-section">
            <h3>Vendor:</h3>
            <p class="vendor-name">${purchaseOrder.vendorName}</p>
            <p>${purchaseOrder.vendorAddress}</p>
            <p>${purchaseOrder.vendorCity}, ${purchaseOrder.vendorState} ${
    purchaseOrder.vendorZip
  }</p>
            <p>${purchaseOrder.vendorPhone}</p>
            <p>${purchaseOrder.vendorEmail}</p>
          </div>
          <div class="info-section">
            <h3>Delivery Address:</h3>
            <p class="company-name">${purchaseOrder.companyName}</p>
            <p>${purchaseOrder.companyAddress}</p>
            <p>${purchaseOrder.companyCity}, ${purchaseOrder.companyState} ${
    purchaseOrder.companyZip
  }</p>
            <p>${purchaseOrder.companyPhone}</p>
            <p>${purchaseOrder.companyEmail}</p>
          </div>
        </div>

        <!-- Additional Information -->
        <div class="additional-info">
          <div>
            <div class="label">Payment Terms:</div>
            <div class="value">${purchaseOrder.paymentTerms}</div>
          </div>
          <div>
            <div class="label">Authorized By:</div>
            <div class="value">${purchaseOrder.authorizedBy}</div>
          </div>
          <div>
            <div class="label">Department:</div>
            <div class="value">${purchaseOrder.department}</div>
          </div>
        </div>

        <!-- Line Items Table -->
        <div class="items-section">
          <h3>Items:</h3>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${lineItemsHtml}
            </tbody>
          </table>
        </div>

        <!-- Totals -->
        <div class="totals-section">
          <div class="totals-table">
            <div>
              <span>Subtotal:</span>
              <span>${formatCurrency(purchaseOrder.subtotal)}</span>
            </div>
            <div>
              <span>Tax (${purchaseOrder.taxRate}%):</span>
              <span>${formatCurrency(purchaseOrder.taxAmount)}</span>
            </div>
            <div>
              <span>Shipping:</span>
              <span>${formatCurrency(purchaseOrder.shippingCost)}</span>
            </div>
            <div class="total-row">
              <span class="label">Total:</span>
              <span class="amount">${formatCurrency(purchaseOrder.total)}</span>
            </div>
          </div>
        </div>

        ${
          purchaseOrder.notes
            ? `
        <!-- Notes -->
        <div class="notes-section">
          <h4>Notes:</h4>
          <p>${purchaseOrder.notes}</p>
        </div>`
            : ""
        }

        <!-- Footer -->
        <div class="footer">
          <p>${purchaseOrder.clientName} • Purchase Order #${
    purchaseOrder.poNumber
  }</p>
        </div>
      </div>
    </body>
  </html>`;
}

// Modern Purchase Order Template
export function pdfHtmlModernPO(purchaseOrder: PurchaseOrderData): string {
  const lineItemsHtml = purchaseOrder.lineItems
    .map(
      (item, index) => `
      <tr ${
        index % 2 === 0
          ? 'style="background-color: #ffffff;"'
          : 'style="background-color: #f9fafb;"'
      }>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb;">${
          item.description
        }</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${
          item.quantity
        }</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(
          item.unitPrice
        )}</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${formatCurrency(
          item.total
        )}</td>
      </tr>
    `
    )
    .join("");

  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>Purchase Order - ${purchaseOrder.poNumber}</title>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap"
        rel="stylesheet"
      />
      <style>
        body {
          font-family: "Inter", sans-serif;
          margin: 0;
          background-color: #ffffff;
          color: #1f2937;
        }
        .po-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 32px;
          background-color: #fff;
        }
        .header-section {
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
        }
        .header-gradient {
          background: linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(59, 130, 246, 0.1));
          margin: -32px -32px 24px -32px;
          padding: 24px 32px;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .company-logo {
          width: 120px;
          height: 120px;
          background-color: #e5e7eb;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
        }
        .header-text h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin: 0 0 4px 0;
        }
        .po-number {
          color: #3b82f6;
          font-weight: 500;
        }
        .header-right {
          text-align: right;
          font-size: 0.875rem;
        }
        .header-right p {
          margin: 2px 0;
          color: #374151;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 32px;
          margin-bottom: 32px;
        }
        .info-section h3 {
          font-weight: 700;
          color: #111827;
          margin-bottom: 12px;
          padding-bottom: 4px;
          border-bottom: 1px solid #d1d5db;
          font-size: 0.875rem;
        }
        .info-section p {
          margin: 4px 0;
          font-size: 0.875rem;
          color: #374151;
          line-height: 1.6;
        }
        .client-name {
          font-weight: 600;
          font-size: 1rem;
          color: #111827;
        }
        .vendor-name, .company-name {
          font-weight: 600;
          color: #111827;
        }
        .additional-info {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }
        .additional-info div {
          font-size: 0.875rem;
        }
        .additional-info .label {
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 2px;
        }
        .additional-info .value {
          font-weight: 500;
          color: #111827;
        }
        .items-section h3 {
          font-weight: 700;
          color: #111827;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid #d1d5db;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 32px;
        }
        th {
          background-color: #f3f4f6;
          padding: 12px 8px;
          text-align: left;
          font-weight: 600;
          font-size: 0.875rem;
          color: #111827;
          border-bottom: 1px solid #e5e7eb;
        }
        th:nth-child(2), th:nth-child(3), th:nth-child(4) {
          text-align: center;
        }
        th:nth-child(3), th:nth-child(4) {
          text-align: right;
        }
        td {
          padding: 12px 8px;
          font-size: 0.875rem;
          color: #111827;
        }
        .totals-section {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 32px;
        }
        .totals-table {
          width: 256px;
        }
        .totals-table div {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          font-size: 0.875rem;
        }
        .totals-table .total-row {
          border-top: 1px solid #d1d5db;
          padding-top: 8px;
          font-size: 1.125rem;
          font-weight: 700;
        }
        .total-row .label {
          color: #111827;
        }
        .total-row .amount {
          color: #111827;
        }
        .notes-section {
          margin-top: 32px;
          padding: 16px;
          background-color: #f9fafb;
          border-left: 4px solid #3b82f6;
          border-radius-right: 8px;
        }
        .notes-section h4 {
          font-weight: 700;
          color: #111827;
          margin-bottom: 8px;
        }
        .notes-section p {
          font-size: 0.875rem;
          color: #111827;
          white-space: pre-wrap;
          margin: 0;
        }
        .footer {
          margin-top: 32px;
          padding-top: 16px;
          border-top: 1px solid #d1d5db;
          text-align: center;
          font-size: 0.75rem;
          color: #6b7280;
        }
      </style>
    </head>
    <body>
      <div class="po-container">
        <!-- Header Section -->
        <div class="header-section">
          <div class="header-gradient">
            <div class="header-content">
              <div class="header-left">
                <div class="company-logo">
                  <span>LOGO</span>
                </div>
                <div class="header-text">
                  <h1>PURCHASE ORDER</h1>
                  <p class="po-number">#${purchaseOrder.poNumber}</p>
                </div>
              </div>
              <div class="header-right">
                <p>Issue: ${purchaseOrder.issueDate}</p>
                <p>Delivery: ${purchaseOrder.deliveryDate}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Client, Vendor and Delivery Information -->
        <div class="info-grid">
          <div class="info-section">
            <h3>Client:</h3>
            <p class="client-name">${purchaseOrder.clientName}</p>
            <p>${purchaseOrder.clientAddress}</p>
            <p>${purchaseOrder.clientCity}, ${purchaseOrder.clientState} ${
    purchaseOrder.clientZip
  }</p>
            <p>${purchaseOrder.clientEmail}</p>
            <p style="color: #3b82f6;">${purchaseOrder.clientWebsite}</p>
          </div>
          <div class="info-section">
            <h3>Vendor:</h3>
            <p class="vendor-name">${purchaseOrder.vendorName}</p>
            <p>${purchaseOrder.vendorAddress}</p>
            <p>${purchaseOrder.vendorCity}, ${purchaseOrder.vendorState} ${
    purchaseOrder.vendorZip
  }</p>
            <p>${purchaseOrder.vendorPhone}</p>
            <p>${purchaseOrder.vendorEmail}</p>
          </div>
          <div class="info-section">
            <h3>Delivery Address:</h3>
            <p class="company-name">${purchaseOrder.companyName}</p>
            <p>${purchaseOrder.companyAddress}</p>
            <p>${purchaseOrder.companyCity}, ${purchaseOrder.companyState} ${
    purchaseOrder.companyZip
  }</p>
            <p>${purchaseOrder.companyPhone}</p>
            <p>${purchaseOrder.companyEmail}</p>
          </div>
        </div>

        <!-- Additional Information -->
        <div class="additional-info">
          <div>
            <div class="label">Payment Terms:</div>
            <div class="value">${purchaseOrder.paymentTerms}</div>
          </div>
          <div>
            <div class="label">Authorized By:</div>
            <div class="value">${purchaseOrder.authorizedBy}</div>
          </div>
          <div>
            <div class="label">Department:</div>
            <div class="value">${purchaseOrder.department}</div>
          </div>
        </div>

        <!-- Line Items Table -->
        <div class="items-section">
          <h3>Items:</h3>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${lineItemsHtml}
            </tbody>
          </table>
        </div>

        <!-- Totals -->
        <div class="totals-section">
          <div class="totals-table">
            <div>
              <span>Subtotal:</span>
              <span>${formatCurrency(purchaseOrder.subtotal)}</span>
            </div>
            <div>
              <span>Tax (${purchaseOrder.taxRate}%):</span>
              <span>${formatCurrency(purchaseOrder.taxAmount)}</span>
            </div>
            <div>
              <span>Shipping:</span>
              <span>${formatCurrency(purchaseOrder.shippingCost)}</span>
            </div>
            <div class="total-row">
              <span class="label">Total:</span>
              <span class="amount">${formatCurrency(purchaseOrder.total)}</span>
            </div>
          </div>
        </div>

        ${
          purchaseOrder.notes
            ? `
        <!-- Notes -->
        <div class="notes-section">
          <h4>Notes:</h4>
          <p>${purchaseOrder.notes}</p>
        </div>`
            : ""
        }

        <!-- Footer -->
        <div class="footer">
          <p>${purchaseOrder.clientName} • Purchase Order #${
    purchaseOrder.poNumber
  }</p>
        </div>
      </div>
    </body>
  </html>`;
}

// Ultra-simplified Purchase Order Template for PDF generation (no external fonts, basic CSS)
export function pdfHtmlSimplePO(purchaseOrder: PurchaseOrderData): string {
  const lineItemsHtml = purchaseOrder.lineItems
    .map(
      (item, index) => `
      <tr style="${
        index % 2 === 0
          ? "background-color: #ffffff;"
          : "background-color: #f9f9f9;"
      }">
        <td style="padding: 8px; border: 1px solid #ddd;">${
          item.description
        }</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${
          item.quantity
        }</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatCurrency(
          item.unitPrice
        )}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">${formatCurrency(
          item.total
        )}</td>
      </tr>
    `
    )
    .join("");

  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>Purchase Order - ${purchaseOrder.poNumber}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 12px;
          line-height: 1.4;
          color: #000;
          margin: 20px;
          background: white;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #0066cc;
        }
        .header h1 {
          font-size: 20px;
          color: #0066cc;
          margin: 0 0 10px 0;
        }
        .po-info {
          font-size: 14px;
          font-weight: bold;
          margin: 5px 0;
        }
        .company-info {
          width: 100%;
          margin: 20px 0;
        }
        .company-info table {
          width: 100%;
          border-collapse: collapse;
        }
        .company-info td {
          width: 33.33%;
          vertical-align: top;
          padding: 10px;
        }
        .section-title {
          font-size: 12px;
          font-weight: bold;
          color: #0066cc;
          border-bottom: 1px solid #ccc;
          padding-bottom: 2px;
          margin-bottom: 8px;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          border: 1px solid #ddd;
        }
        .items-table th {
          background-color: #f0f0f0;
          padding: 8px;
          text-align: left;
          font-weight: bold;
          border: 1px solid #ddd;
        }
        .items-table td {
          padding: 8px;
          border: 1px solid #ddd;
        }
        .totals {
          float: right;
          width: 250px;
          margin: 20px 0;
        }
        .totals table {
          width: 100%;
          border-collapse: collapse;
        }
        .totals td {
          padding: 5px;
          text-align: right;
        }
        .total-row {
          font-weight: bold;
          font-size: 14px;
          border-top: 2px solid #0066cc;
        }
        .notes {
          clear: both;
          margin-top: 30px;
          padding: 10px;
          background-color: #f9f9f9;
          border-left: 4px solid #0066cc;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 10px;
          border-top: 1px solid #ccc;
          font-size: 10px;
          color: #666;
        }
        .clear {
          clear: both;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>PURCHASE ORDER</h1>
        <div class="po-info">PO# ${purchaseOrder.poNumber}</div>
        <div>Issue Date: ${purchaseOrder.issueDate}</div>
        <div>Delivery Date: ${purchaseOrder.deliveryDate}</div>
      </div>

      <div class="company-info">
        <table>
          <tr>
            <td>
              <div class="section-title">Client:</div>
              <strong>${purchaseOrder.clientName}</strong><br>
              ${purchaseOrder.clientAddress}<br>
              ${purchaseOrder.clientCity}, ${purchaseOrder.clientState} ${
    purchaseOrder.clientZip
  }<br>
              ${purchaseOrder.clientEmail}<br>
              ${purchaseOrder.clientWebsite}
            </td>
            <td>
              <div class="section-title">Vendor:</div>
              <strong>${purchaseOrder.vendorName}</strong><br>
              ${purchaseOrder.vendorAddress}<br>
              ${purchaseOrder.vendorCity}, ${purchaseOrder.vendorState} ${
    purchaseOrder.vendorZip
  }<br>
              ${purchaseOrder.vendorPhone}<br>
              ${purchaseOrder.vendorEmail}
            </td>
            <td>
              <div class="section-title">Delivery Address:</div>
              <strong>${purchaseOrder.companyName}</strong><br>
              ${purchaseOrder.companyAddress}<br>
              ${purchaseOrder.companyCity}, ${purchaseOrder.companyState} ${
    purchaseOrder.companyZip
  }<br>
              ${purchaseOrder.companyPhone}<br>
              ${purchaseOrder.companyEmail}
            </td>
          </tr>
        </table>
      </div>

      <div class="company-info">
        <table>
          <tr>
            <td>
              <strong>Payment Terms:</strong> ${purchaseOrder.paymentTerms}
            </td>
            <td>
              <strong>Authorized By:</strong> ${purchaseOrder.authorizedBy}
            </td>
            <td>
              <strong>Department:</strong> ${purchaseOrder.department}
            </td>
          </tr>
        </table>
      </div>

      <table class="items-table">
        <thead>
          <tr>
            <th>Description</th>
            <th style="text-align: center;">Quantity</th>
            <th style="text-align: right;">Unit Price</th>
            <th style="text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${lineItemsHtml}
        </tbody>
      </table>

      <div class="totals">
        <table>
          <tr>
            <td>Subtotal:</td>
            <td>${formatCurrency(purchaseOrder.subtotal)}</td>
          </tr>
          <tr>
            <td>Tax (${purchaseOrder.taxRate}%):</td>
            <td>${formatCurrency(purchaseOrder.taxAmount)}</td>
          </tr>
          <tr>
            <td>Shipping:</td>
            <td>${formatCurrency(purchaseOrder.shippingCost)}</td>
          </tr>
          <tr class="total-row">
            <td>Total:</td>
            <td>${formatCurrency(purchaseOrder.total)}</td>
          </tr>
        </table>
      </div>
      
      <div class="clear"></div>

      ${
        purchaseOrder.notes
          ? `
      <div class="notes">
        <strong>Notes:</strong><br>
        ${purchaseOrder.notes}
      </div>`
          : ""
      }

      <div class="footer">
        ${purchaseOrder.clientName} • Purchase Order #${purchaseOrder.poNumber}
      </div>
    </body>
  </html>`;
}

// Legacy template exports (for backwards compatibility)
export const classicTemplate = "Use pdfHtmlClassicPO() function instead";
export const centeredTemplate = "Use pdfHtmlCenteredPO() function instead";
export const modernTemplate = "Use pdfHtmlModernPO() function instead";
