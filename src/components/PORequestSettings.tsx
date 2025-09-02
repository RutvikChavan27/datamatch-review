import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Upload, Plus, Edit, Trash2, X } from 'lucide-react';

const PORequestSettings = () => {
  const [activeTab, setActiveTab] = useState('fields');
  
  // Add New Vendor Modal state
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [vendorForm, setVendorForm] = useState({
    vendorName: '',
    contactPerson: '',
    email: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    taxId: ''
  });

  // Handle vendor form input changes
  const handleVendorInputChange = (field: string, value: string) => {
    setVendorForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle save vendor
  const handleSaveVendor = () => {
    console.log('Saving vendor:', vendorForm);
    // Reset form and close modal
    setVendorForm({
      vendorName: '',
      contactPerson: '',
      email: '',
      phone: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      taxId: ''
    });
    setShowAddVendorModal(false);
  };

  // Handle cancel vendor form
  const handleCancelVendor = () => {
    // Reset form and close modal
    setVendorForm({
      vendorName: '',
      contactPerson: '',
      email: '',
      phone: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      taxId: ''
    });
    setShowAddVendorModal(false);
  };

  return (
    <TooltipProvider>
      <div className="space-y-2 px-4 pt-4 pb-2 max-w-full overflow-x-hidden">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/settings">Settings</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>PO Request Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground font-inter">PO Request Settings</h1>
          </div>
        </div>

        {/* Main Tabs */}
        <div className="border-b border-border flex items-center justify-between px-0 -mt-2">
          <div className="flex items-center flex-1 -mb-px pb-1">
            {[
              { key: 'fields', label: 'Fields' },
              { key: 'vendors', label: 'Vendors' },
              { key: 'departments', label: 'Departments' },
              { key: 'addresses', label: 'Addresses' },
              { key: 'payment', label: 'Payment' },
              { key: 'units', label: 'Units' },
              { key: 'items', label: 'Items' },
              { key: 'costs', label: 'Costs' }
            ].map((tab, index) => (
              <button
                key={tab.key}
                className={`
                   px-4 py-2.5 flex items-center gap-2 justify-center transition-all duration-200 relative border-b-2
                   ${index > 0 ? '-ml-px' : ''}
                   ${activeTab === tab.key
                     ? `bg-white text-gray-900 font-semibold z-10 border-b-[#27313e] shadow-md border-transparent rounded-t-md`
                     : "text-muted-foreground font-medium hover:bg-gray-50 hover:text-gray-700 border-b-transparent"}
                 `}
                onClick={() => setActiveTab(tab.key)}
              >
                <span className="text-center text-sm leading-5 flex items-center justify-center font-semibold">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'fields' && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Field Configuration</h3>
            </div>
            {/* PO Reference Field Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div className="space-y-1">
                  <h3 className="text-base font-medium text-foreground">PO Reference Field</h3>
                  <p className="text-sm text-muted-foreground">Field is read-only</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="po-reference" defaultChecked={false} />
                  <Label htmlFor="po-reference" className="sr-only">Toggle PO Reference Field</Label>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'vendors' && (
          <div className="space-y-4 pt-4">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Vendor Management</h3>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload size={16} />
                  Upload CSV
                </Button>
                <Button 
                  className="flex items-center gap-2"
                  onClick={() => setShowAddVendorModal(true)}
                >
                  <Plus size={16} />
                  Add New Vendor
                </Button>
              </div>
            </div>

            {/* Vendors Table */}
            <Card className="overflow-hidden shadow-lg shadow-black/5">
              <div 
                className="overflow-y-auto"
                style={{ 
                  maxHeight: `calc(100vh - 320px)`,
                  height: 'auto'
                }}
              >
                <Table className="min-w-full" style={{ tableLayout: 'fixed' }}>
                  <TableHeader className="sticky top-0 z-10">
                    <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                      <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Vendor Name</TableHead>
                      <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Contact Person</TableHead>
                      <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Email</TableHead>
                      <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Phone</TableHead>
                      <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Location</TableHead>
                      <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t text-right" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="h-10 hover:bg-muted/50 transition-colors">
                      <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">ABC Corp</TableCell>
                      <TableCell className="py-2 border-r-0 text-sm text-foreground">John Smith</TableCell>
                      <TableCell className="py-2 border-r-0 text-sm">
                        <a href="mailto:john@abccorp.com" className="text-blue-600 hover:text-blue-800 underline">
                          john@abccorp.com
                        </a>
                      </TableCell>
                      <TableCell className="py-2 border-r-0 text-sm text-foreground">+1-555-0123</TableCell>
                      <TableCell className="py-2 border-r-0 text-sm text-foreground">New York, NY</TableCell>
                      <TableCell className="py-2 border-r-0 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className="h-10 hover:bg-muted/50 transition-colors">
                      <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">XYZ Solutions</TableCell>
                      <TableCell className="py-2 border-r-0 text-sm text-foreground">Sarah Johnson</TableCell>
                      <TableCell className="py-2 border-r-0 text-sm">
                        <a href="mailto:sarah@xyzsolutions.com" className="text-blue-600 hover:text-blue-800 underline">
                          sarah@xyzsolutions.com
                        </a>
                      </TableCell>
                      <TableCell className="py-2 border-r-0 text-sm text-foreground">+1-555-0456</TableCell>
                      <TableCell className="py-2 border-r-0 text-sm text-foreground">Los Angeles, CA</TableCell>
                      <TableCell className="py-2 border-r-0 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'departments' && (
          <div className="space-y-4 pt-4">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Department Management</h3>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload size={16} />
                  Upload CSV
                </Button>
                <Button className="flex items-center gap-2">
                  <Plus size={16} />
                  Add Department
                </Button>
              </div>
            </div>

            {/* Departments Table */}
            <Card className="overflow-hidden shadow-lg shadow-black/5">
              <div 
                className="overflow-y-auto"
                style={{ 
                  maxHeight: `calc(100vh - 320px)`,
                  height: 'auto'
                }}
              >
                <Table className="min-w-full" style={{ tableLayout: 'fixed' }}>
                  <TableHeader className="sticky top-0 z-10">
                    <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                      <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Department Name</TableHead>
                      <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Manager</TableHead>
                      <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Email</TableHead>
                      <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Budget Code</TableHead>
                      <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t text-right" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="h-10 hover:bg-muted/50 transition-colors">
                      <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">IT Department</TableCell>
                      <TableCell className="py-2 border-r-0 text-sm text-foreground">Mike Wilson</TableCell>
                      <TableCell className="py-2 border-r-0 text-sm">
                        <a href="mailto:mike@company.com" className="text-blue-600 hover:text-blue-800 underline">
                          mike@company.com
                        </a>
                      </TableCell>
                      <TableCell className="py-2 border-r-0 text-sm">
                        <Badge variant="secondary">IT-001</Badge>
                      </TableCell>
                      <TableCell className="py-2 border-r-0 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className="h-10 hover:bg-muted/50 transition-colors">
                      <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">HR Department</TableCell>
                      <TableCell className="py-2 border-r-0 text-sm text-foreground">Lisa Brown</TableCell>
                      <TableCell className="py-2 border-r-0 text-sm">
                        <a href="mailto:lisa@company.com" className="text-blue-600 hover:text-blue-800 underline">
                          lisa@company.com
                        </a>
                      </TableCell>
                      <TableCell className="py-2 border-r-0 text-sm">
                        <Badge variant="secondary">HR-001</Badge>
                      </TableCell>
                      <TableCell className="py-2 border-r-0 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className="h-10 hover:bg-muted/50 transition-colors">
                      <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">Marketing</TableCell>
                      <TableCell className="py-2 border-r-0 text-sm text-foreground">Tom Davis</TableCell>
                      <TableCell className="py-2 border-r-0 text-sm">
                        <a href="mailto:tom@company.com" className="text-blue-600 hover:text-blue-800 underline">
                          tom@company.com
                        </a>
                      </TableCell>
                      <TableCell className="py-2 border-r-0 text-sm">
                        <Badge variant="secondary">MKT-001</Badge>
                      </TableCell>
                      <TableCell className="py-2 border-r-0 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="space-y-4 pt-4">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Address Management</h3>
              <div className="flex gap-2">
                <Button className="flex items-center gap-2">
                  <Plus size={16} />
                  Add Address
                </Button>
              </div>
            </div>

            {/* Addresses Table */}
            <Card className="overflow-hidden shadow-lg shadow-black/5">
              <div 
                className="overflow-y-auto"
                style={{ 
                  maxHeight: `calc(100vh - 320px)`,
                  height: 'auto'
                }}
              >
                <Table className="min-w-full" style={{ tableLayout: 'fixed' }}>
                  <TableHeader className="sticky top-0 z-10">
                    <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                      <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Address Name</TableHead>
                      <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Street Address</TableHead>
                      <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>City</TableHead>
                      <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>State</TableHead>
                      <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>ZIP Code</TableHead>
                      <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t text-right" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="h-10 hover:bg-muted/50 transition-colors">
                      <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">Main Office</TableCell>
                      <TableCell className="py-2 border-r-0 text-sm text-foreground">123 Business Blvd</TableCell>
                      <TableCell className="py-2 border-r-0 text-sm text-foreground">New York</TableCell>
                      <TableCell className="py-2 border-r-0 text-sm text-foreground">NY</TableCell>
                      <TableCell className="py-2 border-r-0 text-sm text-foreground">10001</TableCell>
                      <TableCell className="py-2 border-r-0 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className="h-10 hover:bg-muted/50 transition-colors">
                      <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">Warehouse</TableCell>
                      <TableCell className="py-2 border-r-0 text-sm text-foreground">456 Storage Way</TableCell>
                      <TableCell className="py-2 border-r-0 text-sm text-foreground">Newark</TableCell>
                      <TableCell className="py-2 border-r-0 text-sm text-foreground">NJ</TableCell>
                      <TableCell className="py-2 border-r-0 text-sm text-foreground">07102</TableCell>
                      <TableCell className="py-2 border-r-0 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="space-y-4 pt-4">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Payment Terms</h3>
              <div className="flex gap-2">
                <Button className="flex items-center gap-2">
                  <Plus size={16} />
                  Add Payment Terms
                </Button>
              </div>
            </div>

            {/* Payment Terms Table */}
            <Card className="overflow-hidden shadow-lg shadow-black/5">
              <div 
                className="overflow-y-auto"
                style={{ 
                  maxHeight: `calc(100vh - 320px)`,
                  height: 'auto'
                }}
              >
                <Table className="min-w-full" style={{ tableLayout: 'fixed' }}>
                  <TableHeader className="sticky top-0 z-10">
                    <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                      <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Payment Terms</TableHead>
                      <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t text-right" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="h-10 hover:bg-muted/50 transition-colors">
                      <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">Net 15</TableCell>
                      <TableCell className="py-2 border-r-0 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className="h-10 hover:bg-muted/50 transition-colors">
                      <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">Net 30</TableCell>
                      <TableCell className="py-2 border-r-0 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className="h-10 hover:bg-muted/50 transition-colors">
                      <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">Net 45</TableCell>
                      <TableCell className="py-2 border-r-0 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className="h-10 hover:bg-muted/50 transition-colors">
                      <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">Net 60</TableCell>
                      <TableCell className="py-2 border-r-0 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'units' && (
          <div className="space-y-4 pt-4">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Units of Measure</h3>
              <div className="flex gap-2">
                <Button className="flex items-center gap-2">
                  <Plus size={16} />
                  Add Unit of Measure
                </Button>
              </div>
            </div>

            {/* Units Table */}
            <Card className="overflow-hidden shadow-lg shadow-black/5">
              <div 
                className="overflow-y-auto"
                style={{ 
                  maxHeight: `calc(100vh - 320px)`,
                  height: 'auto'
                }}
              >
                <Table className="min-w-full" style={{ tableLayout: 'fixed' }}>
                  <TableHeader className="sticky top-0 z-10">
                    <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                      <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Unit of Measure</TableHead>
                      <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t text-right" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="h-10 hover:bg-muted/50 transition-colors">
                      <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">Each</TableCell>
                      <TableCell className="py-2 border-r-0 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className="h-10 hover:bg-muted/50 transition-colors">
                      <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">Box</TableCell>
                      <TableCell className="py-2 border-r-0 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className="h-10 hover:bg-muted/50 transition-colors">
                      <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">Case</TableCell>
                      <TableCell className="py-2 border-r-0 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className="h-10 hover:bg-muted/50 transition-colors">
                      <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">Hour</TableCell>
                      <TableCell className="py-2 border-r-0 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className="h-10 hover:bg-muted/50 transition-colors">
                      <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">Piece</TableCell>
                      <TableCell className="py-2 border-r-0 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className="h-10 hover:bg-muted/50 transition-colors">
                      <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">Set</TableCell>
                      <TableCell className="py-2 border-r-0 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'items' && (
          <div className="space-y-4 pt-4">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Line Items</h3>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload size={16} />
                  Upload CSV
                </Button>
                <Button className="flex items-center gap-2">
                  <Plus size={16} />
                  Add Line Item
                </Button>
              </div>
            </div>

            {/* Items Table */}
            <Card className="overflow-hidden shadow-lg shadow-black/5">
              <div 
                className="overflow-y-auto"
                style={{ 
                  maxHeight: `calc(100vh - 320px)`,
                  height: 'auto'
                }}
              >
                <Table className="min-w-full" style={{ tableLayout: 'fixed' }}>
                  <TableHeader className="sticky top-0 z-10">
                    <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                      <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Item Code</TableHead>
                      <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Description</TableHead>
                      <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Unit of Measure</TableHead>
                      <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Unit Price</TableHead>
                      <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t text-right" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="h-10 hover:bg-muted/50 transition-colors">
                      <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">ITEM-001</TableCell>
                      <TableCell className="py-2 border-r-0 text-sm text-foreground">Office Desk Chair</TableCell>
                      <TableCell className="py-2 border-r-0 text-sm text-foreground">Each</TableCell>
                      <TableCell className="text-green-600 font-medium py-2 border-r-0 text-sm">$125.00</TableCell>
                      <TableCell className="py-2 border-r-0 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className="h-10 hover:bg-muted/50 transition-colors">
                      <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">ITEM-002</TableCell>
                      <TableCell className="py-2 border-r-0 text-sm text-foreground">Wireless Mouse</TableCell>
                      <TableCell className="py-2 border-r-0 text-sm text-foreground">Each</TableCell>
                      <TableCell className="text-green-600 font-medium py-2 border-r-0 text-sm">$25.00</TableCell>
                      <TableCell className="py-2 border-r-0 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className="h-10 hover:bg-muted/50 transition-colors">
                      <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">ITEM-003</TableCell>
                      <TableCell className="py-2 border-r-0 text-sm text-foreground">Monitor Stand</TableCell>
                      <TableCell className="py-2 border-r-0 text-sm text-foreground">Each</TableCell>
                      <TableCell className="text-green-600 font-medium py-2 border-r-0 text-sm">$45.00</TableCell>
                      <TableCell className="py-2 border-r-0 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'costs' && (
          <div className="space-y-8 pt-4">
            {/* Cost Centers Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Cost Centers</h3>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Upload size={16} />
                    Upload CSV
                  </Button>
                  <Button className="flex items-center gap-2">
                    <Plus size={16} />
                    Add Cost Center
                  </Button>
                </div>
              </div>

              {/* Cost Centers Table */}
              <Card className="overflow-hidden shadow-lg shadow-black/5">
                <div 
                  className="overflow-y-auto"
                  style={{ 
                    maxHeight: `calc(100vh - 320px)`,
                    height: 'auto'
                  }}
                >
                  <Table className="min-w-full" style={{ tableLayout: 'fixed' }}>
                    <TableHeader className="sticky top-0 z-10">
                      <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                        <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Cost Center Code</TableHead>
                        <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Name</TableHead>
                        <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Department</TableHead>
                        <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>GL Code</TableHead>
                        <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t text-right" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="h-10 hover:bg-muted/50 transition-colors">
                        <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">CC-001</TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground">IT Operations</TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground">IT Department</TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground">GL-5000</TableCell>
                        <TableCell className="py-2 border-r-0 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow className="h-10 hover:bg-muted/50 transition-colors">
                        <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">CC-002</TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground">HR Administration</TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground">HR Department</TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground">GL-6000</TableCell>
                        <TableCell className="py-2 border-r-0 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow className="h-10 hover:bg-muted/50 transition-colors">
                        <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">CC-003</TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground">Marketing Campaigns</TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground">Marketing</TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground">GL-7000</TableCell>
                        <TableCell className="py-2 border-r-0 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </div>

            {/* General Ledger Codes Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">General Ledger Codes</h3>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Upload size={16} />
                    Upload CSV
                  </Button>
                  <Button className="flex items-center gap-2">
                    <Plus size={16} />
                    Add GL Code
                  </Button>
                </div>
              </div>

              {/* General Ledger Codes Table */}
              <Card className="overflow-hidden shadow-lg shadow-black/5">
                <div 
                  className="overflow-y-auto"
                  style={{ 
                    maxHeight: `calc(100vh - 320px)`,
                    height: 'auto'
                  }}
                >
                  <Table className="min-w-full" style={{ tableLayout: 'fixed' }}>
                    <TableHeader className="sticky top-0 z-10">
                      <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                        <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>GL Code</TableHead>
                        <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Description</TableHead>
                        <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Category</TableHead>
                        <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t text-right" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="h-10 hover:bg-muted/50 transition-colors">
                        <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">GL-5000</TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground">Information Technology</TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground">Operations</TableCell>
                        <TableCell className="py-2 border-r-0 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow className="h-10 hover:bg-muted/50 transition-colors">
                        <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">GL-6000</TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground">Human Resources</TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground">Administration</TableCell>
                        <TableCell className="py-2 border-r-0 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow className="h-10 hover:bg-muted/50 transition-colors">
                        <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">GL-7000</TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground">Marketing & Advertising</TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground">Sales & Marketing</TableCell>
                        <TableCell className="py-2 border-r-0 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Add New Vendor Modal */}
      <Dialog open={showAddVendorModal} onOpenChange={setShowAddVendorModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-semibold">Add New Vendor</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">Enter comprehensive vendor information for your records.</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setShowAddVendorModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {/* Vendor Name */}
            <div className="space-y-2">
              <Label htmlFor="vendorName" className="text-sm font-medium">
                Vendor Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="vendorName"
                placeholder="ABC Corp"
                value={vendorForm.vendorName}
                onChange={(e) => handleVendorInputChange('vendorName', e.target.value)}
              />
            </div>

            {/* Contact Person */}
            <div className="space-y-2">
              <Label htmlFor="contactPerson" className="text-sm font-medium">
                Contact Person <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contactPerson"
                placeholder="John Smith"
                value={vendorForm.contactPerson}
                onChange={(e) => handleVendorInputChange('contactPerson', e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@abccorp.com"
                value={vendorForm.email}
                onChange={(e) => handleVendorInputChange('email', e.target.value)}
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1-555-0123"
                value={vendorForm.phone}
                onChange={(e) => handleVendorInputChange('phone', e.target.value)}
              />
            </div>

            {/* Street Address */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="streetAddress" className="text-sm font-medium">
                Street Address
              </Label>
              <Input
                id="streetAddress"
                placeholder="123 Main Street"
                value={vendorForm.streetAddress}
                onChange={(e) => handleVendorInputChange('streetAddress', e.target.value)}
              />
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium">
                City
              </Label>
              <Input
                id="city"
                placeholder="New York"
                value={vendorForm.city}
                onChange={(e) => handleVendorInputChange('city', e.target.value)}
              />
            </div>

            {/* State */}
            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm font-medium">
                State
              </Label>
              <Input
                id="state"
                placeholder="NY"
                value={vendorForm.state}
                onChange={(e) => handleVendorInputChange('state', e.target.value)}
              />
            </div>

            {/* ZIP Code */}
            <div className="space-y-2">
              <Label htmlFor="zipCode" className="text-sm font-medium">
                ZIP Code
              </Label>
              <Input
                id="zipCode"
                placeholder="10001"
                value={vendorForm.zipCode}
                onChange={(e) => handleVendorInputChange('zipCode', e.target.value)}
              />
            </div>

            {/* Tax ID */}
            <div className="space-y-2">
              <Label htmlFor="taxId" className="text-sm font-medium">
                Tax ID
              </Label>
              <Input
                id="taxId"
                placeholder="12-3456789"
                value={vendorForm.taxId}
                onChange={(e) => handleVendorInputChange('taxId', e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancelVendor}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveVendor}
              disabled={!vendorForm.vendorName.trim() || !vendorForm.contactPerson.trim() || !vendorForm.email.trim()}
            >
              Save Vendor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default PORequestSettings;