import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import WorkspaceDocumentDetailView from './WorkspaceDocumentDetailView';
import { Document } from '@/types/storage';

const WorkspaceDocumentView = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();

  // Get document data from Recent Documents table
  const getDocumentById = (id: string) => {
    const recentDocumentsData = [
      {
        id: 'doc1',
        documentName: 'Patient Record_2_2_1799_9276_17561879699751113590.pdf',
        createdDate: '08/27/2025 10:34:24',
        modifiedDate: '08/27/2025 10:34:24',
        dateAccessed: '08/27/2025 10:35:15'
      },
      {
        id: 'doc2',
        documentName: 'Veritas_1_2_474_1041_17563051375562164028.pdf',
        createdDate: '08/27/2025 02:50:10',
        modifiedDate: '08/27/2025 02:50:10',
        dateAccessed: '08/27/2025 02:50:24'
      },
      {
        id: 'doc3',
        documentName: 'Veritas_1_2_471_877_17562772872114175114.pdf',
        createdDate: '08/27/2025 02:44:20',
        modifiedDate: '08/27/2025 02:44:20',
        dateAccessed: '08/27/2025 02:44:54'
      },
      {
        id: 'doc4',
        documentName: 'Patient Record_2_2_470_876_17562768693903399695.pdf',
        createdDate: '08/26/2025 02:02:00',
        modifiedDate: '08/26/2025 02:02:01',
        dateAccessed: '08/26/2025 02:02:49'
      },
      {
        id: 'doc5',
        documentName: 'Veritas_1_2_1788_9215_17561725332048112896.pdf',
        createdDate: '08/25/2025 09:43:26',
        modifiedDate: '08/25/2025 09:43:27',
        dateAccessed: '08/25/2025 09:45:54'
      },
      {
        id: 'doc6',
        documentName: 'Patient Record_2_2_1788_9216_17561725334293676757.pdf',
        createdDate: '08/25/2025 09:44:24',
        modifiedDate: '08/25/2025 09:44:24',
        dateAccessed: '08/25/2025 09:44:41'
      },
      {
        id: 'doc7',
        documentName: 'Veritas_1_2_1775_9201_17561399121901115071.pdf',
        createdDate: '08/24/2025 14:22:10',
        modifiedDate: '08/24/2025 14:22:10',
        dateAccessed: '08/24/2025 14:25:33'
      },
      {
        id: 'doc8',
        documentName: 'Patient Records_2_2_429_796_17550127147545741067.pdf',
        createdDate: '08/24/2025 11:15:45',
        modifiedDate: '08/24/2025 11:15:45',
        dateAccessed: '08/24/2025 11:18:12'
      },
      {
        id: 'doc9',
        documentName: 'Veritas_1_2_1413_3782_17548459233558924285.pdf',
        createdDate: '08/23/2025 16:30:22',
        modifiedDate: '08/23/2025 16:30:22',
        dateAccessed: '08/23/2025 16:35:18'
      },
      {
        id: 'doc10',
        documentName: 'Loan_5_3_247_918_17551674539860733331.pdf',
        createdDate: '08/23/2025 09:12:55',
        modifiedDate: '08/23/2025 09:12:55',
        dateAccessed: '08/23/2025 09:20:41'
      },
      {
        id: 'doc11',
        documentName: 'Veritas_33_1744031523.pdf',
        createdDate: '08/22/2025 15:30:12',
        modifiedDate: '08/22/2025 15:30:12',
        dateAccessed: '08/22/2025 15:32:28'
      },
      {
        id: 'doc12',
        documentName: 'Loan_123_451_28.pdf',
        createdDate: '08/22/2025 11:45:33',
        modifiedDate: '08/22/2025 11:45:33',
        dateAccessed: '08/22/2025 11:48:15'
      },
      {
        id: 'doc13',
        documentName: 'Loan_5_2_429_796_17550127157798693391.pdf',
        createdDate: '08/21/2025 16:22:44',
        modifiedDate: '08/21/2025 16:22:44',
        dateAccessed: '08/21/2025 16:25:11'
      },
      {
        id: 'doc14',
        documentName: 'Veritas_1_2_1723_8941_17560562442639995744.pdf',
        createdDate: '08/21/2025 13:18:55',
        modifiedDate: '08/21/2025 13:18:55',
        dateAccessed: '08/21/2025 13:22:33'
      },
      {
        id: 'doc15',
        documentName: 'Veritas_45_1744076814.pdf',
        createdDate: '08/20/2025 09:55:17',
        modifiedDate: '08/20/2025 09:55:17',
        dateAccessed: '08/20/2025 09:58:42'
      },
      {
        id: 'doc16',
        documentName: 'Veritas_1_2_1490_3896_17551693745979224055.pdf',
        createdDate: '08/20/2025 08:33:28',
        modifiedDate: '08/20/2025 08:33:28',
        dateAccessed: '08/20/2025 08:36:14'
      },
      {
        id: 'doc17',
        documentName: 'Veritas1_1_2_1599_4558_17557830475551619951.pdf',
        createdDate: '08/19/2025 14:12:39',
        modifiedDate: '08/19/2025 14:12:39',
        dateAccessed: '08/19/2025 14:15:55'
      }
    ];
    
    return recentDocumentsData.find(doc => doc.id === id);
  };

  const currentDocument = getDocumentById(documentId || '');

  if (!currentDocument) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Document Not Found</h2>
          <p className="text-gray-600">The requested document could not be found.</p>
        </div>
      </div>
    );
  }

  // Convert Recent Document to Document format for the detail view
  const mockDocument: Document = {
    id: currentDocument.id,
    name: currentDocument.documentName,
    type: 'pdf',
    size: '2.4 MB',
    url: '/lovable-uploads/40a647b5-00f5-4bd4-825e-8b58cca2e7c2.png',
    folderId: 'recent',
    tags: ['recent-document'],
    created: new Date(currentDocument.createdDate),
    modified: new Date(currentDocument.modifiedDate),
    createdBy: 'System',
    isProcessed: true,
    workflowStatus: 'completed',
    version: 1,
    originalName: currentDocument.documentName
  };

  const handleClose = () => {
    navigate('/workspace');
  };

  // Custom breadcrumb for Recent Documents context
  const customBreadcrumb = (
    <div className="mb-3 pt-3">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <button 
          onClick={() => navigate('/workspace')}
          className="font-medium hover:text-primary cursor-pointer"
        >
          Workspace
        </button>
        <span>›</span>
        <span>Recent Documents</span>
        <span>›</span>
        <span className="text-foreground">{currentDocument.documentName}</span>
      </div>
    </div>
  );

  return (
    <WorkspaceDocumentDetailView 
      document={mockDocument} 
      onClose={handleClose}
    />
  );
};

export default WorkspaceDocumentView;