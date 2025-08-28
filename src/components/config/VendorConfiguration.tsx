
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Upload, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VendorConfiguration = () => {
  const [fuzzyMatchTolerance, setFuzzyMatchTolerance] = useState(85);
  const [autoVendorCreation, setAutoVendorCreation] = useState(false);
  const { toast } = useToast();

  const vendors = [
    {
      id: 1,
      name: 'ABC Manufacturing Co.',
      code: 'ABC001',
      taxId: '12-3456789',
      paymentTerms: 'Net 30',
      currency: 'USD',
      aliases: ['ABC Mfg', 'ABC Manufacturing']
    },
    {
      id: 2,
      name: 'Tech Solutions Inc.',
      code: 'TECH002',
      taxId: '98-7654321',
      paymentTerms: 'Net 60',
      currency: 'USD',
      aliases: ['TechSol', 'Tech Solutions']
    }
  ];

  const handleSave = () => {
    toast({
      title: 'Vendor Configuration Saved',
      description: 'Vendor settings have been updated successfully.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Configuration Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor Matching Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fuzzy-tolerance">Fuzzy Matching Tolerance (%)</Label>
              <Input
                id="fuzzy-tolerance"
                type="number"
                min="0"
                max="100"
                value={fuzzyMatchTolerance}
                onChange={(e) => setFuzzyMatchTolerance(Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Default: 85%</p>
            </div>
            <div className="flex items-center space-x-2 mt-6">
              <Switch
                id="auto-vendor"
                checked={autoVendorCreation}
                onCheckedChange={setAutoVendorCreation}
              />
              <Label htmlFor="auto-vendor">Enable automatic vendor creation</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendor Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Vendor Master Data</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Import CSV
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Vendor
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Tax ID</TableHead>
                <TableHead>Payment Terms</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Aliases</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell>{vendor.code}</TableCell>
                  <TableCell>{vendor.taxId}</TableCell>
                  <TableCell>{vendor.paymentTerms}</TableCell>
                  <TableCell>{vendor.currency}</TableCell>
                  <TableCell>{vendor.aliases.join(', ')}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Configuration</Button>
      </div>
    </div>
  );
};

export default VendorConfiguration;
