import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card } from '@/components/ui/card';

interface IssueItem {
  id: string;
  type: 'price' | 'quantity' | 'date' | 'signature';
  title: string;
  quantity: string;
  unitPrice: string;
  glCode?: string;
  lineTotal: string;
  docType: 'po' | 'invoice' | 'grn';
}

interface PerfectItem {
  id: string;
  title: string;
  quantity: string;
  unitPrice: string;
  glCode: string;
  lineTotal: string;
}

const issuesData: IssueItem[] = [
  {
    id: 'issue-1',
    type: 'price',
    title: 'Office Supply Kit Standard',
    quantity: '12',
    unitPrice: '$10.00',
    glCode: '5010',
    lineTotal: '$120.00',
    docType: 'po'
  },
  {
    id: 'issue-2',
    type: 'price',
    title: 'Office Supplies Set Premium',
    quantity: '12',
    unitPrice: '$10.00',
    glCode: '5010',
    lineTotal: '$126.00',
    docType: 'invoice'
  },
  {
    id: 'issue-3',
    type: 'price',
    title: 'Office Supply Kit',
    quantity: '12',
    unitPrice: '$10.00',
    glCode: '5010',
    lineTotal: '$100.00',
    docType: 'grn'
  },
  {
    id: 'issue-4',
    type: 'quantity',
    title: 'Name variations need fuzzy match',
    quantity: '10',
    unitPrice: '$10.50',
    glCode: '5010',
    lineTotal: '$105.00',
    docType: 'grn'
  }
];

const perfectData: PerfectItem[] = [
  {
    id: 'perfect-1',
    title: 'Dell XPS 13',
    quantity: '5',
    unitPrice: '$1,700.00',
    glCode: '6020',
    lineTotal: '$8,500.00'
  },
  {
    id: 'perfect-2',
    title: 'Dell XPS 13',
    quantity: '5',
    unitPrice: '$1,700.00',
    glCode: '6020',
    lineTotal: '$8,500.00'
  },
  {
    id: 'perfect-3',
    title: 'Dell XPS 13',
    quantity: '5',
    unitPrice: '$1,700.00',
    glCode: '6020',
    lineTotal: '$8,500.00'
  }
];

