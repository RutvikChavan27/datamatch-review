import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Search, Filter, Download, X, CalendarIcon, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const Audits: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedDocument, setSelectedDocument] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  const companies = ['Abstergo Ltd.', 'Acme Co.', 'Biffco Enterprises Ltd.', 'Barone LLC.'];
  const documents = ['Invoice_0125456', 'Internal Audits', 'External Audits', 'Quality Manual'];
  const users = ['Wade Warren', 'Brooklyn Simmons', 'Darlene Robertson', 'Marvin McKinney'];

  const auditLogs = [
    {
      id: 1,
      actionName: "Moved file to folder",
      dateTime: "03/08/2025 10:02 pm",
      documentName: "Invoice_0125456",
      folderName: "ACS",
      clientName: "Abstergo Ltd.",
      userName: "Wade Warren"
    },
    {
      id: 2,
      actionName: "Shipment notified",
      dateTime: "03/08/2025 10:09 pm",
      documentName: "Internal Audits",
      folderName: "Abcd",
      clientName: "Acme Co.",
      userName: "Brooklyn Simmons"
    },
    {
      id: 3,
      actionName: "Replaced or appended file",
      dateTime: "03/08/2025 10:35 pm",
      documentName: "External Audits",
      folderName: "Xxyz",
      clientName: "Biffco Enterprises Ltd.",
      userName: "Darlene Robertson"
    },
    {
      id: 4,
      actionName: "Email sent",
      dateTime: "03/08/2025 11:47 pm",
      documentName: "Quality Manual",
      folderName: "LMNOP",
      clientName: "Barone LLC.",
      userName: "Marvin McKinney"
    },
    {
      id: 5,
      actionName: "Document uploaded",
      dateTime: "03/09/2025 08:15 am",
      documentName: "Purchase Order_789",
      folderName: "PO_Docs",
      clientName: "Tech Solutions Inc.",
      userName: "Emily Johnson"
    },
    {
      id: 6,
      actionName: "File deleted",
      dateTime: "03/09/2025 09:30 am",
      documentName: "Draft_Contract",
      folderName: "Legal",
      clientName: "Global Corp",
      userName: "Michael Chen"
    },
    {
      id: 7,
      actionName: "Permission changed",
      dateTime: "03/09/2025 11:45 am",
      documentName: "Financial Report Q1",
      folderName: "Finance",
      clientName: "Alpha Industries",
      userName: "Sarah Davis"
    },
    {
      id: 8,
      actionName: "Document shared",
      dateTime: "03/09/2025 02:20 pm",
      documentName: "Project Proposal",
      folderName: "Projects",
      clientName: "Beta Solutions",
      userName: "James Wilson"
    },
    {
      id: 9,
      actionName: "Folder created",
      dateTime: "03/09/2025 03:55 pm",
      documentName: "New Client Files",
      folderName: "ClientDocs",
      clientName: "Gamma Enterprises",
      userName: "Lisa Martinez"
    },
    {
      id: 10,
      actionName: "Document versioned",
      dateTime: "03/09/2025 04:30 pm",
      documentName: "Contract_v2.1",
      folderName: "Contracts",
      clientName: "Delta Corp",
      userName: "Robert Brown"
    },
    {
      id: 11,
      actionName: "File renamed",
      dateTime: "03/10/2025 09:10 am",
      documentName: "Budget_2025_Final",
      folderName: "Budgets",
      clientName: "Epsilon LLC",
      userName: "Amanda Taylor"
    },
    {
      id: 12,
      actionName: "Access granted",
      dateTime: "03/10/2025 10:25 am",
      documentName: "HR Policies",
      folderName: "Human Resources",
      clientName: "Zeta Inc",
      userName: "Kevin Anderson"
    },
    {
      id: 13,
      actionName: "Document archived",
      dateTime: "03/10/2025 01:15 pm",
      documentName: "Old Invoice Template",
      folderName: "Archive",
      clientName: "Theta Corp",
      userName: "Jennifer White"
    },
    {
      id: 14,
      actionName: "Backup created",
      dateTime: "03/10/2025 03:40 pm",
      documentName: "System Backup",
      folderName: "Backups",
      clientName: "Iota Systems",
      userName: "Daniel Garcia"
    },
    {
      id: 15,
      actionName: "Document reviewed",
      dateTime: "03/10/2025 05:20 pm",
      documentName: "Compliance Report",
      folderName: "Compliance",
      clientName: "Kappa Ltd",
      userName: "Michelle Rodriguez"
    }
  ];

  const handleApplyFilter = () => {
    // Apply filter logic here
    setIsFilterOpen(false);
  };

  const handleCancelFilter = () => {
    // Reset filter values
    setDateFrom(undefined);
    setDateTo(undefined);
    setSelectedCompany('');
    setSelectedDocument('');
    setSelectedUser('');
    setIsFilterOpen(false);
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">
          Audit
        </h1>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Filter 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 cursor-pointer hover:text-foreground" 
              onClick={() => setIsFilterOpen(true)}
            />
            <Input
              placeholder="Search audits..."
              className="pl-9 pr-10 w-80"
            />
          </div>
          <Button className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="hidden">
                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
          <PopoverContent className="w-96 p-0" align="start" side="bottom" sideOffset={8}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Apply Filter</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFilterOpen(false)}
                  className="h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="date-range" className="text-sm font-medium">Date</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Popover open={showFromCalendar} onOpenChange={setShowFromCalendar}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "flex-1 justify-start text-left font-normal",
                            !dateFrom && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateFrom ? format(dateFrom, "MM/dd/yy") : "MM/DD/YY"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateFrom}
                          onSelect={(date) => {
                            setDateFrom(date);
                            setShowFromCalendar(false);
                          }}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <span className="text-muted-foreground">-</span>
                    <Popover open={showToCalendar} onOpenChange={setShowToCalendar}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "flex-1 justify-start text-left font-normal",
                            !dateTo && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateTo ? format(dateTo, "MM/dd/yy") : "MM/DD/YY"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateTo}
                          onSelect={(date) => {
                            setDateTo(date);
                            setShowToCalendar(false);
                          }}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div>
                  <Label htmlFor="company" className="text-sm font-medium">Company Name</Label>
                  <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company} value={company}>
                          {company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="document" className="text-sm font-medium">Document Name</Label>
                  <Select value={selectedDocument} onValueChange={setSelectedDocument}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select document" />
                    </SelectTrigger>
                    <SelectContent>
                      {documents.map((document) => (
                        <SelectItem key={document} value={document}>
                          {document}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="user" className="text-sm font-medium">User</Label>
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user} value={user}>
                          {user}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-4 border-t">
                <Button variant="outline" onClick={handleCancelFilter} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleApplyFilter} className="flex-1">
                  Apply Filter
                </Button>
              </div>
            </div>
           </PopoverContent>
           </Popover>

      <div className="mt-2 shadow-lg shadow-black/5">
        <Card className="overflow-hidden">
          <div 
            className="overflow-y-auto"
            style={{ 
              maxHeight: `calc(100vh - 320px)`,
              height: auditLogs.length > 15 ? `calc(100vh - 320px)` : 'auto'
            }}
          >
            <Table className="min-w-full" style={{ tableLayout: 'fixed' }}>
              <TableHeader className="sticky top-0 z-10">
                <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                  <TableHead className="w-12 font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>
                    <Checkbox />
                  </TableHead>
                  <TableHead className="font-semibold w-[180px] border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Action Name</TableHead>
                  <TableHead className="font-semibold w-[140px] border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Date & Time</TableHead>
                  <TableHead className="font-semibold w-[160px] border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Document Name</TableHead>
                  <TableHead className="font-semibold w-[120px] border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Folder Name</TableHead>
                  <TableHead className="font-semibold w-[140px] border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Tenant Name</TableHead>
                  <TableHead className="font-semibold w-[120px] border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>User Name</TableHead>
                  <TableHead className="w-[80px] font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id} className="h-10 hover:bg-muted/50 transition-colors">
                    <TableCell className="py-2 border-r-0 w-12">
                      <Checkbox />
                    </TableCell>
                    <TableCell className="font-medium py-2 border-r-0 text-sm text-foreground truncate w-[180px]">{log.actionName}</TableCell>
                    <TableCell className="py-2 border-r-0 text-sm text-muted-foreground truncate w-[140px]">{log.dateTime}</TableCell>
                    <TableCell className="py-2 border-r-0 text-sm text-foreground truncate w-[160px]">{log.documentName}</TableCell>
                    <TableCell className="py-2 border-r-0 text-sm text-muted-foreground truncate w-[120px]">{log.folderName}</TableCell>
                    <TableCell className="py-2 border-r-0 text-sm text-foreground truncate w-[140px]">{log.clientName}</TableCell>
                    <TableCell className="py-2 border-r-0 text-sm text-muted-foreground truncate w-[120px]">{log.userName}</TableCell>
                    <TableCell className="py-2 border-r-0 w-[80px]">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Audits;