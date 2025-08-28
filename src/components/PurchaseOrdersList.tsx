
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Upload, Send, Search } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const PurchaseOrdersList = () => {
  const [purchaseOrders] = useState([
    // For Review Status
    { id: 1, poNumber: 'PO-2024-0001', vendor: 'Acme Corporation', amount: 5250.00, status: 'for-review', uploadDate: '2024-01-15', glCode: '4000-001', description: 'Office equipment order' },
    { id: 2, poNumber: 'PO-2024-0003', vendor: 'Office Mart', amount: 1750.50, status: 'for-review', uploadDate: '2024-01-17', glCode: '4000-003', description: 'Office furniture' },
    { id: 3, poNumber: 'PO-2024-0005', vendor: 'Industrial Supply', amount: 8900.00, status: 'for-review', uploadDate: '2024-01-19', glCode: '4200-003', description: 'Manufacturing tools' },
    { id: 4, poNumber: 'PO-2024-0007', vendor: 'Tech Equipment Co', amount: 12500.00, status: 'for-review', uploadDate: '2024-01-21', glCode: '4100-004', description: 'Server hardware' },
    { id: 5, poNumber: 'PO-2024-0009', vendor: 'Medical Supplies Inc', amount: 6750.25, status: 'for-review', uploadDate: '2024-01-23', glCode: '4300-002', description: 'Medical equipment' },
    { id: 6, poNumber: 'PO-2024-0011', vendor: 'Construction Materials', amount: 15200.00, status: 'for-review', uploadDate: '2024-01-25', glCode: '4400-001', description: 'Building materials' },
    { id: 7, poNumber: 'PO-2024-0013', vendor: 'Vehicle Fleet Services', amount: 22000.00, status: 'for-review', uploadDate: '2024-01-27', glCode: '4500-001', description: 'Fleet vehicles' },
    { id: 8, poNumber: 'PO-2024-0015', vendor: 'Laboratory Equipment', amount: 9850.75, status: 'for-review', uploadDate: '2024-01-29', glCode: '4600-001', description: 'Lab instruments' },
    { id: 9, poNumber: 'PO-2024-0017', vendor: 'Safety Equipment Co', amount: 4300.50, status: 'for-review', uploadDate: '2024-01-31', glCode: '4700-001', description: 'Safety gear' },
    { id: 10, poNumber: 'PO-2024-0019', vendor: 'Environmental Solutions', amount: 7650.00, status: 'for-review', uploadDate: '2024-02-02', glCode: '4800-001', description: 'Environmental equipment' },
    { id: 11, poNumber: 'PO-2024-0021', vendor: 'Packaging Solutions', amount: 3200.25, status: 'for-review', uploadDate: '2024-02-04', glCode: '4900-001', description: 'Packaging materials' },
    { id: 12, poNumber: 'PO-2024-0023', vendor: 'Energy Systems', amount: 18750.00, status: 'for-review', uploadDate: '2024-02-06', glCode: '5000-001', description: 'Solar panels' },
    { id: 13, poNumber: 'PO-2024-0025', vendor: 'Security Solutions', amount: 11200.50, status: 'for-review', uploadDate: '2024-02-08', glCode: '5100-001', description: 'Security systems' },
    { id: 14, poNumber: 'PO-2024-0027', vendor: 'Communication Systems', amount: 8450.00, status: 'for-review', uploadDate: '2024-02-10', glCode: '5200-001', description: 'Communication equipment' },
    { id: 15, poNumber: 'PO-2024-0029', vendor: 'Quality Control Equipment', amount: 6900.75, status: 'for-review', uploadDate: '2024-02-12', glCode: '5300-001', description: 'QC instruments' },

    // Ready for Data Match Status
    { id: 16, poNumber: 'PO-2024-0002', vendor: 'Tech Solutions Inc', amount: 12500.00, status: 'ready-for-data-match', uploadDate: '2024-01-16', glCode: '4100-002', description: 'IT infrastructure upgrade', readyForMatchAt: '2024-01-16T09:45:00Z', readyForMatchBy: 'Mike Davis' },
    { id: 17, poNumber: 'PO-2024-0004', vendor: 'Global Services', amount: 8200.00, status: 'ready-for-data-match', uploadDate: '2024-01-18', glCode: '4200-001', description: 'Professional services', readyForMatchAt: '2024-01-18T16:20:00Z', readyForMatchBy: 'Lisa Wilson' },
    { id: 18, poNumber: 'PO-2024-0006', vendor: 'Manufacturing Equipment Co', amount: 25000.00, status: 'ready-for-data-match', uploadDate: '2024-01-20', glCode: '4300-003', description: 'Production machinery', readyForMatchAt: '2024-01-20T11:15:00Z', readyForMatchBy: 'David Chen' },
    { id: 19, poNumber: 'PO-2024-0008', vendor: 'Research Instruments', amount: 14750.50, status: 'ready-for-data-match', uploadDate: '2024-01-22', glCode: '4400-002', description: 'Research equipment', readyForMatchAt: '2024-01-22T14:30:00Z', readyForMatchBy: 'Emma Taylor' },
    { id: 20, poNumber: 'PO-2024-0010', vendor: 'Transportation Services', amount: 9650.25, status: 'ready-for-data-match', uploadDate: '2024-01-24', glCode: '4500-002', description: 'Logistics equipment', readyForMatchAt: '2024-01-24T10:45:00Z', readyForMatchBy: 'Robert Kim' },
    { id: 21, poNumber: 'PO-2024-0012', vendor: 'Information Technology', amount: 16800.00, status: 'ready-for-data-match', uploadDate: '2024-01-26', glCode: '4600-002', description: 'IT hardware', readyForMatchAt: '2024-01-26T13:20:00Z', readyForMatchBy: 'Jessica Brown' },
    { id: 22, poNumber: 'PO-2024-0014', vendor: 'Automation Systems', amount: 21500.75, status: 'ready-for-data-match', uploadDate: '2024-01-28', glCode: '4700-002', description: 'Automation equipment', readyForMatchAt: '2024-01-28T15:50:00Z', readyForMatchBy: 'Alex Rodriguez' },
    { id: 23, poNumber: 'PO-2024-0016', vendor: 'Testing Equipment Co', amount: 7300.00, status: 'ready-for-data-match', uploadDate: '2024-01-30', glCode: '4800-002', description: 'Testing instruments', readyForMatchAt: '2024-01-30T09:10:00Z', readyForMatchBy: 'Maria Garcia' },
    { id: 24, poNumber: 'PO-2024-0018', vendor: 'Facility Management', amount: 13200.50, status: 'ready-for-data-match', uploadDate: '2024-02-01', glCode: '4900-002', description: 'Facility equipment', readyForMatchAt: '2024-02-01T12:35:00Z', readyForMatchBy: 'Tom Wilson' },
    { id: 25, poNumber: 'PO-2024-0020', vendor: 'Process Control Systems', amount: 19750.25, status: 'ready-for-data-match', uploadDate: '2024-02-03', glCode: '5000-002', description: 'Control systems', readyForMatchAt: '2024-02-03T16:05:00Z', readyForMatchBy: 'Anna Lee' },
    { id: 26, poNumber: 'PO-2024-0022', vendor: 'Material Handling', amount: 11450.00, status: 'ready-for-data-match', uploadDate: '2024-02-05', glCode: '5100-002', description: 'Handling equipment', readyForMatchAt: '2024-02-05T08:25:00Z', readyForMatchBy: 'Chris Johnson' },
    { id: 27, poNumber: 'PO-2024-0024', vendor: 'Measurement Systems', amount: 8950.75, status: 'ready-for-data-match', uploadDate: '2024-02-07', glCode: '5200-002', description: 'Measurement tools', readyForMatchAt: '2024-02-07T14:15:00Z', readyForMatchBy: 'Susan Davis' },
    { id: 28, poNumber: 'PO-2024-0026', vendor: 'Power Systems Inc', amount: 23400.00, status: 'ready-for-data-match', uploadDate: '2024-02-09', glCode: '5300-002', description: 'Power equipment', readyForMatchAt: '2024-02-09T11:40:00Z', readyForMatchBy: 'Kevin Martinez' },
    { id: 29, poNumber: 'PO-2024-0028', vendor: 'Precision Instruments', amount: 17600.50, status: 'ready-for-data-match', uploadDate: '2024-02-11', glCode: '5400-001', description: 'Precision tools', readyForMatchAt: '2024-02-11T15:25:00Z', readyForMatchBy: 'Rachel Smith' },
    { id: 30, poNumber: 'PO-2024-0030', vendor: 'Optical Equipment Co', amount: 12850.25, status: 'ready-for-data-match', uploadDate: '2024-02-13', glCode: '5500-001', description: 'Optical instruments', readyForMatchAt: '2024-02-13T10:10:00Z', readyForMatchBy: 'James Wilson' }
  ]);

  const [selectedPOs, setSelectedPOs] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [activeTab, setActiveTab] = useState('for-review');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'for-review':
        return <Badge variant="secondary">For Review</Badge>;
      case 'ready-for-data-match':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">Ready for Data Match</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredPOs = purchaseOrders.filter(po => 
    po.status === activeTab &&
    (po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
     po.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
     po.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredPOs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPOs = filteredPOs.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      const readyForMatchIds = filteredPOs
        .filter(po => po.status === 'ready-for-data-match')
        .map(po => po.id);
      setSelectedPOs(readyForMatchIds);
    } else {
      setSelectedPOs([]);
    }
  };

  const handleSelectPO = (poId: number, checked: boolean) => {
    if (checked) {
      setSelectedPOs(prev => [...prev, poId]);
    } else {
      setSelectedPOs(prev => prev.filter(id => id !== poId));
      setSelectAll(false);
    }
  };

  const selectedReadyCount = selectedPOs.filter(id => 
    purchaseOrders.find(po => po.id === id && po.status === 'ready-for-data-match')
  ).length;

  const handleSendToDataMatch = () => {
    console.log('Sending to data match:', selectedPOs);
    // Here you would typically make an API call
    setSelectedPOs([]);
    setSelectAll(false);
  };

  return (
    <div className="h-full bg-background">
      {/* Breadcrumb */}
      <div className="px-6 py-4 border-b">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Purchase Orders</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Purchase Orders</h1>
          </div>
          <div className="flex items-center space-x-2">
            {selectedReadyCount > 0 && activeTab === 'ready-for-data-match' && (
              <Button 
                onClick={handleSendToDataMatch}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                Send to Data Match ({selectedReadyCount})
              </Button>
            )}
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
            <Button variant="outline" size="icon">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value); setCurrentPage(1); }} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="w-auto">
              <TabsTrigger value="for-review">For Review</TabsTrigger>
              <TabsTrigger value="ready-for-data-match">Ready For Data Match</TabsTrigger>
            </TabsList>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search purchase orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <TabsContent value={activeTab} className="mt-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 border-b-2 border-border hover:bg-muted/50">
                      {activeTab === 'ready-for-data-match' && (
                        <TableHead className="w-12 font-semibold">
                          <Checkbox
                            checked={selectAll}
                            onCheckedChange={handleSelectAll}
                            aria-label="Select all"
                          />
                        </TableHead>
                      )}
                      <TableHead className="font-semibold">PO Number</TableHead>
                      <TableHead className="font-semibold">Vendor</TableHead>
                      <TableHead className="font-semibold">Amount</TableHead>
                      <TableHead className="font-semibold">GL Code</TableHead>
                      <TableHead className="font-semibold">Upload Date</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPOs.map((po) => (
                      <TableRow key={po.id}>
                        {activeTab === 'ready-for-data-match' && (
                          <TableCell>
                            <Checkbox
                              checked={selectedPOs.includes(po.id)}
                              onCheckedChange={(checked) => handleSelectPO(po.id, checked as boolean)}
                              aria-label={`Select PO ${po.poNumber}`}
                            />
                          </TableCell>
                        )}
                        <TableCell>
                          <Link 
                            to={`/documents/purchase-orders/${po.id}`}
                            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {po.poNumber}
                          </Link>
                        </TableCell>
                        <TableCell>{po.vendor}</TableCell>
                        <TableCell className="font-medium">${po.amount.toFixed(2)}</TableCell>
                        <TableCell className="font-mono text-sm">{po.glCode}</TableCell>
                        <TableCell>{po.uploadDate}</TableCell>
                        <TableCell>{getStatusBadge(po.status)}</TableCell>
                        <TableCell className="max-w-xs truncate">{po.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </CardContent>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center py-2 px-4">
                <Pagination className="justify-start">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
                <span className="text-sm text-muted-foreground whitespace-nowrap">Powered by MaxxLogix™</span>
              </div>
            )}
          </Card>
        </Tabs>
      </div>
    </div>
  );
};

export default PurchaseOrdersList;