export const AllDocsTab: React.FC = () => {
  const [issuesOpen, setIssuesOpen] = useState(true);
  const [perfectOpen, setPerfectOpen] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [poZoom, setPoZoom] = useState(100);
  const [invoiceZoom, setInvoiceZoom] = useState(100);
  const [grnZoom, setGrnZoom] = useState(100);

  const handleZoom = (docType: 'po' | 'invoice' | 'grn', direction: 'in' | 'out') => {
    const setter = docType === 'po' ? setPoZoom : docType === 'invoice' ? setInvoiceZoom : setGrnZoom;
    setter(prev => {
      if (direction === 'in') {
        return Math.min(prev + 25, 200);
      } else {
        return Math.max(prev - 25, 50);
      }
    });
  };

  const getHighlightClass = (docType: string) => {
    if (!hoveredItem) return '';
    
    const hoveredIssue = issuesData.find(issue => issue.id === hoveredItem);
    if (hoveredIssue && hoveredIssue.docType === docType) {
      return 'ring-2 ring-error shadow-lg scale-105';
    }
    
    return '';
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left Panel - width adjusted to card width */}
      <div className="w-80 bg-background flex flex-col h-full">
        <div className="p-6 space-y-6 overflow-y-auto scrollbar-container" style={{ height: 'calc(100vh - 120px)' }}>
        {/* 4 Issues Group */}
        <Collapsible open={issuesOpen} onOpenChange={setIssuesOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left pr-0">
            <h3 className="text-base font-semibold text-red-600 flex items-center gap-2 pl-0">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              4 Issues
            </h3>
            {issuesOpen ? (
              <ChevronUp className="h-4 w-4 text-text-weak" />
            ) : (
              <ChevronDown className="h-4 w-4 text-text-weak" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-3">
            {issuesData.map((issue) => (
              <Card
                key={issue.id}
                className="p-4 rounded-xl shadow-md border-border cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onMouseEnter={() => setHoveredItem(issue.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                 <div className="mb-3">
                  <div className="text-sm font-semibold text-foreground">{issue.title}</div>
                </div>
                 <div className="space-y-2">
                  <div className="flex justify-between items-center">
                     <div className="text-sm text-muted-foreground">Quantity</div>
                    <div className="text-sm font-medium text-foreground">{issue.quantity}</div>
                  </div>
                  <div className="flex justify-between items-center">
                     <div className="text-sm text-muted-foreground">Unit Price</div>
                    <div className="text-sm font-medium text-foreground">{issue.unitPrice}</div>
                  </div>
                  {issue.glCode && (
                    <div className="flex justify-between items-center">
                       <div className="text-sm text-muted-foreground">GL Code</div>
                      <div className="text-sm font-medium text-foreground">{issue.glCode}</div>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                     <div className="text-sm text-muted-foreground">Line Total</div>
                    <div className="text-sm font-medium text-foreground">{issue.lineTotal}</div>
                  </div>
                </div>
              </Card>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Perfect Group */}
        <Collapsible open={perfectOpen} onOpenChange={setPerfectOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left pr-0">
            <h3 className="text-base font-semibold text-green-600 flex items-center gap-2 pl-0">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Perfect
            </h3>
            {perfectOpen ? (
              <ChevronUp className="h-4 w-4 text-text-weak" />
            ) : (
              <ChevronDown className="h-4 w-4 text-text-weak" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-3">
            {perfectData.map((perfect) => (
              <Card
                key={perfect.id}
                className="p-4 rounded-xl shadow-md border-border bg-gradient-to-r from-card to-muted/20"
              >
                <div className="mb-3">
                  <div className="text-sm font-semibold text-foreground">{perfect.title}</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">Quantity</div>
                    <div className="text-sm font-medium text-foreground">{perfect.quantity}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">Unit Price</div>
                    <div className="text-sm font-medium text-foreground">{perfect.unitPrice}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">GL Code</div>
                    <div className="text-sm font-medium text-foreground">{perfect.glCode}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">Line Total</div>
                    <div className="text-sm font-medium text-foreground">{perfect.lineTotal}</div>
                  </div>
                </div>
              </Card>
            ))}
          </CollapsibleContent>
        </Collapsible>
        </div>
      </div>

      {/* Right Panel with #212C4C background */}
      <div className="flex-1 pt-4 px-4 overflow-hidden" style={{ backgroundColor: '#212C4C' }}>
        <div className="h-full flex flex-col">
          {/* Document Previews */}
          <div className="flex-1 grid grid-cols-3 gap-4">
            {/* Purchase Order Preview */}
            <div className={`rounded-lg overflow-hidden transition-all duration-300 ${getHighlightClass('po')}`}>
              <div className="p-2 flex items-center justify-between" style={{ backgroundColor: '#1a2332' }}>
                <h4 className="text-sm font-medium text-white truncate max-w-48">Purchase Order PO-2024-0456.pdf</h4>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-300 mr-2">{poZoom}%</span>
                  <button 
                    className="p-1 hover:bg-gray-700 rounded transition-colors text-white"
                    onClick={() => handleZoom('po', 'out')}
                    disabled={poZoom <= 50}
                  >
                    <ZoomOut className="w-3 h-3" />
                  </button>
                  <button 
                    className="p-1 hover:bg-gray-700 rounded transition-colors text-white"
                    onClick={() => handleZoom('po', 'in')}
                    disabled={poZoom >= 200}
                  >
                    <ZoomIn className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="aspect-[3/4] flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#212C4C' }}>
                <img 
                  src="/lovable-uploads/40a647b5-00f5-4bd4-825e-8b58cca2e7c2.png"
                  alt="Purchase Order Document"
                  className="w-full h-full object-contain transition-transform duration-200"
                  style={{ transform: `scale(${poZoom / 100})` }}
                />
                {/* 4 Highlight overlays for hovered data */}
                {hoveredItem && issuesData.find(issue => issue.id === hoveredItem && issue.docType === 'po') && (
                  <>
                    <div className="highlight absolute top-16 left-20">
                      <div className="highlight2"></div>
                    </div>
                    <div className="highlight absolute top-24 left-32">
                      <div className="highlight2"></div>
                    </div>
                    <div className="highlight absolute top-32 left-24">
                      <div className="highlight2"></div>
                    </div>
                    <div className="highlight absolute top-40 left-36">
                      <div className="highlight2"></div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Invoice Preview */}
            <div className={`rounded-lg overflow-hidden transition-all duration-300 ${getHighlightClass('invoice')}`}>
              <div className="p-2 flex items-center justify-between" style={{ backgroundColor: '#1a2332' }}>
                <h4 className="text-sm font-medium text-white truncate max-w-48">Invoice INV-2024-0789.pdf</h4>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-300 mr-2">{invoiceZoom}%</span>
                  <button 
                    className="p-1 hover:bg-gray-700 rounded transition-colors text-white"
                    onClick={() => handleZoom('invoice', 'out')}
                    disabled={invoiceZoom <= 50}
                  >
                    <ZoomOut className="w-3 h-3" />
                  </button>
                  <button 
                    className="p-1 hover:bg-gray-700 rounded transition-colors text-white"
                    onClick={() => handleZoom('invoice', 'in')}
                    disabled={invoiceZoom >= 200}
                  >
                    <ZoomIn className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="aspect-[3/4] flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#212C4C' }}>
                <img 
                  src="/lovable-uploads/dd02edfb-b909-4512-a7c0-542a9b5663b1.png"
                  alt="Invoice Document"
                  className="w-full h-full object-contain transition-transform duration-200"
                  style={{ transform: `scale(${invoiceZoom / 100})` }}
                />
                {/* 4 Highlight overlays for hovered data */}
                {hoveredItem && issuesData.find(issue => issue.id === hoveredItem && issue.docType === 'invoice') && (
                  <>
                    <div className="highlight absolute top-20 left-28">
                      <div className="highlight2"></div>
                    </div>
                    <div className="highlight absolute top-28 left-40">
                      <div className="highlight2"></div>
                    </div>
                    <div className="highlight absolute top-36 left-32">
                      <div className="highlight2"></div>
                    </div>
                    <div className="highlight absolute top-44 left-44">
                      <div className="highlight2"></div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* GRN Preview */}
            <div className={`rounded-lg overflow-hidden transition-all duration-300 ${getHighlightClass('grn')}`}>
              <div className="p-2 flex items-center justify-between" style={{ backgroundColor: '#1a2332' }}>
                <h4 className="text-sm font-medium text-white truncate max-w-48">Goods Receipt Note GRN-2024-0123.pdf</h4>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-300 mr-2">{grnZoom}%</span>
                  <button 
                    className="p-1 hover:bg-gray-700 rounded transition-colors text-white"
                    onClick={() => handleZoom('grn', 'out')}
                    disabled={grnZoom <= 50}
                  >
                    <ZoomOut className="w-3 h-3" />
                  </button>
                  <button 
                    className="p-1 hover:bg-gray-700 rounded transition-colors text-white"
                    onClick={() => handleZoom('grn', 'in')}
                    disabled={grnZoom >= 200}
                  >
                    <ZoomIn className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="aspect-[3/4] flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#212C4C' }}>
                <img 
                  src="/lovable-uploads/fe9ef048-4144-4080-b58f-6cbe02f0092c.png"
                  alt="GRN Document"
                  className="w-full h-full object-contain transition-transform duration-200"
                  style={{ transform: `scale(${grnZoom / 100})` }}
                />
                {/* 4 Highlight overlays for hovered data */}
                {hoveredItem && issuesData.find(issue => issue.id === hoveredItem && issue.docType === 'grn') && (
                  <>
                    <div className="highlight absolute top-18 left-16">
                      <div className="highlight2"></div>
                    </div>
                    <div className="highlight absolute top-26 left-28">
                      <div className="highlight2"></div>
                    </div>
                    <div className="highlight absolute top-34 left-20">
                      <div className="highlight2"></div>
                    </div>
                    <div className="highlight absolute top-42 left-32">
                      <div className="highlight2"></div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};