import React, { useEffect, useState } from "react";
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
import { formatCurrency } from "@/lib/formatters";
import { useConfig } from "@/contexts/ConfigContext";
import {
  deliveryAddressApi,
  departmentApi,
  paymentTermApi,
  unitOfMeasureApi,
  vendorApi,
} from "@/services/configurationApi";
import {
  poRequestApi,
  catalogItemsApi,
  type CatalogItem,
} from "@/services/poRequest";
import { catalogItems } from "@/data/mock-data";

// Fallback Units of Measure options (in case API fails)
const fallbackUnitsOfMeasure = [
  { id: 1, name: "Each" },
  { id: 2, name: "Box" },
  { id: 3, name: "Pound" },
  { id: 4, name: "Ounce" },
  { id: 5, name: "Gallon" },
  { id: 6, name: "Liter" },
  { id: 7, name: "Meter" },
  { id: 8, name: "Foot" },
  { id: 9, name: "Yard" },
  { id: 10, name: "Piece" },
  { id: 11, name: "Set" },
  { id: 12, name: "Unit" },
  { id: 13, name: "Case" },
  { id: 14, name: "Pallet" },
];

// Local interfaces for UI state management
interface ConfigItem {
  id: string;
  name: string;
}

interface UnitOfMeasure {
  id: number;
  name: string;
}
interface VendorDetails {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
}
interface DepartmentDetails {
  id: string;
  name: string;
  manager: string;
  email: string;
  budgetCode: string;
}
interface AddressDetails {
  id: string;
  name: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
// Loading states
interface LoadingStates {
  vendors: boolean;
  departments: boolean;
  deliveryAddresses: boolean;
  paymentTerms: boolean;
  unitsOfMeasure: boolean;
  catalogItems: boolean;
}

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
  const [uom, setUom] = useState<number>(0);
  const [dynamicUnitsOfMeasure, setDynamicUnitsOfMeasure] = useState<UnitOfMeasure[]>([]);
  const [customItem, setCustomItem] = useState(false);
  const [customItemCode, setCustomItemCode] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [customUnitPrice, setCustomUnitPrice] = useState<number>(0);
  
  // Loading state for UOM
  const [loadingUOM, setLoadingUOM] = useState(false);

  // Determine which UOM list to use (API data or fallback)
  const unitsOfMeasure = dynamicUnitsOfMeasure.length > 0 ? dynamicUnitsOfMeasure : fallbackUnitsOfMeasure;

  // Fetch units of measure data on component mount
  useEffect(() => {
    const fetchUnitsOfMeasure = async () => {
      try {
        setLoadingUOM(true);
        const unitsData = await unitOfMeasureApi.getAll();

        // Transform API data to match the UI interface
        const transformedUnits: UnitOfMeasure[] = unitsData.map((unit) => ({
          id: Number(unit.id),
          name: unit.name,
        }));

        setDynamicUnitsOfMeasure(transformedUnits);

        // Set first UOM as default if available and not already set
        if (transformedUnits.length > 0 && uom === 0) {
          setUom(transformedUnits[0].id);
        }

        toast.success(`Loaded ${transformedUnits.length} units of measure`);
      } catch (error) {
        console.error("Error fetching units of measure:", error);
        toast.error("Failed to load units of measure data");

        // Set default to first fallback UOM if API fails and not already set
        if (fallbackUnitsOfMeasure.length > 0 && uom === 0) {
          setUom(fallbackUnitsOfMeasure[0].id);
        }
      } finally {
        setLoadingUOM(false);
      }
    };

    fetchUnitsOfMeasure();
  }, []); // Remove dependencies to prevent infinite loops
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

      const selectedUom = unitsOfMeasure.find((u) => u.id === uom);
      const newItem: LineItem = {
        id: `custom-${Date.now()}`,
        itemCode: customItemCode,
        description: customDescription,
        quantity,
        uom: selectedUom?.name || "Each",
        uomId: selectedUom?.id || unitsOfMeasure[0]?.id,
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

      const selectedUom = unitsOfMeasure.find((u) => u.id === uom);
      const newItem: LineItem = {
        id: `${selectedCatalogItem.id}-${Date.now()}`,
        itemCode: selectedCatalogItem.itemCode,
        description: selectedCatalogItem.description,
        quantity,
        uom: selectedUom?.name || "Each",
        uomId: selectedUom?.id || unitsOfMeasure[0]?.id,
        unitPrice: selectedCatalogItem.unitPrice,
        totalPrice: selectedCatalogItem.unitPrice * quantity,
      };
      onAddItem(newItem);
    }

