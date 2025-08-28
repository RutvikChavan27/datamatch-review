
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, X, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LineItem {
  id: string;
  code: string;
  description: string;
  quantity: number;
  unitOfMeasure: string;
  unitPrice: number;
  total: number;
  approved?: boolean;
  status?: string;
}

interface POLineItemsTabProps {
  selectedPO: {
    lineItems?: LineItem[];
  };
  selectedItems: string[];
  onSelectItems: (items: string[]) => void;
}

const POLineItemsTab: React.FC<POLineItemsTabProps> = ({
  selectedPO,
  selectedItems,
  onSelectItems
}) => {
  const [editingItem, setEditingItem] = useState<LineItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const lineItems = selectedPO.lineItems || [];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectItems(lineItems.map(item => item.id));
    } else {
      onSelectItems([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      onSelectItems([...selectedItems, itemId]);
    } else {
      onSelectItems(selectedItems.filter(id => id !== itemId));
    }
  };

  const handleEditItem = (item: LineItem) => {
    setEditingItem({ ...item });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      toast({
        title: "Item Updated",
        description: `Line item ${editingItem.code} has been updated.`,
      });
      setIsEditDialogOpen(false);
      setEditingItem(null);
    }
  };

  const handleDeleteItem = () => {
    if (editingItem) {
      toast({
        title: "Item Deleted",
        description: `Line item ${editingItem.code} has been deleted.`,
      });
      setIsEditDialogOpen(false);
      setEditingItem(null);
    }
  };

  const handleAccept = (itemId: string) => {
    toast({
      title: "Item Accepted",
      description: "Line item has been accepted.",
    });
  };

  const handleDismiss = (itemId: string) => {
    toast({
      title: "Item Dismissed",
      description: "Line item has been dismissed.",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (lineItems.length === 0) {
    return (
      <div className="space-y-2 px-4">
        <Card className="border border-border/40 shadow-sm">
          <CardContent className="p-6 text-center text-muted-foreground">
            No line items available
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2 px-4">
        <Card className="border border-border/40 shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border/40 bg-muted/20">
                  <TableHead className="font-medium border-r-0 text-sm text-muted-foreground h-12 w-12">
                    <Checkbox
                      checked={selectedItems.length === lineItems.length && lineItems.length > 0}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all items"
                    />
                  </TableHead>
                  <TableHead className="font-medium border-r-0 text-sm text-muted-foreground h-12">Item Code</TableHead>
                  <TableHead className="font-medium border-r-0 text-sm text-muted-foreground h-12">Description</TableHead>
                  <TableHead className="font-medium border-r-0 text-sm text-muted-foreground h-12">Qty</TableHead>
                  <TableHead className="font-medium border-r-0 text-sm text-muted-foreground h-12">UOM</TableHead>
                  <TableHead className="font-medium border-r-0 text-sm text-muted-foreground h-12">Unit Price</TableHead>
                  <TableHead className="font-medium border-r-0 text-sm text-muted-foreground h-12">Total</TableHead>
                  <TableHead className="font-medium border-r-0 text-sm text-muted-foreground h-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineItems.map((item) => (
                  <TableRow key={item.id} className="h-12 hover:bg-muted/50 transition-colors">
                    <TableCell className="py-3 border-r-0">
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={(checked) => handleSelectItem(item.id, !!checked)}
                        aria-label={`Select item ${item.code}`}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm font-medium whitespace-nowrap py-3 border-r-0 text-foreground">{item.code}</TableCell>
                    <TableCell className="py-3 border-r-0 text-sm text-foreground">{item.description}</TableCell>
                    <TableCell className="py-3 border-r-0 text-sm text-foreground">{item.quantity}</TableCell>
                    <TableCell className="py-3 border-r-0 text-sm text-foreground">{item.unitOfMeasure}</TableCell>
                    <TableCell className="py-3 border-r-0 text-sm text-foreground">{formatCurrency(item.unitPrice)}</TableCell>
                    <TableCell className="font-medium py-3 border-r-0 text-sm text-foreground">{formatCurrency(item.total)}</TableCell>
                    <TableCell className="py-3 border-r-0">
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 p-0 text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() => handleAccept(item.id)}
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 p-0 text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleDismiss(item.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 p-0"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Line Item</DialogTitle>
            <DialogDescription>
              Make changes to the line item details below.
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">
                  Code
                </Label>
                <Input
                  id="code"
                  value={editingItem.code}
                  onChange={(e) => setEditingItem({ ...editingItem, code: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={editingItem.quantity}
                  onChange={(e) => setEditingItem({ ...editingItem, quantity: parseInt(e.target.value) || 0 })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unitOfMeasure" className="text-right">
                  UOM
                </Label>
                <Input
                  id="unitOfMeasure"
                  value={editingItem.unitOfMeasure}
                  onChange={(e) => setEditingItem({ ...editingItem, unitOfMeasure: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unitPrice" className="text-right">
                  Unit Price
                </Label>
                <Input
                  id="unitPrice"
                  type="number"
                  step="0.01"
                  value={editingItem.unitPrice}
                  onChange={(e) => setEditingItem({ ...editingItem, unitPrice: parseFloat(e.target.value) || 0 })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  Total
                </Label>
                <div className="col-span-3 px-3 py-2 bg-gray-50 rounded-md text-sm">
                  {formatCurrency(editingItem.quantity * editingItem.unitPrice)}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleDeleteItem}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default POLineItemsTab;
