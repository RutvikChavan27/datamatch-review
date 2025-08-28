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

const GoodsReceiptNotesList = () => {
  const [grns] = useState([
    // For Review Status
    { id: 1, grnNumber: 'GRN-2024-0001', vendor: 'Acme Corporation', amount: 2250.00, status: 'for-review', uploadDate: '2024-01-15', glCode: '5000-001', description: 'Materials received' },
    { id: 2, grnNumber: 'GRN-2024-0003', vendor: 'Office Mart', amount: 850.75, status: 'for-review', uploadDate: '2024-01-17', glCode: '5000-003', description: 'Office supplies' },
    { id: 3, grnNumber: 'GRN-2024-0005', vendor: 'Industrial Supplies Co', amount: 4200.50, status: 'for-review', uploadDate: '2024-01-19', glCode: '5100-002', description: 'Industrial components' },
    { id: 4, grnNumber: 'GRN-2024-0007', vendor: 'Medical Equipment Inc', amount: 7800.25, status: 'for-review', uploadDate: '2024-01-21', glCode: '5200-001', description: 'Medical devices' },
    { id: 5, grnNumber: 'GRN-2024-0009', vendor: 'Construction Materials', amount: 12500.00, status: 'for-review', uploadDate: '2024-01-23', glCode: '5300-001', description: 'Building materials' },
    { id: 6, grnNumber: 'GRN-2024-0011', vendor: 'Laboratory Supplies', amount: 3650.75, status: 'for-review', uploadDate: '2024-01-25', glCode: '5400-001', description: 'Lab equipment' },
    { id: 7, grnNumber: 'GRN-2024-0013', vendor: 'Safety Equipment Co', amount: 1890.50, status: 'for-review', uploadDate: '2024-01-27', glCode: '5500-001', description: 'Safety gear' },
    { id: 8, grnNumber: 'GRN-2024-0015', vendor: 'Electronic Components', amount: 5420.25, status: 'for-review', uploadDate: '2024-01-29', glCode: '5600-001', description: 'Electronic parts' },
    { id: 9, grnNumber: 'GRN-2024-0017', vendor: 'Packaging Solutions', amount: 2100.00, status: 'for-review', uploadDate: '2024-01-31', glCode: '5700-001', description: 'Packaging materials' },
    { id: 10, grnNumber: 'GRN-2024-0019', vendor: 'Chemical Supplies', amount: 6750.50, status: 'for-review', uploadDate: '2024-02-02', glCode: '5800-001', description: 'Chemical products' },
    { id: 11, grnNumber: 'GRN-2024-0021', vendor: 'Machinery Parts', amount: 8900.75, status: 'for-review', uploadDate: '2024-02-04', glCode: '5900-001', description: 'Machine components' },
    { id: 12, grnNumber: 'GRN-2024-0023', vendor: 'Automotive Parts', amount: 4350.25, status: 'for-review', uploadDate: '2024-02-06', glCode: '6000-001', description: 'Vehicle parts' },
    { id: 13, grnNumber: 'GRN-2024-0025', vendor: 'Textile Materials', amount: 3200.00, status: 'for-review', uploadDate: '2024-02-08', glCode: '6100-001', description: 'Fabric supplies' },
    { id: 14, grnNumber: 'GRN-2024-0027', vendor: 'Metal Supplies', amount: 9850.50, status: 'for-review', uploadDate: '2024-02-10', glCode: '6200-001', description: 'Metal materials' },
    { id: 15, grnNumber: 'GRN-2024-0029', vendor: 'Plastic Components', amount: 2750.25, status: 'for-review', uploadDate: '2024-02-12', glCode: '6300-001', description: 'Plastic parts' },

    // Ready for Data Match Status
    { id: 16, grnNumber: 'GRN-2024-0002', vendor: 'Tech Solutions Inc', amount: 4500.00, status: 'ready-for-data-match', uploadDate: '2024-01-16', glCode: '5100-002', description: 'IT hardware delivery', readyForMatchAt: '2024-01-16T11:45:00Z', readyForMatchBy: 'Emily Chen' },
    { id: 17, grnNumber: 'GRN-2024-0004', vendor: 'Global Services', amount: 3200.00, status: 'ready-for-data-match', uploadDate: '2024-01-18', glCode: '5200-001', description: 'Service delivery confirmation', readyForMatchAt: '2024-01-18T13:30:00Z', readyForMatchBy: 'Robert Kim' },
    { id: 18, grnNumber: 'GRN-2024-0006', vendor: 'Equipment Rental Co', amount: 6750.50, status: 'ready-for-data-match', uploadDate: '2024-01-20', glCode: '5300-002', description: 'Rental equipment delivery', readyForMatchAt: '2024-01-20T10:15:00Z', readyForMatchBy: 'Jessica Brown' },
    { id: 19, grnNumber: 'GRN-2024-0008', vendor: 'Manufacturing Tools', amount: 8950.25, status: 'ready-for-data-match', uploadDate: '2024-01-22', glCode: '5400-002', description: 'Tool delivery', readyForMatchAt: '2024-01-22T14:45:00Z', readyForMatchBy: 'Alex Rodriguez' },
    { id: 20, grnNumber: 'GRN-2024-0010', vendor: 'Precision Instruments', amount: 12200.75, status: 'ready-for-data-match', uploadDate: '2024-01-24', glCode: '5500-002', description: 'Instrument delivery', readyForMatchAt: '2024-01-24T09:20:00Z', readyForMatchBy: 'Maria Garcia' },
    { id: 21, grnNumber: 'GRN-2024-0012', vendor: 'Quality Control Systems', amount: 7650.00, status: 'ready-for-data-match', uploadDate: '2024-01-26', glCode: '5600-002', description: 'QC equipment', readyForMatchAt: '2024-01-26T16:10:00Z', readyForMatchBy: 'Tom Wilson' },
    { id: 22, grnNumber: 'GRN-2024-0014', vendor: 'Testing Equipment', amount: 5420.50, status: 'ready-for-data-match', uploadDate: '2024-01-28', glCode: '5700-002', description: 'Testing instruments', readyForMatchAt: '2024-01-28T11:35:00Z', readyForMatchBy: 'Anna Lee' },
    { id: 23, grnNumber: 'GRN-2024-0016', vendor: 'Measurement Tools', amount: 4180.25, status: 'ready-for-data-match', uploadDate: '2024-01-30', glCode: '5800-002', description: 'Measurement devices', readyForMatchAt: '2024-01-30T15:25:00Z', readyForMatchBy: 'Chris Johnson' },
    { id: 24, grnNumber: 'GRN-2024-0018', vendor: 'Control Systems Inc', amount: 9750.75, status: 'ready-for-data-match', uploadDate: '2024-02-01', glCode: '5900-002', description: 'Control equipment', readyForMatchAt: '2024-02-01T08:50:00Z', readyForMatchBy: 'Susan Davis' },
    { id: 25, grnNumber: 'GRN-2024-0020', vendor: 'Automation Solutions', amount: 13500.00, status: 'ready-for-data-match', uploadDate: '2024-02-03', glCode: '6000-002', description: 'Automation hardware', readyForMatchAt: '2024-02-03T12:40:00Z', readyForMatchBy: 'Kevin Martinez' },
    { id: 26, grnNumber: 'GRN-2024-0022', vendor: 'Process Equipment Co', amount: 11250.50, status: 'ready-for-data-match', uploadDate: '2024-02-05', glCode: '6100-002', description: 'Process machinery', readyForMatchAt: '2024-02-05T14:15:00Z', readyForMatchBy: 'Rachel Smith' },
    { id: 27, grnNumber: 'GRN-2024-0024', vendor: 'Material Handling', amount: 6890.25, status: 'ready-for-data-match', uploadDate: '2024-02-07', glCode: '6200-002', description: 'Handling equipment', readyForMatchAt: '2024-02-07T10:30:00Z', readyForMatchBy: 'James Wilson' },
    { id: 28, grnNumber: 'GRN-2024-0026', vendor: 'Environmental Systems', amount: 8450.75, status: 'ready-for-data-match', uploadDate: '2024-02-09', glCode: '6300-002', description: 'Environmental equipment', readyForMatchAt: '2024-02-09T16:55:00Z', readyForMatchBy: 'Nicole Brown' },
    { id: 29, grnNumber: 'GRN-2024-0028', vendor: 'Power Systems Ltd', amount: 15750.00, status: 'ready-for-data-match', uploadDate: '2024-02-11', glCode: '6400-001', description: 'Power equipment', readyForMatchAt: '2024-02-11T09:05:00Z', readyForMatchBy: 'Daniel Kim' },
    { id: 30, grnNumber: 'GRN-2024-0030', vendor: 'Communication Equipment', amount: 7320.50, status: 'ready-for-data-match', uploadDate: '2024-02-13', glCode: '6500-001', description: 'Communication devices', readyForMatchAt: '2024-02-13T13:20:00Z', readyForMatchBy: 'Michelle Davis' }
  ]);

  const [selectedGRNs, setSelectedGRNs] = useState<number[]>([]);
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

  const filteredGRNs = grns.filter(grn => 
    grn.status === activeTab &&
    (grn.grnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
     grn.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
     grn.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredGRNs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedGRNs = filteredGRNs.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      const readyForMatchIds = filteredGRNs
        .filter(grn => grn.status === 'ready-for-data-match')
        .map(grn => grn.id);
      setSelectedGRNs(readyForMatchIds);
    } else {
      setSelectedGRNs([]);
    }
  };

  const handleSelectGRN = (grnId: number, checked: boolean) => {
    if (checked) {
      setSelectedGRNs(prev => [...prev, grnId]);
    } else {
      setSelectedGRNs(prev => prev.filter(id => id !== grnId));
      setSelectAll(false);
    }
  };

  const selectedReadyCount = selectedGRNs.filter(id => 
    grns.find(grn => grn.id === id && grn.status === 'ready-for-data-match')
  ).length;

  const handleSendToDataMatch = () => {
    console.log('Sending to data match:', selectedGRNs);
    // Here you would typically make an API call
    setSelectedGRNs([]);
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
              <BreadcrumbPage>Proof of Delivery</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Proof of Delivery</h1>
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
                placeholder="Search proof of delivery..."
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
                      <TableHead className="font-semibold">GRN Number</TableHead>
                      <TableHead className="font-semibold">Vendor</TableHead>
                      <TableHead className="font-semibold">Amount</TableHead>
                      <TableHead className="font-semibold">GL Code</TableHead>
                      <TableHead className="font-semibold">Upload Date</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedGRNs.map((grn) => (
                      <TableRow key={grn.id}>
                        {activeTab === 'ready-for-data-match' && (
                          <TableCell>
                            <Checkbox
                              checked={selectedGRNs.includes(grn.id)}
                              onCheckedChange={(checked) => handleSelectGRN(grn.id, checked as boolean)}
                              aria-label={`Select GRN ${grn.grnNumber}`}
                            />
                          </TableCell>
                        )}
                        <TableCell>
                          <Link 
                            to={`/documents/goods-receipt-notes/${grn.id}`}
                            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {grn.grnNumber}
                          </Link>
                        </TableCell>
                        <TableCell>{grn.vendor}</TableCell>
                        <TableCell className="font-medium">${grn.amount.toFixed(2)}</TableCell>
                        <TableCell className="font-mono text-sm">{grn.glCode}</TableCell>
                        <TableCell>{grn.uploadDate}</TableCell>
                        <TableCell>{getStatusBadge(grn.status)}</TableCell>
                        <TableCell className="max-w-xs truncate">{grn.description}</TableCell>
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

export default GoodsReceiptNotesList;