    // Reset form
    setSearchQuery("");
    setSelectedItemId("");
    setQuantity(1);
    setUom(unitsOfMeasure[0]?.id || fallbackUnitsOfMeasure[0]?.id || 1);
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
          <div className="border rounded-md overflow-hidden">
            <Table className="min-w-full" style={{ tableLayout: "fixed" }}>
              <TableHeader className="sticky top-0 z-10">
                <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                  <TableHead
                    className="font-semibold w-[100px] border-r-0 text-sm text-foreground h-12 border-b border-t px-4 py-1.5"
                    style={{
                      backgroundColor: "#DFE7F3",
                      borderBottomColor: "#c9d1e0",
                      borderTopColor: "#c9d1e0",
                    }}
                  >
                    Item Code
                  </TableHead>
                  <TableHead
                    className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t px-4 py-1.5"
                    style={{
                      backgroundColor: "#DFE7F3",
                      borderBottomColor: "#c9d1e0",
                      borderTopColor: "#c9d1e0",
                    }}
                  >
                    Description
                  </TableHead>
                  <TableHead
                    className="font-semibold text-right border-r-0 text-sm text-foreground h-12 border-b border-t px-4 py-1.5"
                    style={{
                      backgroundColor: "#DFE7F3",
                      borderBottomColor: "#c9d1e0",
                      borderTopColor: "#c9d1e0",
                    }}
                  >
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
                        "cursor-pointer h-12 hover:bg-muted/50 transition-colors",
                        selectedItemId === item.id ? "bg-muted/30" : ""
                      )}
                      onClick={() => setSelectedItemId(item.id)}
                    >
                      <TableCell className="font-mono text-sm font-medium py-2 border-r-0 text-foreground px-4">
                        {item.itemCode}
                      </TableCell>
                      <TableCell className="py-2 border-r-0 text-sm text-foreground px-4">
                        {item.description}
                      </TableCell>
                      <TableCell className="text-right font-medium py-2 border-r-0 text-sm text-foreground px-4">
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
            <Select
              value={uom.toString()}
              onValueChange={(value) => setUom(Number(value))}
            >
              <SelectTrigger id="uom">
                <SelectValue placeholder="Select UoM" />
              </SelectTrigger>
              <SelectContent>
                {loadingUOM ? (
                  <SelectItem value="loading" disabled>
                    Loading units...
                  </SelectItem>
                ) : (
                  unitsOfMeasure.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id.toString()}>
                      {unit.name}
                    </SelectItem>
                  ))
                )}
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
  const { settings } = useConfig();
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
  const [files, setFiles] = useState<File[]>([]);

  // Loading states
  const [loading, setLoading] = useState<LoadingStates>({
    vendors: false,
    departments: false,
    deliveryAddresses: false,
    paymentTerms: false,
    unitsOfMeasure: false,
    catalogItems: false,
  });

  // Detailed data states
  const [detailedVendors, setDetailedVendors] = useState<VendorDetails[]>([]);
  const [detailedDepartments, setDetailedDepartments] = useState<
    DepartmentDetails[]
  >([]);
  const [detailedAddresses, setDetailedAddresses] = useState<AddressDetails[]>(
    []
  );
  const [staticPaymentTerms, setStaticPaymentTerms] = useState<ConfigItem[]>(
    []
  );

  // Generate a reference number on component mount
  React.useEffect(() => {
    // Generate new reference
    const prefix = "PO-";
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    setReference(`${prefix}${randomNum}`);
  }, []);

  // Fetch vendors data on component mount
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading((prev) => ({ ...prev, vendors: true }));
        const vendorsData = await vendorApi.getAll();

        // Transform API data to match the UI interface
        const transformedVendors: VendorDetails[] = vendorsData.map(
          (vendor) => ({
            id: vendor.id.toString(),
            name: vendor.name,
            contactPerson: vendor.contact_person || "",
            email: vendor.email || "",
            phone: vendor.phone || "",
            address: vendor.address || "",
          })
        );

        setDetailedVendors(transformedVendors);
        toast.success(`Loaded ${transformedVendors.length} vendors`);
      } catch (error) {
        console.error("Error fetching vendors:", error);
        toast.error("Failed to load vendors data");
      } finally {
        setLoading((prev) => ({ ...prev, vendors: false }));
      }
    };

    fetchVendors();
  }, []);

  // Fetch departments data on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading((prev) => ({ ...prev, departments: true }));
        const departmentsData = await departmentApi.getAll();

        // Transform API data to match the UI interface
        const transformedDepartments: DepartmentDetails[] = departmentsData.map(
          (department) => ({
            id: department.id.toString(),
            name: department.name,
            manager: department.manager || "",
            email: department.email || "",
            budgetCode: department.budget_code || "",
          })
        );

        setDetailedDepartments(transformedDepartments);
        toast.success(`Loaded ${transformedDepartments.length} departments`);
      } catch (error) {
        console.error("Error fetching departments:", error);
        toast.error("Failed to load departments data");
      } finally {
        setLoading((prev) => ({ ...prev, departments: false }));
      }
    };

    fetchDepartments();
  }, []);

  // Fetch delivery addresses data on component mount
  useEffect(() => {
    const fetchDeliveryAddresses = async () => {
      try {
        setLoading((prev) => ({ ...prev, deliveryAddresses: true }));
        const addressesData = await deliveryAddressApi.getAll();

        // Transform API data to match the UI interface
        const transformedAddresses: AddressDetails[] = addressesData.map(
          (address) => ({
            id: address.id.toString(),
            name: address.name,
            streetAddress: address.street_address,
            city: address.city,
            state: address.state,
            zipCode: address.zip_code,
            country: address.country,
          })
        );

        setDetailedAddresses(transformedAddresses);
        toast.success(
          `Loaded ${transformedAddresses.length} delivery addresses`
        );
      } catch (error) {
        console.error("Error fetching delivery addresses:", error);
        toast.error("Failed to load delivery addresses data");
      } finally {
        setLoading((prev) => ({ ...prev, deliveryAddresses: false }));
      }
    };

    fetchDeliveryAddresses();
  }, []);

  // Fetch payment terms data on component mount
  useEffect(() => {
    const fetchPaymentTerms = async () => {
      try {
        setLoading((prev) => ({ ...prev, paymentTerms: true }));
        const paymentTermsData = await paymentTermApi.getAll();

        // Transform API data to match the UI interface - storing as static items for now
        const transformedPaymentTerms: ConfigItem[] = paymentTermsData.map(
          (term) => ({
            id: term.id.toString(),
            name: term.name,
          })
        );

        setStaticPaymentTerms(transformedPaymentTerms);
        toast.success(`Loaded ${transformedPaymentTerms.length} payment terms`);
      } catch (error) {
        console.error("Error fetching payment terms:", error);
        toast.error("Failed to load payment terms data");
      } finally {
        setLoading((prev) => ({ ...prev, paymentTerms: false }));
      }
    };

    fetchPaymentTerms();
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

  // File input handler
  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;
    setFiles((prev) => [...prev, ...Array.from(selectedFiles)]);
  };

  // Remove a file from list
  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!po.title || !po.vendor || !po.department) {
      toast.error("Please fill in required fields (Title, Vendor, Department)");
      return;
    }

    if (!po.lineItems?.length) {
      toast.error("Please add at least one line item");
      return;
    }

    // Transform line items for API
    const transformedItems = po.lineItems.map((item) => {
      const transformed = {
        item_code: item.itemCode,
        description: item.description,
        quantity: item.quantity,
        uom: item.uomId || fallbackUnitsOfMeasure[0]?.id || 1,
        unit_price: item.unitPrice,
      };
      return transformed;
    });

    // Prepare FormData for file uploads
    const formData = new FormData();
    formData.append("title", po.title!);
    formData.append("vendor_id", po.vendor!);
    formData.append("department", po.department!);
    if (po.expectedDeliveryDate)
      formData.append("due_date", po.expectedDeliveryDate.toISOString());
    if (po.deliveryAddress) formData.append("address", po.deliveryAddress!);
    if (po.paymentTerms) formData.append("payment_terms", po.paymentTerms!);
    if (po.notes) formData.append("notes", po.notes);
    formData.append("total", calculateTotal().toString());
    formData.append("reference", reference);

    // Append line items (as JSON string or as fields, depending on backend)
    transformedItems.forEach((item, idx) => {
      formData.append(`items[${idx}][item_code]`, item.item_code);
      formData.append(`items[${idx}][description]`, item.description);
      formData.append(`items[${idx}][quantity]`, item.quantity.toString());
      formData.append(`items[${idx}][uom]`, item.uom.toString());
      formData.append(`items[${idx}][unit_price]`, item.unit_price.toString());
    });

    // Append files
    files.forEach((file, idx) => {
      formData.append("documents", file); // "documents" is the field name; adjust per backend requirements
    });

    try {
      console.log("formData ", formData);

      // Use fetch or axios for multipart/form-data
      const response = await poRequestApi.create(formData); // Ensure poRequestApi.create supports FormData
      toast.success("Purchase order created successfully");

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
    } catch (error) {
      console.error("Error creating purchase order:", error);
      toast.error("Failed to create purchase order");
    }
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
                  {loading.vendors ? (
                    <SelectItem value="loading" disabled>
                      Loading vendors...
                    </SelectItem>
                  ) : (
                    detailedVendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="requestor" className="text-sm">
                Requestor
              </Label>
              <Input
                id="requestor"
                value={po.requestor || "Alex Johnson"}
                readOnly={!settings.isRequestorEditable}
                onChange={
                  settings.isRequestorEditable
                    ? (e) => setPo({ ...po, requestor: e.target.value })
                    : undefined
                }
                className={cn(
                  "h-9",
                  !settings.isRequestorEditable &&
                    "bg-gray-100 cursor-not-allowed"
                )}
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
                  {loading.departments ? (
                    <SelectItem value="loading" disabled>
                      Loading departments...
                    </SelectItem>
                  ) : (
                    detailedDepartments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))
                  )}
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
                  {loading.deliveryAddresses ? (
                    <SelectItem value="loading" disabled>
                      Loading addresses...
                    </SelectItem>
                  ) : (
                    detailedAddresses.map((address) => (
                      <SelectItem key={address.id} value={address.id}>
                        {address.name}
                      </SelectItem>
                    ))
                  )}
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
                  {loading.paymentTerms ? (
                    <SelectItem value="loading" disabled>
                      Loading payment terms...
                    </SelectItem>
                  ) : (
                    staticPaymentTerms.map((term) => (
                      <SelectItem key={term.id} value={term.id}>
                        {term.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Line Items Section */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-medium border-b pb-2">Line Items</h2>

          <div className="border rounded-md overflow-hidden">
            <Table className="min-w-full" style={{ tableLayout: "fixed" }}>
              <TableHeader className="sticky top-0 z-10">
                <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                  <TableHead
                    className="font-semibold w-[100px] border-r-0 text-sm text-foreground h-12 border-b border-t px-4 py-1.5"
                    style={{
                      backgroundColor: "#DFE7F3",
                      borderBottomColor: "#c9d1e0",
                      borderTopColor: "#c9d1e0",
                    }}
                  >
                    Item Code
                  </TableHead>
                  <TableHead
                    className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t px-4 py-1.5"
                    style={{
                      backgroundColor: "#DFE7F3",
                      borderBottomColor: "#c9d1e0",
                      borderTopColor: "#c9d1e0",
                    }}
                  >
                    Description
                  </TableHead>
                  <TableHead
                    className="font-semibold w-[100px] text-right border-r-0 text-sm text-foreground h-12 border-b border-t px-4 py-1.5"
                    style={{
                      backgroundColor: "#DFE7F3",
                      borderBottomColor: "#c9d1e0",
                      borderTopColor: "#c9d1e0",
                    }}
                  >
                    Quantity
                  </TableHead>
                  <TableHead
                    className="font-semibold w-[120px] text-right border-r-0 text-sm text-foreground h-12 border-b border-t px-4 py-1.5"
                    style={{
                      backgroundColor: "#DFE7F3",
                      borderBottomColor: "#c9d1e0",
                      borderTopColor: "#c9d1e0",
                    }}
                  >
                    UoM
                  </TableHead>
                  <TableHead
                    className="font-semibold w-[120px] text-right border-r-0 text-sm text-foreground h-12 border-b border-t px-4 py-1.5"
                    style={{
                      backgroundColor: "#DFE7F3",
                      borderBottomColor: "#c9d1e0",
                      borderTopColor: "#c9d1e0",
                    }}
                  >
                    Unit Price
                  </TableHead>
                  <TableHead
                    className="font-semibold w-[120px] text-right border-r-0 text-sm text-foreground h-12 border-b border-t px-4 py-1.5"
                    style={{
                      backgroundColor: "#DFE7F3",
                      borderBottomColor: "#c9d1e0",
                      borderTopColor: "#c9d1e0",
                    }}
                  >
                    Total
                  </TableHead>
                  <TableHead
                    className="font-semibold w-[100px] text-center border-r-0 text-sm text-foreground h-12 border-b border-t px-4 py-1.5"
                    style={{
                      backgroundColor: "#DFE7F3",
                      borderBottomColor: "#c9d1e0",
                      borderTopColor: "#c9d1e0",
                    }}
                  >
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
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={() =>
                  document.getElementById("po-file-input")?.click()
                }
              >
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="font-medium">Drag & drop files here</p>
                <p className="text-sm text-muted-foreground">
                  or click to browse
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById("po-file-input")?.click();
                  }}
                >
                  Browse Files
                </Button>
                <input
                  id="po-file-input"
                  type="file"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleFilesChange}
                />
              </div>
              {files.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Selected Files:</h4>
                  <ul className="list-disc pl-5">
                    {files.map((file, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between mb-1"
                      >
                        <span>{file.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFile(idx)}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
