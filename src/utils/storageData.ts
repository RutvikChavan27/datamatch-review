import { FolderNode, Document, IndexForm, FormField } from '@/types/storage';

// Mock folder structure
export const mockFolderStructure: FolderNode = {
  id: 'root',
  name: 'All Documents',
  type: 'storage',
  docCount: 15420,
  size: '2.3 TB',
  created: new Date('2023-01-01'),
  createdBy: 'System',
  children: [
    {
      id: 'finance',
      name: 'Finance Department',
      type: 'department',
      docCount: 8750,
      size: '1.2 TB',
      parentId: 'root',
      created: new Date('2023-01-15'),
      createdBy: 'Admin',
      children: [
        {
          id: 'fin-active',
          name: 'Active Projects',
          type: 'project',
          docCount: 2340,
          size: '650 GB',
          parentId: 'finance',
          created: new Date('2023-02-01'),
          createdBy: 'Finance Manager',
          children: [
            {
              id: 'fin-active-q1',
              name: 'Q1 2024 Projects',
              type: 'project',
              docCount: 580,
              size: '1.7 GB',
              parentId: 'fin-active',
              created: new Date('2024-01-01'),
              createdBy: 'Project Manager',
            },
            {
              id: 'fin-active-q2',
              name: 'Q2 2024 Projects',
              type: 'project',
              docCount: 230,
              size: '890 MB',
              parentId: 'fin-active',
              created: new Date('2024-04-01'),
              createdBy: 'Project Manager',
            },
            {
              id: 'fin-active-budgets',
              name: 'Budget Reviews',
              type: 'project',
              docCount: 145,
              size: '2.3 GB',
              parentId: 'fin-active',
              created: new Date('2024-01-15'),
              createdBy: 'Budget Analyst',
            }
          ]
        },
        {
          id: 'fin-archived',
          name: 'Archived',
          type: 'archived',
          docCount: 5200,
          size: '480 GB',
          parentId: 'finance',
          created: new Date('2023-01-20'),
          createdBy: 'Finance Manager',
        },
        {
          id: 'fin-templates',
          name: 'Templates',
          type: 'project',
          docCount: 180,
          size: '15 GB',
          parentId: 'finance',
          created: new Date('2023-01-25'),
          createdBy: 'Finance Manager',
        },
        {
          id: 'fin-invoices',
          name: 'Invoices 2024',
          type: 'project',
          docCount: 1030,
          size: '85 GB',
          parentId: 'finance',
          created: new Date('2024-01-01'),
          createdBy: 'Finance Manager',
        }
      ]
    },
    {
      id: 'hr',
      name: 'Human Resources',
      type: 'department',
      docCount: 3420,
      size: '450 GB',
      parentId: 'root',
      created: new Date('2023-01-15'),
      createdBy: 'Admin',
      children: [
        {
          id: 'hr-personnel',
          name: 'Personnel Files',
          type: 'project',
          docCount: 1850,
          size: '250 GB',
          parentId: 'hr',
          created: new Date('2023-02-01'),
          createdBy: 'HR Manager',
          children: [
            {
              id: 'hr-personnel-active',
              name: 'Active Employees',
              type: 'project',
              docCount: 420,
              size: '85 GB',
              parentId: 'hr-personnel',
              created: new Date('2024-01-01'),
              createdBy: 'HR Specialist',
            },
            {
              id: 'hr-personnel-terminated',
              name: 'Terminated Employees',
              type: 'archived',
              docCount: 180,
              size: '45 GB',
              parentId: 'hr-personnel',
              created: new Date('2023-06-01'),
              createdBy: 'HR Manager',
            },
            {
              id: 'hr-personnel-contractors',
              name: 'Contractors & Consultants',
              type: 'project',
              docCount: 95,
              size: '15 GB',
              parentId: 'hr-personnel',
              created: new Date('2024-02-01'),
              createdBy: 'Contract Manager',
            }
          ]
        },
        {
          id: 'hr-policies',
          name: 'Policies & Procedures',
          type: 'project',
          docCount: 320,
          size: '45 GB',
          parentId: 'hr',
          created: new Date('2023-01-20'),
          createdBy: 'HR Manager',
        },
        {
          id: 'hr-training',
          name: 'Training Materials',
          type: 'project',
          docCount: 1250,
          size: '155 GB',
          parentId: 'hr',
          created: new Date('2023-03-01'),
          createdBy: 'Training Coordinator',
        }
      ]
    },
    {
      id: 'operations',
      name: 'Operations',
      type: 'department',
      docCount: 2180,
      size: '380 GB',
      parentId: 'root',
      created: new Date('2023-01-15'),
      createdBy: 'Admin',
      children: [
        {
          id: 'ops-procedures',
          name: 'Standard Procedures',
          type: 'project',
          docCount: 680,
          size: '120 GB',
          parentId: 'operations',
          created: new Date('2023-02-15'),
          createdBy: 'Operations Manager',
          children: [
            {
              id: 'ops-procedures-manufacturing',
              name: 'Manufacturing SOPs',
              type: 'project',
              docCount: 320,
              size: '3.2 GB',
              parentId: 'ops-procedures',
              created: new Date('2024-01-01'),
              createdBy: 'Manufacturing Manager',
            },
            {
              id: 'ops-procedures-safety',
              name: 'Safety Protocols',
              type: 'project',
              docCount: 155,
              size: '1.8 GB',
              parentId: 'ops-procedures',
              created: new Date('2024-01-15'),
              createdBy: 'Safety Officer',
            }
          ]
        },
        {
          id: 'ops-reports',
          name: 'Monthly Reports',
          type: 'project',
          docCount: 720,
          size: '95 GB',
          parentId: 'operations',
          created: new Date('2023-01-25'),
          createdBy: 'Operations Manager',
        },
        {
          id: 'ops-quality',
          name: 'Quality Control',
          type: 'project',
          docCount: 780,
          size: '165 GB',
          parentId: 'operations',
          created: new Date('2023-03-01'),
          createdBy: 'Quality Manager',
        }
      ]
    },
    {
      id: 'it',
      name: 'IT Department',
      type: 'department',
      docCount: 890,
      size: '220 GB',
      parentId: 'root',
      created: new Date('2023-01-15'),
      createdBy: 'Admin',
      children: [
        {
          id: 'it-documentation',
          name: 'System Documentation',
          type: 'project',
          docCount: 450,
          size: '85 GB',
          parentId: 'it',
          created: new Date('2023-02-01'),
          createdBy: 'IT Manager',
        },
        {
          id: 'it-security',
          name: 'Security Policies',
          type: 'project',
          docCount: 180,
          size: '25 GB',
          parentId: 'it',
          created: new Date('2023-01-30'),
          createdBy: 'Security Officer',
        },
        {
          id: 'it-backups',
          name: 'Backup Procedures',
          type: 'project',
          docCount: 260,
          size: '110 GB',
          parentId: 'it',
          created: new Date('2023-02-15'),
          createdBy: 'IT Manager',
        }
      ]
    },
    {
      id: 'legal',
      name: 'Legal Department',
      type: 'department',
      docCount: 1180,
      size: '95 GB',
      parentId: 'root',
      created: new Date('2023-01-15'),
      createdBy: 'Admin',
      children: [
        {
          id: 'legal-contracts',
          name: 'Contracts',
          type: 'project',
          docCount: 620,
          size: '45 GB',
          parentId: 'legal',
          created: new Date('2023-02-01'),
          createdBy: 'Legal Counsel',
        },
        {
          id: 'legal-compliance',
          name: 'Compliance Documents',
          type: 'project',
          docCount: 280,
          size: '25 GB',
          parentId: 'legal',
          created: new Date('2023-01-25'),
          createdBy: 'Compliance Officer',
        },
        {
          id: 'legal-archived',
          name: 'Archived Legal Files',
          type: 'archived',
          docCount: 280,
          size: '25 GB',
          parentId: 'legal',
          created: new Date('2023-01-20'),
          createdBy: 'Legal Counsel',
        }
      ]
    }
  ]
};

