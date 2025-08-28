import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import {
  CalendarIcon,
  Plus,
  Trash,
  Copy,
  Upload,
  Minimize,
} from "lucide-react";
import { LineItem, PurchaseOrder } from "@/types/po-types";
import {
  vendors,
  departments,
  deliveryAddresses,
  paymentTerms,
  catalogItems,
} from "@/data/mock-data";
// import { formatCurrency } from '@/lib/formatters';

// Local formatCurrency function
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Units of Measure options
const unitsOfMeasure = [
  { id: "each", name: "Each" },
  { id: "box", name: "Box" },
  { id: "pound", name: "Pound" },
  { id: "ounce", name: "Ounce" },
  { id: "gallon", name: "Gallon" },
  { id: "liter", name: "Liter" },
  { id: "meter", name: "Meter" },
  { id: "foot", name: "Foot" },
  { id: "yard", name: "Yard" },
  { id: "piece", name: "Piece" },
  { id: "set", name: "Set" },
  { id: "unit", name: "Unit" },
  { id: "case", name: "Case" },
  { id: "pallet", name: "Pallet" },
];

interface AddLineItemDialogProps {
  onAddItem: (item: LineItem) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddLineItemDialog: React.FC<AddLineItemDialogProps> = ({
  onAddItem,
  open,
  onOpenChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [uom, setUom] = useState<string>("each");
  const [customItem, setCustomItem] = useState(false);
  const [customItemCode, setCustomItemCode] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [customUnitPrice, setCustomUnitPrice] = useState<number>(0);

  const filteredItems = catalogItems.filter(
    (item) =>
      item.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCatalogItem = selectedItemId
    ? catalogItems.find((item) => item.id === selectedItemId)
    : null;

  const handleAddItem = () => {
    if (customItem) {
      if (!customItemCode || !customDescription || customUnitPrice <= 0) {
        toast.error("Please fill all required fields");
        return;
      }

      const newItem: LineItem = {
        id: `custom-${Date.now()}`,
        itemCode: customItemCode,
        description: customDescription,
        quantity,
        uom: unitsOfMeasure.find((u) => u.id === uom)?.name || "Each",
        unitPrice: customUnitPrice,
        totalPrice: customUnitPrice * quantity,
      };
      onAddItem(newItem);
    } else {
      if (!selectedItemId) {
        toast.error("Please select an item");
        return;
      }

      if (!selectedCatalogItem) return;

      const newItem: LineItem = {
        id: `${selectedCatalogItem.id}-${Date.now()}`,
        itemCode: selectedCatalogItem.itemCode,
        description: selectedCatalogItem.description,
        quantity,
        uom: unitsOfMeasure.find((u) => u.id === uom)?.name || "Each",
        unitPrice: selectedCatalogItem.unitPrice,
        totalPrice: selectedCatalogItem.unitPrice * quantity,
      };
      onAddItem(newItem);
    }

    // Reset form
    setSearchQuery("");
    setSelectedItemId("");
    setQuantity(1);
    setUom("each");
    setCustomItem(false);
    setCustomItemCode("");
    setCustomDescription("");
    setCustomUnitPrice(0);
    onOpenChange(false);
  };

  return (
    <DialogContent className="sm:max-w-[900px] max-h-[80vh] flex flex-col">
      <DialogHeader className="flex-shrink-0">
        <DialogTitle>Add Line Item</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4 overflow-y-auto flex-1 min-h-0">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search catalog items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
            disabled={customItem}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCustomItem(!customItem)}
          >
            {customItem ? "Use Catalog" : "Custom Item"}
          </Button>
        </div>

        {!customItem ? (
          <div className="border rounded-md h-96 overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-[hsl(var(--table-header-bg))]">
                <TableRow className="hover:bg-[hsl(var(--table-header-bg))]">
                  <TableHead className="w-[100px] px-4 py-1.5">
                    Item Code
                  </TableHead>
                  <TableHead className="px-4 py-1.5">Description</TableHead>
                  <TableHead className="text-right px-4 py-1.5">
                    Unit Price
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <TableRow
                      key={item.id}
                      className={cn(
                        "cursor-pointer h-12",
                        selectedItemId === item.id ? "bg-po-tableHover" : ""
                      )}
                      onClick={() => setSelectedItemId(item.id)}
                    >
                      <TableCell className="font-mono px-5 py-2">
                        {item.itemCode}
                      </TableCell>
                      <TableCell className="px-5 py-2">
                        {item.description}
                      </TableCell>
                      <TableCell className="text-right px-5 py-2">
                        {formatCurrency(item.unitPrice)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-16 text-center text-muted-foreground"
                    >
                      No items found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4 space-y-2">
                <Label htmlFor="customItemCode">Item Code</Label>
                <Input
                  id="customItemCode"
                  placeholder="Enter item code"
                  value={customItemCode}
                  onChange={(e) => setCustomItemCode(e.target.value)}
                  className="font-mono"
                />
              </div>
              <div className="col-span-8 space-y-2">
                <Label htmlFor="customDescription">Description</Label>
                <Input
                  id="customDescription"
                  placeholder="Enter item description"
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4 space-y-2">
                <Label htmlFor="customUnitPrice">Unit Price</Label>
                <Input
                  id="customUnitPrice"
                  type="number"
                  placeholder="0.00"
                  value={customUnitPrice || ""}
                  onChange={(e) => setCustomUnitPrice(Number(e.target.value))}
                  className="text-right"
                />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3 space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="text-right"
            />
          </div>
          <div className="col-span-5 space-y-2">
            <Label htmlFor="uom">Unit of Measure</Label>
            <Select value={uom} onValueChange={setUom}>
              <SelectTrigger id="uom">
                <SelectValue placeholder="Select UoM" />
              </SelectTrigger>
              <SelectContent>
                {unitsOfMeasure.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedItemId && !customItem && (
          <div className="p-4 border rounded-md bg-muted/30">
            <p className="text-sm font-medium">Selected Item</p>
            <p className="font-medium">{selectedCatalogItem?.description}</p>
            <div className="flex justify-between mt-2">
              <p className="text-sm text-muted-foreground">
                Item Code: {selectedCatalogItem?.itemCode}
              </p>
              <p className="text-sm font-medium">
                {formatCurrency(selectedCatalogItem?.unitPrice || 0)}
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button
          onClick={handleAddItem}
          // className="bg-po-brand hover:bg-po-hover"
        >
          Add to PO
        </Button>
      </div>
    </DialogContent>
  );
};

// Save draft PO to localStorage
const saveDraft = (po: Partial<PurchaseOrder>, reference: string) => {
  const draft = {
    ...po,
    reference,
    lastSaved: new Date().toISOString(),
  };
  localStorage.setItem("po-draft", JSON.stringify(draft));
  return draft;
};

// Load draft PO from localStorage
const loadDraft = (): {
  po: Partial<PurchaseOrder>;
  reference: string;
} | null => {
  const draftJson = localStorage.getItem("po-draft");
  if (draftJson) {
    const draft = JSON.parse(draftJson);
    // Convert date strings back to Date objects
    if (draft.expectedDeliveryDate) {
      draft.expectedDeliveryDate = new Date(draft.expectedDeliveryDate);
    }
    return {
      po: draft,
      reference: draft.reference,
    };
  }
  return null;
};

const CreatePO: React.FC = () => {
  const navigate = useNavigate();
  const [po, setPo] = useState<Partial<PurchaseOrder>>({
    title: "",
    vendor: "",
    department: "",
    expectedDeliveryDate: null,
    deliveryAddress: "",
    paymentTerms: "",
    lineItems: [],
    notes: "",
  });

  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  const [reference, setReference] = useState("");
  const [minimized, setMinimized] = useState(false);

  // Generate a reference number on component mount
  React.useEffect(() => {
    // Generate new reference
    const prefix = "PO-";
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    setReference(`${prefix}${randomNum}`);
  }, []);

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) return;

    setPo((prevPo) => ({
      ...prevPo,
      lineItems: (prevPo.lineItems || []).map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: newQuantity,
              totalPrice: item.unitPrice * newQuantity,
            }
          : item
      ),
    }));
  };

  const handleAddLineItem = (newItem: LineItem) => {
    setPo((prevPo) => ({
      ...prevPo,
      lineItems: [...(prevPo.lineItems || []), newItem],
    }));
    toast.success("Item added to PO");
  };

  const handleRemoveLineItem = (itemId: string) => {
    setPo((prevPo) => ({
      ...prevPo,
      lineItems: (prevPo.lineItems || []).filter((item) => item.id !== itemId),
    }));
  };

  const handleDuplicateLineItem = (itemId: string) => {
    const itemToDuplicate = po.lineItems?.find((item) => item.id === itemId);
    if (!itemToDuplicate) return;

    const duplicatedItem = {
      ...itemToDuplicate,
      id: `${itemToDuplicate.id}-dup-${Date.now()}`,
    };

    setPo((prevPo) => ({
      ...prevPo,
      lineItems: [...(prevPo.lineItems || []), duplicatedItem],
    }));

    toast.success("Item duplicated");
  };

  const calculateTotal = () => {
    return (
      po.lineItems?.reduce((total, item) => total + item.totalPrice, 0) || 0
    );
  };

  const handleCancel = () => {
    navigate("/po-requests");
  };

  const handleMinimize = () => {
    setMinimized(true);
    navigate("/po-requests", { state: { minimizedPO: true } });
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!po.title || !po.vendor || !po.department) {
      toast.error("Please fill in required fields (Title, Vendor, Department)");
      return;
    }

    if (!po.lineItems?.length) {
      toast.error("Please add at least one line item");
      return;
    }

    // Navigate to confirmation screen
    navigate("/po-requests/confirm", {
      state: {
        po: {
          ...po,
          reference,
          status: "submitted",
          totalAmount: calculateTotal(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    });
  };

  if (minimized) {
    return null;
  }

  return (
    <div className="pb-10">
      <div className="sticky top-0 z-10 bg-background py-4 border-b mb-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Create PO Request</h1>
            <p className="text-muted-foreground">
              Enter the details for your new purchase request
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMinimize}
              title="Minimize"
            >
              <Minimize size={20} />
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              // className="bg-po-brand hover:bg-po-hover"
            >
              Submit Request
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* General Information Section - Compact */}
        <div className="space-y-4 mb-6">
          <h2 className="text-lg font-medium border-b pb-2">
            General Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-start">
            <div className="space-y-1">
              <Label htmlFor="title" className="text-sm flex items-center">
                PO Title <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Enter PO title"
                value={po.title}
                onChange={(e) => setPo({ ...po, title: e.target.value })}
                className="h-9"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="reference" className="text-sm">
                PO Reference
              </Label>
              <Input
                id="reference"
                value={reference}
                readOnly
                className="h-9 bg-muted/30"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="vendor" className="text-sm flex items-center">
                Vendor <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                value={po.vendor}
                onValueChange={(value) => setPo({ ...po, vendor: value })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.name}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="requestor" className="text-sm">
                Requestor
              </Label>
              <Input
                id="requestor"
                value="Alex Johnson"
                readOnly
                className="h-9 bg-muted/30"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="department" className="text-sm flex items-center">
                Department <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                value={po.department}
                onValueChange={(value) => setPo({ ...po, department: value })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="deliveryDate" className="text-sm">
                Expected Delivery
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-9 justify-start text-left font-normal",
                      !po.expectedDeliveryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {po.expectedDeliveryDate ? (
                      format(po.expectedDeliveryDate, "MMM dd")
                    ) : (
                      <span>Select date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={po.expectedDeliveryDate || undefined}
                    onSelect={(date) =>
                      setPo({ ...po, expectedDeliveryDate: date })
                    }
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1">
              <Label htmlFor="deliveryAddress" className="text-sm">
                Delivery Address
              </Label>
              <Select
                value={po.deliveryAddress}
                onValueChange={(value) =>
                  setPo({ ...po, deliveryAddress: value })
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select address" />
                </SelectTrigger>
                <SelectContent>
                  {deliveryAddresses.map((address) => (
                    <SelectItem key={address.id} value={address.name}>
                      {address.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="paymentTerms" className="text-sm">
                Payment Terms
              </Label>
              <Select
                value={po.paymentTerms}
                onValueChange={(value) => setPo({ ...po, paymentTerms: value })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select terms" />
                </SelectTrigger>
                <SelectContent>
                  {paymentTerms.map((term) => (
                    <SelectItem key={term.id} value={term.name}>
                      {term.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Line Items Section */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-medium border-b pb-2">Line Items</h2>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow className="bg-[hsl(var(--table-header-bg))] hover:bg-[hsl(var(--table-header-bg))]">
                  <TableHead className="w-[100px] px-4 py-1.5">
                    Item Code
                  </TableHead>
                  <TableHead className="px-4 py-1.5">Description</TableHead>
                  <TableHead className="w-[100px] text-right px-4 py-1.5">
                    Quantity
                  </TableHead>
                  <TableHead className="w-[120px] text-right px-4 py-1.5">
                    UoM
                  </TableHead>
                  <TableHead className="w-[120px] text-right px-4 py-1.5">
                    Unit Price
                  </TableHead>
                  <TableHead className="w-[120px] text-right px-4 py-1.5">
                    Total
                  </TableHead>
                  <TableHead className="w-[100px] text-center px-4 py-1.5">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {po.lineItems && po.lineItems.length > 0 ? (
                  po.lineItems.map((item) => (
                    <TableRow
                      key={item.id}
                      className="h-12 hover:bg-po-tableHover"
                    >
                      <TableCell className="font-mono px-5 py-2">
                        {item.itemCode}
                      </TableCell>
                      <TableCell className="px-5 py-2">
                        {item.description}
                      </TableCell>
                      <TableCell className="text-right px-5 py-2">
                        <Input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateQuantity(
                              item.id,
                              Number(e.target.value)
                            )
                          }
                          className="w-16 h-8 text-right text-sm"
                        />
                      </TableCell>
                      <TableCell className="text-right px-5 py-2">
                        {item.uom || "Each"}
                      </TableCell>
                      <TableCell className="text-right px-5 py-2">
                        {formatCurrency(item.unitPrice)}
                      </TableCell>
                      <TableCell className="text-right font-medium px-5 py-2">
                        {formatCurrency(item.totalPrice)}
                      </TableCell>
                      <TableCell className="px-5 py-2">
                        <div className="flex justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDuplicateLineItem(item.id)}
                            className="h-8 w-8"
                          >
                            <Copy size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveLineItem(item.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-16 text-center text-muted-foreground"
                    >
                      No items added yet. Click "Add Item" below to add items to
                      your PO.
                    </TableCell>
                  </TableRow>
                )}

                {/* Total Row */}
                {po.lineItems && po.lineItems.length > 0 && (
                  <TableRow className="bg-muted/20">
                    <TableCell colSpan={5} className="text-right font-medium">
                      Total
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {formatCurrency(calculateTotal())}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setAddItemDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Line Item
            </Button>

            <Dialog
              open={addItemDialogOpen}
              onOpenChange={setAddItemDialogOpen}
            >
              <AddLineItemDialog
                onAddItem={handleAddLineItem}
                open={addItemDialogOpen}
                onOpenChange={setAddItemDialogOpen}
              />
            </Dialog>
          </div>
        </div>

        {/* Attachments and Notes Section */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium border-b pb-2">
            Attachments & Notes
          </h2>

          <Card>
            <CardContent className="p-6">
              <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/20 transition-colors">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="font-medium">Drag & drop files here</p>
                <p className="text-sm text-muted-foreground">
                  or click to browse
                </p>
                <Button variant="secondary" size="sm">
                  Browse Files
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label
              htmlFor="notes"
              className="flex items-center justify-between"
            >
              <span>Notes</span>
              <span className="text-xs text-muted-foreground">
                {po.notes?.length || 0}/500 characters
              </span>
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes or instructions..."
              value={po.notes}
              onChange={(e) => setPo({ ...po, notes: e.target.value })}
              className="min-h-[120px]"
              maxLength={500}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePO;
