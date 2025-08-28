import React, { useState, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Search, Package, Plus, Calculator, Clock, Upload, Scan, X, Check, AlertCircle, Minus } from 'lucide-react';

// Types
interface CatalogItem {
  itemCode: string;
  description: string;
  unitPrice: number;
  category: string;
  vendor?: string;
  lastUsed?: Date;
  priceHistory?: Array<{
    date: Date;
    price: number;
  }>;
}
interface LineItem {
  itemCode: string;
  description: string;
  unitPrice: number;
  quantity: number;
  unitOfMeasure: string;
  totalPrice: number;
  isCustom: boolean;
}
interface AddLineItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLineItem: (lineItem: LineItem) => void;
  existingItems?: LineItem[];
  vendorId?: string;
}

// Validation schema
const lineItemSchema = z.object({
  itemCode: z.string().min(1, 'Item code is required'),
  description: z.string().min(1, 'Description is required'),
  unitPrice: z.number().min(0.01, 'Unit price must be greater than 0'),
  quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
  unitOfMeasure: z.string().min(1, 'Unit of measure is required')
});
type LineItemFormData = z.infer<typeof lineItemSchema>;

// Mock catalog data
const mockCatalogItems: CatalogItem[] = [{
  itemCode: 'DESK-001',
  description: 'Executive Desk - Mahogany',
  unitPrice: 1200.00,
  category: 'Furniture',
  vendor: 'Office Plus',
  lastUsed: new Date('2024-01-15')
}, {
  itemCode: 'CHAIR-002',
  description: 'Ergonomic Office Chair - Black',
  unitPrice: 350.00,
  category: 'Furniture',
  vendor: 'Comfort Seating',
  lastUsed: new Date('2024-01-20')
}, {
  itemCode: 'SHELF-003',
  description: 'Bookshelf - Walnut',
  unitPrice: 550.00,
  category: 'Furniture',
  vendor: 'Office Plus'
}, {
  itemCode: 'OS-001',
  description: 'Pens (box of 12)',
  unitPrice: 10.00,
  category: 'Office Supplies',
  vendor: 'Supply Co',
  lastUsed: new Date('2024-01-25')
}, {
  itemCode: 'OS-002',
  description: 'Paper (500 sheets)',
  unitPrice: 20.00,
  category: 'Office Supplies',
  vendor: 'Supply Co'
}, {
  itemCode: 'IT-001',
  description: 'Laptop - Dell XPS 15',
  unitPrice: 1500.00,
  category: 'Technology',
  vendor: 'Tech Solutions'
}, {
  itemCode: 'DESK-004',
  description: 'Standing Desk - Adjustable',
  unitPrice: 800.00,
  category: 'Furniture',
  vendor: 'Office Plus',
  lastUsed: new Date('2024-01-18')
}, {
  itemCode: 'CHAIR-005',
  description: 'Conference Room Chair - Blue',
  unitPrice: 280.00,
  category: 'Furniture',
  vendor: 'Comfort Seating'
}, {
  itemCode: 'OS-003',
  description: 'Stapler - Heavy Duty',
  unitPrice: 45.00,
  category: 'Office Supplies',
  vendor: 'Supply Co',
  lastUsed: new Date('2024-01-22')
}, {
  itemCode: 'IT-002',
  description: 'Monitor - 27 inch 4K',
  unitPrice: 400.00,
  category: 'Technology',
  vendor: 'Tech Solutions'
}, {
  itemCode: 'LIGHT-001',
  description: 'LED Desk Lamp',
  unitPrice: 75.00,
  category: 'Office Supplies',
  vendor: 'Supply Co'
}, {
  itemCode: 'CABINET-001',
  description: 'Filing Cabinet - 4 Drawer',
  unitPrice: 320.00,
  category: 'Furniture',
  vendor: 'Office Plus'
}, {
  itemCode: 'IT-003',
  description: 'Wireless Mouse',
  unitPrice: 35.00,
  category: 'Technology',
  vendor: 'Tech Solutions',
  lastUsed: new Date('2024-01-28')
}, {
  itemCode: 'OS-004',
  description: 'Notebooks (pack of 5)',
  unitPrice: 15.00,
  category: 'Office Supplies',
  vendor: 'Supply Co'
}, {
  itemCode: 'DESK-006',
  description: 'Corner Desk - White',
  unitPrice: 450.00,
  category: 'Furniture',
  vendor: 'Office Plus'
}, {
  itemCode: 'IT-004',
  description: 'Keyboard - Mechanical',
  unitPrice: 120.00,
  category: 'Technology',
  vendor: 'Tech Solutions'
}, {
  itemCode: 'SHELF-007',
  description: 'Wall Shelf - Metal',
  unitPrice: 85.00,
  category: 'Furniture',
  vendor: 'Office Plus'
}, {
  itemCode: 'OS-005',
  description: 'Printer Paper - A4 (1000 sheets)',
  unitPrice: 35.00,
  category: 'Office Supplies',
  vendor: 'Supply Co'
}, {
  itemCode: 'IT-005',
  description: 'USB Hub - 7 Port',
  unitPrice: 50.00,
  category: 'Technology',
  vendor: 'Tech Solutions'
}, {
  itemCode: 'CHAIR-008',
  description: 'Guest Chair - Leather',
  unitPrice: 180.00,
  category: 'Furniture',
  vendor: 'Comfort Seating'
}];
const unitOfMeasureOptions = [{
  value: 'each',
  label: 'Each'
}, {
  value: 'box',
  label: 'Box'
}, {
  value: 'pound',
  label: 'Pound'
}, {
  value: 'ounce',
  label: 'Ounce'
}, {
  value: 'gallon',
  label: 'Gallon'
}, {
  value: 'liter',
  label: 'Liter'
}, {
  value: 'meter',
  label: 'Meter'
}, {
  value: 'foot',
  label: 'Foot'
}, {
  value: 'yard',
  label: 'Yard'
}, {
  value: 'piece',
  label: 'Piece'
}, {
  value: 'set',
  label: 'Set'
}, {
  value: 'unit',
  label: 'Unit'
}, {
  value: 'case',
  label: 'Case'
}, {
  value: 'pallet',
  label: 'Pallet'
}];
export const AddLineItemDialog: React.FC<AddLineItemDialogProps> = ({
  isOpen,
  onClose,
  onAddLineItem,
  existingItems = [],
  vendorId
}) => {
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState<'catalog' | 'custom'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: {
      errors,
      isValid
    }
  } = useForm<LineItemFormData>({
    resolver: zodResolver(lineItemSchema),
    defaultValues: {
      itemCode: '',
      description: '',
      unitPrice: 0,
      quantity: 1,
      unitOfMeasure: 'each'
    },
    mode: 'onChange'
  });
  const watchedQuantity = watch('quantity');
  const watchedUnitPrice = watch('unitPrice');

  // Calculate total price
  const totalPrice = useMemo(() => {
    return (watchedQuantity || 0) * (watchedUnitPrice || 0);
  }, [watchedQuantity, watchedUnitPrice]);

  // Filter catalog items based on search and vendor
  const filteredCatalogItems = useMemo(() => {
    let items = mockCatalogItems;
    if (vendorId) {
      items = items.filter(item => item.vendor === vendorId);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => item.itemCode.toLowerCase().includes(query) || item.description.toLowerCase().includes(query) || item.category.toLowerCase().includes(query));
    }
    return items;
  }, [searchQuery, vendorId]);

  // Recent items (used within last 30 days)
  const recentItems = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return mockCatalogItems.filter(item => item.lastUsed && item.lastUsed > thirtyDaysAgo).sort((a, b) => (b.lastUsed?.getTime() || 0) - (a.lastUsed?.getTime() || 0)).slice(0, 5);
  }, []);

  // Handle catalog item selection
  const handleCatalogItemSelect = (item: CatalogItem) => {
    setSelectedItem(item);
    setValue('itemCode', item.itemCode);
    setValue('description', item.description);
    setValue('unitPrice', item.unitPrice);
  };

  // Handle form submission
  const onSubmit = async (data: LineItemFormData) => {
    setIsLoading(true);
    try {
      // Check for duplicate item codes
      const isDuplicate = existingItems.some(item => item.itemCode === data.itemCode);
      if (isDuplicate) {
        toast({
          title: 'Duplicate Item',
          description: 'An item with this code already exists in the list.',
          variant: 'destructive'
        });
        return;
      }
      const lineItem: LineItem = {
        itemCode: data.itemCode,
        description: data.description,
        unitPrice: data.unitPrice,
        quantity: data.quantity,
        unitOfMeasure: data.unitOfMeasure,
        totalPrice,
        isCustom: activeTab === 'custom'
      };
      onAddLineItem(lineItem);
      toast({
        title: 'Item Added',
        description: `${data.description} has been added to the line items.`,
        variant: 'default'
      });

      // Reset form and close dialog
      reset();
      setSelectedItem(null);
      setSearchQuery('');
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add line item. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      reset();
      setSelectedItem(null);
      setSearchQuery('');
      setActiveTab('catalog');
    }
  }, [isOpen, reset]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[700px] flex flex-col bg-white">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2 text-gray-900">
            <Package className="w-5 h-5" />
            Add Line Item
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-4 pr-4">
            {/* Toggle buttons */}
            <div className="flex flex-col gap-4">
              <div className="inline-flex bg-gray-100 rounded-lg p-1 w-fit">
                <button type="button" onClick={() => setActiveTab('catalog')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'catalog' ? 'bg-white text-gray-900 shadow-sm font-semibold' : 'text-gray-600 hover:text-gray-900'}`}>
                  Catalog Search
                </button>
                <button type="button" onClick={() => setActiveTab('custom')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'custom' ? 'bg-white text-gray-900 shadow-sm font-semibold' : 'text-gray-600 hover:text-gray-900'}`}>
                  Custom Item
                </button>
              </div>
            </div>

            {/* Main layout with right column */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left side - Main content */}
              <div className="lg:col-span-2">
                {/* Search input for catalog tab */}
                {activeTab === 'catalog' && <div className="space-y-2 mb-4">
                    <Label htmlFor="catalogSearch" className="text-sm font-medium text-gray-700">
                      Search Catalog
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input id="catalogSearch" placeholder="Search catalog items by code, description, or category..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-white border-gray-200 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                  </div>}

                {activeTab === 'catalog' ? <div className="space-y-4">
                    {/* Recent Items */}
                    {!searchQuery && recentItems.length > 0 && <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <Label className="text-sm font-medium">Recently Used</Label>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {recentItems.map(item => <Badge key={item.itemCode} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors" onClick={() => handleCatalogItemSelect(item)}>
                              {item.itemCode} - {item.description}
                            </Badge>)}
                        </div>
                      </div>}

                    {/* Catalog Items Table */}
                    <Card className="bg-white border border-gray-200 shadow-sm">
                      <CardContent className="p-0">
                        <div className="overflow-hidden rounded-lg border border-gray-200">
                          <div className="max-h-[400px] overflow-auto">
                            <Table>
                              <TableHeader className="sticky top-0 z-10">
                                <TableRow className="bg-gray-50 border-b border-gray-200 hover:bg-gray-50">
                                  <TableHead className="font-semibold text-sm text-gray-900 h-12 w-[140px] px-6">Item Code</TableHead>
                                  <TableHead className="font-semibold text-sm text-gray-900 h-12 px-6">Description</TableHead>
                                  <TableHead className="font-semibold text-right text-sm text-gray-900 h-12 w-[150px] px-6">Unit Price</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredCatalogItems.map(item => <TableRow key={item.itemCode} className={`h-12 cursor-pointer hover:bg-blue-50 transition-colors border-b border-gray-100 ${selectedItem?.itemCode === item.itemCode ? 'bg-blue-50 border-blue-200' : ''}`} onClick={() => handleCatalogItemSelect(item)}>
                                    <TableCell className="font-mono text-sm font-medium whitespace-nowrap py-3 px-6 text-gray-900 w-[140px] flex items-center">
                                      <span>{item.itemCode}</span>
                                      {selectedItem?.itemCode === item.itemCode && <Check className="w-4 h-4 text-blue-600 ml-2 flex-shrink-0" />}
                                    </TableCell>
                                    <TableCell className="py-3 px-6 text-sm text-gray-900">{item.description}</TableCell>
                                    <TableCell className="text-right font-medium py-3 px-6 text-sm text-gray-900 w-[150px]">
                                      ${item.unitPrice.toFixed(2)}
                                    </TableCell>
                                  </TableRow>)}
                                {filteredCatalogItems.length === 0 && <TableRow>
                                    <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                                      No items found matching your search criteria.
                                    </TableCell>
                                  </TableRow>}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div> : <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="itemCode" className="text-sm font-medium text-gray-700">
                          Item Code <span className="text-red-500">*</span>
                        </Label>
                        <Controller name="itemCode" control={control} render={({
                      field
                    }) => <Input {...field} id="itemCode" placeholder="Enter item code" className="bg-white border-gray-200 focus:ring-blue-500 focus:border-blue-500" />} />
                        {errors.itemCode && <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.itemCode.message}
                          </p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="unitPrice" className="text-sm font-medium text-gray-700">
                          Unit Price <span className="text-red-500">*</span>
                        </Label>
                        <Controller name="unitPrice" control={control} render={({
                      field
                    }) => <Input {...field} id="unitPrice" type="number" step="0.01" min="0" placeholder="0.00" className="bg-white border-gray-200 focus:ring-blue-500 focus:border-blue-500" onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />} />
                        {errors.unitPrice && <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.unitPrice.message}
                          </p>}
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                          Description <span className="text-red-500">*</span>
                        </Label>
                        <Controller name="description" control={control} render={({
                      field
                    }) => <Input {...field} id="description" placeholder="Enter item description" className="bg-white border-gray-200 focus:ring-blue-500 focus:border-blue-500" />} />
                        {errors.description && <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.description.message}
                          </p>}
                      </div>
                    </div>
                  </div>}
              </div>

              {/* Right side - Quantity, Unit of Measure, and Selected Item */}
              <div className="space-y-4">
                {/* Quantity */}
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                    Quantity <span className="text-red-500">*</span>
                  </Label>
                  <Controller name="quantity" control={control} render={({
                  field
                }) => <div className="relative">
                        <Input {...field} id="quantity" type="number" step="0.01" min="0.01" placeholder="1" className="pr-20 text-center bg-white border-gray-200 focus:ring-blue-500 focus:border-blue-500" onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
                        <button type="button" onClick={() => field.onChange(Math.max(0.01, (field.value || 1) - 1))} className="absolute right-12 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors z-10">
                          <Minus className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => field.onChange((field.value || 1) + 1)} className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors z-10">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>} />
                  {errors.quantity && <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.quantity.message}
                    </p>}
                </div>

                {/* Unit of Measure */}
                <div className="space-y-2">
                  <Label htmlFor="unitOfMeasure" className="text-sm font-medium text-gray-700">
                    Unit of Measure <span className="text-red-500">*</span>
                  </Label>
                  <Controller name="unitOfMeasure" control={control} render={({
                  field
                }) => <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="bg-white border-gray-200 focus:ring-blue-500 focus:border-blue-500">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                          {unitOfMeasureOptions.map(option => <SelectItem key={option.value} value={option.value} className="hover:bg-gray-50">
                              {option.label}
                            </SelectItem>)}
                        </SelectContent>
                      </Select>} />
                  {errors.unitOfMeasure && <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.unitOfMeasure.message}
                    </p>}
                </div>

                {/* Selected Item Preview */}
                {(selectedItem || activeTab === 'custom') && <Card className="bg-blue-50 border border-blue-200">
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Selected Item</h4>
                          <p className="text-sm text-gray-600">
                            {watch('itemCode')} - {watch('description')}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calculator className="w-4 h-4 text-gray-500" />
                            <span className="text-lg font-semibold text-gray-900">
                              ${totalPrice.toFixed(2)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {watchedQuantity} × ${watchedUnitPrice?.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>}
              </div>
            </div>
          </div>
        </ScrollArea>


        <DialogFooter className="flex-shrink-0 gap-3 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} disabled={isLoading} className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400">
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={!isValid || isLoading} className="min-w-[120px] bg-primary hover:bg-primary/90 text-primary-foreground border-0">
            {isLoading ? <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Adding...
              </div> : 'Add to PO'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
};