// Mock documents for folders
export const mockDocuments: { [folderId: string]: Document[] } = {
  'fin-active': [
    {
      id: 'doc-1',
      name: 'Q4 Budget Analysis.pdf',
      type: 'pdf',
      size: '2.4 MB',
      modified: new Date('2024-01-15'),
      created: new Date('2024-01-10'),
      createdBy: 'Finance Analyst',
      folderId: 'fin-active',
      url: '/lovable-uploads/40a647b5-00f5-4bd4-825e-8b58cca2e7c2.png',
      workflowStatus: 'completed'
    },
    {
      id: 'doc-2',
      name: 'Expense Report Template.xlsx',
      type: 'xls',
      size: '156 KB',
      modified: new Date('2024-01-12'),
      created: new Date('2024-01-05'),
      createdBy: 'Finance Manager',
      folderId: 'fin-active',
      url: '/lovable-uploads/dd02edfb-b909-4512-a7c0-542a9b5663b1.png',
      workflowStatus: 'pending'
    },
    {
      id: 'doc-3',
      name: 'Purchase Order PO-2024-0456.pdf',
      type: 'pdf',
      size: '1.8 MB',
      modified: new Date('2024-01-14'),
      created: new Date('2024-01-08'),
      createdBy: 'Procurement Officer',
      folderId: 'fin-active',
      url: '/lovable-uploads/00aad332-2016-4d6e-a7be-aca80f0f4d7f.png',
      workflowStatus: 'processing'
    },
    {
      id: 'doc-4',
      name: 'Invoice INV-2024-0789.pdf',
      type: 'pdf',
      size: '950 KB',
      modified: new Date('2024-01-13'),
      created: new Date('2024-01-07'),
      createdBy: 'Accounts Payable',
      folderId: 'fin-active',
      url: '/lovable-uploads/fe9ef048-4144-4080-b58f-6cbe02f0092c.png',
      workflowStatus: 'completed'
    },
    {
      id: 'doc-5',
      name: 'Contract Amendment.docx',
      type: 'doc',
      size: '245 KB',
      modified: new Date('2024-01-11'),
      created: new Date('2024-01-04'),
      createdBy: 'Legal Team',
      folderId: 'fin-active',
      url: '/lovable-uploads/8d20aef4-a52a-4ed0-81da-2967f1edeb99.png',
      workflowStatus: 'failed'
    }
  ],
  'hr-personnel': [
    {
      id: 'doc-6',
      name: 'Employee Handbook 2024.pdf',
      type: 'pdf',
      size: '5.2 MB',
      modified: new Date('2024-01-10'),
      created: new Date('2024-01-01'),
      createdBy: 'HR Manager',
      folderId: 'hr-personnel',
      url: '/lovable-uploads/9350d5be-a2a4-40bf-bed5-2cfe0c53c749.png',
      workflowStatus: 'completed'
    },
    {
      id: 'doc-7',
      name: 'Performance Review Template.xlsx',
      type: 'xls',
      size: '89 KB',
      modified: new Date('2024-01-09'),
      created: new Date('2023-12-15'),
      createdBy: 'HR Specialist',
      folderId: 'hr-personnel',
      url: '/lovable-uploads/c24bf7a8-2cc8-4ae6-9497-8bc1716e1451.png',
      workflowStatus: 'completed'
    },
    {
      id: 'doc-8',
      name: 'Onboarding Checklist.docx',
      type: 'doc',
      size: '125 KB',
      modified: new Date('2024-01-08'),
      created: new Date('2023-12-20'),
      createdBy: 'HR Coordinator',
      folderId: 'hr-personnel',
      url: '/lovable-uploads/ea5c7c4b-cbd2-4fe4-842a-0ecc8485c9c7.png',
      workflowStatus: 'pending'
    }
  ],
  'ops-procedures': [
    {
      id: 'doc-9',
      name: 'Standard Operating Procedure.pdf',
      type: 'pdf',
      size: '3.1 MB',
      modified: new Date('2024-01-07'),
      created: new Date('2023-12-10'),
      createdBy: 'Operations Manager',
      folderId: 'ops-procedures',
      url: '/lovable-uploads/e985abc6-5657-4a27-9ac2-09e11b193728.png',
      workflowStatus: 'completed'
    },
    {
      id: 'doc-10',
      name: 'Quality Control Checklist.xlsx',
      type: 'xls',
      size: '78 KB',
      modified: new Date('2024-01-06'),
      created: new Date('2023-12-05'),
      createdBy: 'Quality Manager',
      folderId: 'ops-procedures',
      url: '/lovable-uploads/f0c1a91c-b05a-4693-aac8-540f63f64924.png',
      workflowStatus: 'processing'
    }
  ]
};

