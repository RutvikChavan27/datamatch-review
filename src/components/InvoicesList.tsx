
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

const InvoicesList = () => {
  const [invoices] = useState([
    // For Review Status
    { id: 1, invoiceNumber: 'INV-2024-0001', vendor: 'Acme Corporation', amount: 1250.00, status: 'for-review', uploadDate: '2024-01-15', glCode: '4000-001', description: 'Office supplies' },
    { id: 2, invoiceNumber: 'INV-2024-0003', vendor: 'Office Mart', amount: 750.50, status: 'for-review', uploadDate: '2024-01-17', glCode: '4000-003', description: 'Furniture' },
    { id: 3, invoiceNumber: 'INV-2024-0005', vendor: 'Supply Chain Co', amount: 1875.25, status: 'for-review', uploadDate: '2024-01-19', glCode: '4000-004', description: 'Raw materials' },
    { id: 4, invoiceNumber: 'INV-2024-0007', vendor: 'Industrial Solutions', amount: 3200.00, status: 'for-review', uploadDate: '2024-01-21', glCode: '4200-002', description: 'Manufacturing equipment' },
    { id: 5, invoiceNumber: 'INV-2024-0009', vendor: 'Tech Hardware Inc', amount: 2850.75, status: 'for-review', uploadDate: '2024-01-23', glCode: '4100-003', description: 'Computer hardware' },
    { id: 6, invoiceNumber: 'INV-2024-0011', vendor: 'Business Services LLC', amount: 1950.00, status: 'for-review', uploadDate: '2024-01-25', glCode: '4300-001', description: 'Consulting services' },
    { id: 7, invoiceNumber: 'INV-2024-0013', vendor: 'Materials Plus', amount: 820.30, status: 'for-review', uploadDate: '2024-01-27', glCode: '4000-005', description: 'Construction materials' },
    { id: 8, invoiceNumber: 'INV-2024-0015', vendor: 'Digital Solutions', amount: 4200.00, status: 'for-review', uploadDate: '2024-01-29', glCode: '4100-004', description: 'Software licensing' },
    { id: 9, invoiceNumber: 'INV-2024-0017', vendor: 'Fleet Management', amount: 5500.00, status: 'for-review', uploadDate: '2024-01-31', glCode: '4400-001', description: 'Vehicle maintenance' },
    { id: 10, invoiceNumber: 'INV-2024-0019', vendor: 'Security Systems', amount: 3750.00, status: 'for-review', uploadDate: '2024-02-02', glCode: '4500-001', description: 'Security equipment' },
    { id: 11, invoiceNumber: 'INV-2024-0021', vendor: 'Energy Providers', amount: 2200.50, status: 'for-review', uploadDate: '2024-02-04', glCode: '4600-001', description: 'Utility services' },
    { id: 12, invoiceNumber: 'INV-2024-0023', vendor: 'Marketing Agency', amount: 6800.00, status: 'for-review', uploadDate: '2024-02-06', glCode: '4700-001', description: 'Marketing services' },
    { id: 13, invoiceNumber: 'INV-2024-0025', vendor: 'Logistics Corp', amount: 1450.75, status: 'for-review', uploadDate: '2024-02-08', glCode: '4800-001', description: 'Shipping services' },
    { id: 14, invoiceNumber: 'INV-2024-0027', vendor: 'Health Services', amount: 920.00, status: 'for-review', uploadDate: '2024-02-10', glCode: '4900-001', description: 'Employee health' },
    { id: 15, invoiceNumber: 'INV-2024-0029', vendor: 'Training Solutions', amount: 3400.00, status: 'for-review', uploadDate: '2024-02-12', glCode: '5000-001', description: 'Employee training' },
    
    // Ready for Data Match Status
    { id: 16, invoiceNumber: 'INV-2024-0002', vendor: 'Tech Solutions Inc', amount: 2500.00, status: 'ready-for-data-match', uploadDate: '2024-01-16', glCode: '4100-002', description: 'Software licenses', readyForMatchAt: '2024-01-16T10:30:00Z', readyForMatchBy: 'John Smith' },
    { id: 17, invoiceNumber: 'INV-2024-0004', vendor: 'Global Services', amount: 3200.00, status: 'ready-for-data-match', uploadDate: '2024-01-18', glCode: '4200-001', description: 'Consulting services', readyForMatchAt: '2024-01-18T14:15:00Z', readyForMatchBy: 'Sarah Johnson' },
    { id: 18, invoiceNumber: 'INV-2024-0006', vendor: 'Equipment Rental', amount: 4750.00, status: 'ready-for-data-match', uploadDate: '2024-01-20', glCode: '4300-002', description: 'Equipment rental', readyForMatchAt: '2024-01-20T09:45:00Z', readyForMatchBy: 'Mike Davis' },
    { id: 19, invoiceNumber: 'INV-2024-0008', vendor: 'Professional Services', amount: 2900.50, status: 'ready-for-data-match', uploadDate: '2024-01-22', glCode: '4400-002', description: 'Legal services', readyForMatchAt: '2024-01-22T11:20:00Z', readyForMatchBy: 'Lisa Wilson' },
    { id: 20, invoiceNumber: 'INV-2024-0010', vendor: 'Cloud Services', amount: 1850.00, status: 'ready-for-data-match', uploadDate: '2024-01-24', glCode: '4500-002', description: 'Cloud hosting', readyForMatchAt: '2024-01-24T15:30:00Z', readyForMatchBy: 'David Chen' },
    { id: 21, invoiceNumber: 'INV-2024-0012', vendor: 'Maintenance Co', amount: 3650.75, status: 'ready-for-data-match', uploadDate: '2024-01-26', glCode: '4600-002', description: 'Facility maintenance', readyForMatchAt: '2024-01-26T08:15:00Z', readyForMatchBy: 'Emma Taylor' },
    { id: 22, invoiceNumber: 'INV-2024-0014', vendor: 'Telecom Services', amount: 2100.00, status: 'ready-for-data-match', uploadDate: '2024-01-28', glCode: '4700-002', description: 'Telecommunications', readyForMatchAt: '2024-01-28T13:45:00Z', readyForMatchBy: 'Robert Kim' },
    { id: 23, invoiceNumber: 'INV-2024-0016', vendor: 'Insurance Corp', amount: 5200.00, status: 'ready-for-data-match', uploadDate: '2024-01-30', glCode: '4800-002', description: 'Insurance premiums', readyForMatchAt: '2024-01-30T10:00:00Z', readyForMatchBy: 'Jessica Brown' },
    { id: 24, invoiceNumber: 'INV-2024-0018', vendor: 'Travel Agency', amount: 1750.25, status: 'ready-for-data-match', uploadDate: '2024-02-01', glCode: '4900-002', description: 'Business travel', readyForMatchAt: '2024-02-01T16:20:00Z', readyForMatchBy: 'Alex Rodriguez' },
    { id: 25, invoiceNumber: 'INV-2024-0020', vendor: 'Catering Services', amount: 980.50, status: 'ready-for-data-match', uploadDate: '2024-02-03', glCode: '5000-002', description: 'Event catering', readyForMatchAt: '2024-02-03T12:10:00Z', readyForMatchBy: 'Maria Garcia' },
    { id: 26, invoiceNumber: 'INV-2024-0022', vendor: 'Design Studio', amount: 4300.00, status: 'ready-for-data-match', uploadDate: '2024-02-05', glCode: '5100-001', description: 'Graphic design', readyForMatchAt: '2024-02-05T14:35:00Z', readyForMatchBy: 'Tom Wilson' },
    { id: 27, invoiceNumber: 'INV-2024-0024', vendor: 'Printing Services', amount: 1290.75, status: 'ready-for-data-match', uploadDate: '2024-02-07', glCode: '5200-001', description: 'Printing materials', readyForMatchAt: '2024-02-07T09:25:00Z', readyForMatchBy: 'Anna Lee' },
    { id: 28, invoiceNumber: 'INV-2024-0026', vendor: 'Research Firm', amount: 7500.00, status: 'ready-for-data-match', uploadDate: '2024-02-09', glCode: '5300-001', description: 'Market research', readyForMatchAt: '2024-02-09T11:50:00Z', readyForMatchBy: 'Chris Johnson' },
    { id: 29, invoiceNumber: 'INV-2024-0028', vendor: 'Audit Services', amount: 3850.00, status: 'ready-for-data-match', uploadDate: '2024-02-11', glCode: '5400-001', description: 'Financial audit', readyForMatchAt: '2024-02-11T15:15:00Z', readyForMatchBy: 'Susan Davis' },
    { id: 30, invoiceNumber: 'INV-2024-0030', vendor: 'HR Solutions', amount: 2650.50, status: 'ready-for-data-match', uploadDate: '2024-02-13', glCode: '5500-001', description: 'HR consulting', readyForMatchAt: '2024-02-13T08:40:00Z', readyForMatchBy: 'Kevin Martinez' }
  ]);

  const [selectedInvoices, setSelectedInvoices] = useState<number[]>([]);
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

  const filteredInvoices = invoices.filter(invoice => 
    invoice.status === activeTab &&
    (invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
     invoice.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
     invoice.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      const readyForMatchIds = filteredInvoices
        .filter(invoice => invoice.status === 'ready-for-data-match')
        .map(invoice => invoice.id);
      setSelectedInvoices(readyForMatchIds);
    } else {
      setSelectedInvoices([]);
    }
  };

  const handleSelectInvoice = (invoiceId: number, checked: boolean) => {
    if (checked) {
      setSelectedInvoices(prev => [...prev, invoiceId]);
    } else {
      setSelectedInvoices(prev => prev.filter(id => id !== invoiceId));
      setSelectAll(false);
    }
  };

  const selectedReadyCount = selectedInvoices.filter(id => 
    invoices.find(invoice => invoice.id === id && invoice.status === 'ready-for-data-match')
  ).length;

  const handleSendToDataMatch = () => {
    console.log('Sending to data match:', selectedInvoices);
    // Here you would typically make an API call
    setSelectedInvoices([]);
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
              <BreadcrumbPage>Invoices</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Invoices</h1>
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
                placeholder="Search invoices..."
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
                      <TableHead className="font-semibold">Invoice Number</TableHead>
                      <TableHead className="font-semibold">Vendor</TableHead>
                      <TableHead className="font-semibold">Amount</TableHead>
                      <TableHead className="font-semibold">GL Code</TableHead>
                      <TableHead className="font-semibold">Upload Date</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        {activeTab === 'ready-for-data-match' && (
                          <TableCell>
                            <Checkbox
                              checked={selectedInvoices.includes(invoice.id)}
                              onCheckedChange={(checked) => handleSelectInvoice(invoice.id, checked as boolean)}
                              aria-label={`Select invoice ${invoice.invoiceNumber}`}
                            />
                          </TableCell>
                        )}
                        <TableCell>
                          <Link 
                            to={`/documents/invoices/${invoice.id}`}
                            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {invoice.invoiceNumber}
                          </Link>
                        </TableCell>
                        <TableCell>{invoice.vendor}</TableCell>
                        <TableCell className="font-medium">${invoice.amount.toFixed(2)}</TableCell>
                        <TableCell className="font-mono text-sm">{invoice.glCode}</TableCell>
                        <TableCell>{invoice.uploadDate}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell className="max-w-xs truncate">{invoice.description}</TableCell>
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

export default InvoicesList;
