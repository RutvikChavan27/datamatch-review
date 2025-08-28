import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AddLineItemDialog } from './AddLineItemDialog';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface LineItem {
  itemCode: string;
  description: string;
  unitPrice: number;
  quantity: number;
  unitOfMeasure: string;
  totalPrice: number;
  isCustom: boolean;
}

const LineItemsDemo: React.FC = () => {
  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      itemCode: 'DESK-001',
      description: 'Executive Desk - Mahogany',
      unitPrice: 1200.00,
      quantity: 1,
      unitOfMeasure: 'each',
      totalPrice: 1200.00,
      isCustom: false,
    },
    {
      itemCode: 'CHAIR-002',
      description: 'Ergonomic Office Chair - Black',
      unitPrice: 350.00,
      quantity: 2,
      unitOfMeasure: 'each',
      totalPrice: 700.00,
      isCustom: false,
    },
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddLineItem = (newItem: LineItem) => {
    setLineItems(prev => [...prev, newItem]);
  };

  const handleDeleteLineItem = (index: number) => {
    setLineItems(prev => prev.filter((_, i) => i !== index));
  };

  const totalAmount = lineItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">Line Items</CardTitle>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineItems.map((item, index) => (
                  <TableRow key={`${item.itemCode}-${index}`} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{item.itemCode}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.unitOfMeasure}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      ${item.unitPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${item.totalPrice.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.isCustom ? 'secondary' : 'default'}>
                        {item.isCustom ? 'Custom' : 'Catalog'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteLineItem(index)}
                        className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {lineItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No line items added yet. Click "Add Item" to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Summary */}
          {lineItems.length > 0 && (
            <div className="mt-4 flex justify-end">
              <div className="space-y-2 text-right">
                <div className="flex justify-between items-center min-w-[200px]">
                  <span className="text-muted-foreground">Total Items:</span>
                  <span className="font-medium">{lineItems.length}</span>
                </div>
                <div className="flex justify-between items-center min-w-[200px]">
                  <span className="text-muted-foreground">Total Quantity:</span>
                  <span className="font-medium">{lineItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div className="flex justify-between items-center min-w-[200px] text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Line Item Dialog */}
      <AddLineItemDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddLineItem={handleAddLineItem}
        existingItems={lineItems}
      />
    </div>
  );
};

export default LineItemsDemo;