// Generate additional documents for other folders
const generateDocumentsForFolder = (folderId: string, count: number): Document[] => {
  const baseDocuments = [
    { name: 'Annual Report', type: 'pdf' as const, size: '2.1 MB' },
    { name: 'Project Proposal', type: 'doc' as const, size: '456 KB' },
    { name: 'Budget Spreadsheet', type: 'xls' as const, size: '89 KB' },
    { name: 'Meeting Minutes', type: 'pdf' as const, size: '234 KB' },
    { name: 'Policy Document', type: 'doc' as const, size: '567 KB' },
    { name: 'Data Analysis', type: 'xls' as const, size: '1.2 MB' },
    { name: 'Training Material', type: 'pdf' as const, size: '3.4 MB' },
    { name: 'Compliance Report', type: 'pdf' as const, size: '890 KB' }
  ];

  const statuses: ('pending' | 'processing' | 'completed' | 'failed')[] = 
    ['pending', 'processing', 'completed', 'completed', 'completed', 'failed'];

  const urls = [
    '/lovable-uploads/40a647b5-00f5-4bd4-825e-8b58cca2e7c2.png',
    '/lovable-uploads/dd02edfb-b909-4512-a7c0-542a9b5663b1.png',
    '/lovable-uploads/00aad332-2016-4d6e-a7be-aca80f0f4d7f.png',
    '/lovable-uploads/fe9ef048-4144-4080-b58f-6cbe02f0092c.png',
    '/lovable-uploads/8d20aef4-a52a-4ed0-81da-2967f1edeb99.png',
    '/lovable-uploads/9350d5be-a2a4-40bf-bed5-2cfe0c53c749.png'
  ];

  const users = ['Manager', 'Analyst', 'Coordinator', 'Specialist', 'Officer'];

  return Array.from({ length: count }, (_, index) => {
    const baseDoc = baseDocuments[index % baseDocuments.length];
    const dayOffset = Math.floor(Math.random() * 30);
    const created = new Date();
    created.setDate(created.getDate() - dayOffset - 5);
    const modified = new Date(created);
    modified.setDate(modified.getDate() + Math.floor(Math.random() * 5));

    return {
      id: `${folderId}-doc-${index + 1}`,
      name: `${baseDoc.name} ${index + 1}.${baseDoc.type === 'xls' ? 'xlsx' : baseDoc.type === 'doc' ? 'docx' : 'pdf'}`,
      type: baseDoc.type,
      size: baseDoc.size,
      modified,
      created,
      createdBy: `${folderId.split('-')[0].toUpperCase()} ${users[index % users.length]}`,
      folderId,
      url: urls[index % urls.length],
      workflowStatus: statuses[index % statuses.length]
    };
  });
};

// Add generated documents to all folders including parent folders with subfolders
const allFolderIds = [
  // Root level folders with mixed content (subfolders + documents)
  'finance', 'hr', 'operations', 'it', 'legal',
  // Mid-level folders with mixed content
  'fin-active', 'hr-personnel', 'ops-procedures',
  // Leaf folders
  'fin-archived', 'fin-templates', 'fin-invoices',
  'fin-active-q1', 'fin-active-q2', 'fin-active-budgets',
  'hr-policies', 'hr-training', 
  'hr-personnel-active', 'hr-personnel-terminated', 'hr-personnel-contractors',
  'ops-reports', 'ops-quality',
  'ops-procedures-manufacturing', 'ops-procedures-safety',
  'it-documentation', 'it-security', 'it-backups',
  'legal-contracts', 'legal-compliance', 'legal-archived'
];

allFolderIds.forEach(folderId => {
  if (!mockDocuments[folderId]) {
    // Generate fewer documents for parent folders, more for leaf folders
    const isParentFolder = ['finance', 'hr', 'operations', 'it', 'legal', 'fin-active', 'hr-personnel', 'ops-procedures'].includes(folderId);
    const count = isParentFolder ? Math.floor(Math.random() * 8) + 3 : Math.floor(Math.random() * 15) + 5; // 3-10 for parents, 5-20 for leaves
    mockDocuments[folderId] = generateDocumentsForFolder(folderId, count);
  }
});

// Mock index forms
export const mockIndexForms: IndexForm[] = [
  {
    id: 'form-invoice',
    name: 'Invoice Processing Form',
    fields: [
      { id: 'invoice-number', label: 'Invoice Number', type: 'text', required: true },
      { id: 'vendor', label: 'Vendor', type: 'text', required: true },
      { id: 'amount', label: 'Total Amount', type: 'number', required: true },
      { id: 'date', label: 'Invoice Date', type: 'date', required: true },
      { id: 'po-number', label: 'PO Number', type: 'text', required: false },
      { id: 'department', label: 'Department', type: 'select', required: true, options: ['Finance', 'HR', 'Operations', 'IT', 'Legal'] }
    ]
  },
  {
    id: 'form-contract',
    name: 'Contract Management Form',
    fields: [
      { id: 'contract-number', label: 'Contract Number', type: 'text', required: true },
      { id: 'party-name', label: 'Contracting Party', type: 'text', required: true },
      { id: 'start-date', label: 'Start Date', type: 'date', required: true },
      { id: 'end-date', label: 'End Date', type: 'date', required: true },
      { id: 'value', label: 'Contract Value', type: 'number', required: false },
      { id: 'type', label: 'Contract Type', type: 'select', required: true, options: ['Service Agreement', 'Purchase Contract', 'Employment Contract', 'NDA'] }
    ]
  },
  {
    id: 'form-general',
    name: 'General Document Form',
    fields: [
      { id: 'title', label: 'Document Title', type: 'text', required: true },
      { id: 'category', label: 'Category', type: 'select', required: true, options: ['Policy', 'Procedure', 'Report', 'Correspondence', 'Other'] },
      { id: 'description', label: 'Description', type: 'textarea', required: false },
      { id: 'priority', label: 'Priority', type: 'select', required: false, options: ['High', 'Medium', 'Low'] }
    ]
  }
];

// Helper function to get documents for a folder
export const getDocumentsForFolder = (folderId: string): Document[] => {
  return mockDocuments[folderId] || [];
};

// Helper function to get mixed content (subfolders + documents) for a folder
export const getMixedContentForFolder = (folderId: string): { folders: FolderNode[], documents: Document[] } => {
  const folder = getFolderById(folderId);
  const folders = folder?.children || [];
  const documents = mockDocuments[folderId] || [];
  
  return { folders, documents };
};

// Helper function to get folder by id
export const getFolderById = (id: string, node: FolderNode = mockFolderStructure): FolderNode | null => {
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