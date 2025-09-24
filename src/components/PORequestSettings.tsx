import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Plus, Edit, Trash2, X, Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { POPreview } from "@/components/purchase-order/POPreview";
import { createSamplePO } from "@/utils/sampleData";
import { PurchaseOrder } from "@/types/purchase-order";
import { toast } from "sonner";
import {
  vendorApi,
  departmentApi,
  deliveryAddressApi,
  paymentTermApi,
  unitOfMeasureApi,
  settingsApi,
  type Vendor,
  type Department,
  type DeliveryAddress,
  type PaymentTerm,
  type UnitOfMeasure,
  type Setting,
} from "@/services/configurationApi";
import { catalogItemsApi, type CatalogItem } from "@/services/poRequest";

const PORequestSettings = () => {
  const [activeTab, setActiveTab] = useState("fields");

  // API Data States
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [deliveryAddresses, setDeliveryAddresses] = useState<DeliveryAddress[]>(
    []
  );
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerm[]>([]);
  const [unitsOfMeasure, setUnitsOfMeasure] = useState<UnitOfMeasure[]>([]);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);

  // Loading States
  const [loading, setLoading] = useState({
    vendors: false,
    departments: false,
    deliveryAddresses: false,
    paymentTerms: false,
    unitsOfMeasure: false,
    catalogItems: false,
  });

  // Modal States
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [showAddPaymentTermModal, setShowAddPaymentTermModal] = useState(false);
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  // Edit States
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );
  const [editingAddress, setEditingAddress] = useState<DeliveryAddress | null>(
    null
  );
  const [editingPaymentTerm, setEditingPaymentTerm] =
    useState<PaymentTerm | null>(null);
  const [editingUnit, setEditingUnit] = useState<UnitOfMeasure | null>(null);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);

  // Template States
  const [selectedTemplate, setSelectedTemplate] = useState<
    "classic" | "centered" | "modern"
  >("classic");
  const [samplePO] = useState<PurchaseOrder>(createSamplePO());

  // Settings States
  const [poReferenceFieldEnabled, setPOReferenceFieldEnabled] = useState(false);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [settingsLoading, setSettingsLoading] = useState(false);

  // Form States
  const [vendorForm, setVendorForm] = useState({
    vendorName: "",
    contactPerson: "",
    email: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    taxId: "",
  });

  const [departmentForm, setDepartmentForm] = useState({
    name: "",
    manager: "",
    email: "",
    budgetCode: "",
  });

  const [addressForm, setAddressForm] = useState({
    name: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [paymentTermForm, setPaymentTermForm] = useState({
    name: "",
  });

  const [unitForm, setUnitForm] = useState({
    name: "",
  });

  const [itemForm, setItemForm] = useState({
    itemCode: "",
    description: "",
    unitPrice: 0,
    uom: "",
  });

  // Handle vendor form input changes
  const handleVendorInputChange = (field: string, value: string) => {
    setVendorForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle department form input changes
  const handleDepartmentInputChange = (field: string, value: string) => {
    setDepartmentForm((prev) => ({ ...prev, [field]: value }));
  };

  // Handle address form input changes
  const handleAddressInputChange = (field: string, value: string) => {
    setAddressForm((prev) => ({ ...prev, [field]: value }));
  };

  // Handle payment term form input changes
  const handlePaymentTermInputChange = (field: string, value: string) => {
    setPaymentTermForm((prev) => ({ ...prev, [field]: value }));
  };

  // Handle unit form input changes
  const handleUnitInputChange = (field: string, value: string) => {
    setUnitForm((prev) => ({ ...prev, [field]: value }));
  };

  // Handle item form input changes
  const handleItemInputChange = (field: string, value: string | number) => {
    setItemForm((prev) => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // API Data Fetching useEffect hooks
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading((prev) => ({ ...prev, vendors: true }));
        const vendorsData = await vendorApi.getAll();
        setVendors(vendorsData);
        // toast.success(`Loaded ${vendorsData.length} vendors`);
      } catch (error) {
        console.error("Error fetching vendors:", error);
        toast.error("Failed to load vendors data");
      } finally {
        setLoading((prev) => ({ ...prev, vendors: false }));
      }
    };
    fetchVendors();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading((prev) => ({ ...prev, departments: true }));
        const departmentsData = await departmentApi.getAll();
        setDepartments(departmentsData);
        // toast.success(`Loaded ${departmentsData.length} departments`);
      } catch (error) {
        console.error("Error fetching departments:", error);
        toast.error("Failed to load departments data");
      } finally {
        setLoading((prev) => ({ ...prev, departments: false }));
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchDeliveryAddresses = async () => {
      try {
        setLoading((prev) => ({ ...prev, deliveryAddresses: true }));
        const addressesData = await deliveryAddressApi.getAll();
        setDeliveryAddresses(addressesData);
        // toast.success(`Loaded ${addressesData.length} delivery addresses`);
      } catch (error) {
        console.error("Error fetching delivery addresses:", error);
        toast.error("Failed to load delivery addresses data");
      } finally {
        setLoading((prev) => ({ ...prev, deliveryAddresses: false }));
      }
    };
    fetchDeliveryAddresses();
  }, []);

  useEffect(() => {
    const fetchPaymentTerms = async () => {
      try {
        setLoading((prev) => ({ ...prev, paymentTerms: true }));
        const paymentTermsData = await paymentTermApi.getAll();
        setPaymentTerms(paymentTermsData);
        // toast.success(`Loaded ${paymentTermsData.length} payment terms`);
      } catch (error) {
        console.error("Error fetching payment terms:", error);
        toast.error("Failed to load payment terms data");
      } finally {
        setLoading((prev) => ({ ...prev, paymentTerms: false }));
      }
    };
    fetchPaymentTerms();
  }, []);

  useEffect(() => {
    const fetchUnitsOfMeasure = async () => {
      try {
        setLoading((prev) => ({ ...prev, unitsOfMeasure: true }));
        const unitsData = await unitOfMeasureApi.getAll();
        setUnitsOfMeasure(unitsData);
        // toast.success(`Loaded ${unitsData.length} units of measure`);
      } catch (error) {
        console.error("Error fetching units of measure:", error);
        toast.error("Failed to load units of measure data");
      } finally {
        setLoading((prev) => ({ ...prev, unitsOfMeasure: false }));
      }
    };
    fetchUnitsOfMeasure();
  }, []);

  useEffect(() => {
    const fetchCatalogItems = async () => {
      try {
        setLoading((prev) => ({ ...prev, catalogItems: true }));
        const itemsData = await catalogItemsApi.getAll();
        setCatalogItems(itemsData);
        // toast.success(`Loaded ${itemsData.length} catalog items`);
      } catch (error) {
        console.error("Error fetching catalog items:", error);
        toast.error("Failed to load catalog items data");
      } finally {
        setLoading((prev) => ({ ...prev, catalogItems: false }));
      }
    };
    fetchCatalogItems();
  }, []);

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setSettingsLoading(true);
        console.log("Loading settings from API...");

        // Fetch PO Reference Field setting
        console.log("Fetching PO Reference Field setting...");
        const poRefSetting = await settingsApi.get(
          "po_reference_field_enabled"
        );
        if (poRefSetting) {
          // Handle string values: "true"/"false" or "enabled"/"disabled"
          const stringValue = String(poRefSetting.value).toLowerCase();
          const isEnabled = stringValue === "true" || stringValue === "enabled";
          setPOReferenceFieldEnabled(isEnabled);
          console.log(
            `PO Reference Field setting loaded: ${poRefSetting.value} -> ${isEnabled}`
          );
        } else {
          console.log(
            "PO Reference Field setting not found, using default: false"
          );
          setPOReferenceFieldEnabled(false);
        }

        // Fetch Template setting
        console.log("Fetching Purchase Order Template setting...");
        const templateSetting = await settingsApi.get(
          "purchase_order_template"
        );
        if (
          templateSetting &&
          ["classic", "centered", "modern"].includes(templateSetting.value)
        ) {
          setSelectedTemplate(templateSetting.value);
          console.log(
            `Purchase Order Template setting loaded: ${templateSetting.value}`
          );
        } else {
          console.log(
            "Purchase Order Template setting not found or invalid, using default: classic"
          );
          setSelectedTemplate("classic");
        }

        // Fetch all settings for potential future use
        console.log("Fetching all settings...");
        const allSettings = await settingsApi.getAll();
        setSettings(allSettings);
        // toast.success("Settings loaded successfully");
      } catch (error) {
        console.error("Error fetching settings:", error);
        toast.error(
          "Failed to load settings. Please check the console for details."
        );
      } finally {
        setSettingsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Vendor CRUD operations
  const onEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setVendorForm({
      vendorName: vendor.name || "",
      contactPerson: vendor.contact_person || "",
      email: vendor.email || "",
      phone: vendor.phone || "",
      streetAddress: vendor.street_address || "",
      city: vendor.city || "",
      state: vendor.state || "",
      zipCode: vendor.zipcode || "",
      country: "",
      taxId: "",
    });
    setShowAddVendorModal(true);
  };

  const resetVendorForm = () => {
    setVendorForm({
      vendorName: "",
      contactPerson: "",
      email: "",
      phone: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      taxId: "",
    });
    setEditingVendor(null);
  };

  const handleSaveVendor = async () => {
    if (
      !vendorForm.vendorName.trim() ||
      !vendorForm.contactPerson.trim() ||
      !vendorForm.email.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      setLoading((prev) => ({ ...prev, vendors: true }));
      const vendorData = {
        name: vendorForm.vendorName,
        contact_person: vendorForm.contactPerson,
        email: vendorForm.email,
        phone: vendorForm.phone,
        street_address: vendorForm.streetAddress,
        city: vendorForm.city,
        state: vendorForm.state,
        zipcode: vendorForm.zipCode,
      };

      if (editingVendor) {
        const updated = await vendorApi.update(editingVendor.id, vendorData);
        setVendors((prev) =>
          prev.map((v) => (v.id === updated.id ? updated : v))
        );
        toast.success("Vendor updated successfully");
      } else {
        const createdVendor = await vendorApi.create(vendorData);
        setVendors((prev) => [...prev, createdVendor]);
        toast.success("Vendor added successfully");
      }

      // Reset form and close modal
      resetVendorForm();
      setShowAddVendorModal(false);
    } catch (error) {
      console.error("Error saving vendor:", error);
      toast.error("Failed to save vendor");
    } finally {
      setLoading((prev) => ({ ...prev, vendors: false }));
    }
  };

  const handleDeleteVendor = async (id: number) => {
    try {
      setLoading((prev) => ({ ...prev, vendors: true }));
      await vendorApi.delete(id);
      setVendors(vendors.filter((vendor) => vendor.id !== id));
      toast.success("Vendor deleted successfully");
    } catch (error) {
      console.error("Error deleting vendor:", error);
      toast.error("Failed to delete vendor");
    } finally {
      setLoading((prev) => ({ ...prev, vendors: false }));
    }
  };

  // Handle cancel vendor form
  const handleCancelVendor = () => {
    // Reset form and close modal
    resetVendorForm();
    setShowAddVendorModal(false);
  };

  // Department CRUD operations
  const onEditDepartment = (dept: Department) => {
    setEditingDepartment(dept);
    setDepartmentForm({
      name: dept.name || "",
      manager: dept.manager || "",
      email: dept.email || "",
      budgetCode: dept.budget_code || "",
    });
    setShowAddDepartmentModal(true);
  };

  const resetDepartmentForm = () => {
    setDepartmentForm({ name: "", manager: "", email: "", budgetCode: "" });
    setEditingDepartment(null);
  };

  const handleSaveDepartment = async () => {
    if (
      !departmentForm.name.trim() ||
      !departmentForm.manager.trim() ||
      !departmentForm.email.trim() ||
      !departmentForm.budgetCode.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      setLoading((prev) => ({ ...prev, departments: true }));
      const departmentData = {
        name: departmentForm.name,
        manager: departmentForm.manager,
        email: departmentForm.email,
        budget_code: departmentForm.budgetCode,
      };

      if (editingDepartment) {
        const updated = await departmentApi.update(
          editingDepartment.id,
          departmentData
        );
        setDepartments((prev) =>
          prev.map((d) => (d.id === updated.id ? updated : d))
        );
        toast.success("Department updated successfully");
      } else {
        const createdDepartment = await departmentApi.create(departmentData);
        setDepartments((prev) => [...prev, createdDepartment]);
        toast.success("Department added successfully");
      }

      resetDepartmentForm();
      setShowAddDepartmentModal(false);
    } catch (error) {
      console.error("Error saving department:", error);
      toast.error("Failed to save department");
    } finally {
      setLoading((prev) => ({ ...prev, departments: false }));
    }
  };

  const handleDeleteDepartment = async (id: number) => {
    try {
      setLoading((prev) => ({ ...prev, departments: true }));
      await departmentApi.delete(id);
      setDepartments(departments.filter((dept) => dept.id !== id));
      toast.success("Department deleted successfully");
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error("Failed to delete department");
    } finally {
      setLoading((prev) => ({ ...prev, departments: false }));
    }
  };

  // Address CRUD operations
  const onEditAddress = (addr: DeliveryAddress) => {
    setEditingAddress(addr);
    setAddressForm({
      name: addr.name || "",
      streetAddress: addr.street_address || "",
      city: addr.city || "",
      state: addr.state || "",
      zipCode: addr.zip_code || "",
      country: addr.country || "",
    });
    setShowAddAddressModal(true);
  };

  const resetAddressForm = () => {
    setAddressForm({
      name: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    });
    setEditingAddress(null);
  };

  const handleSaveAddress = async () => {
    if (
      !addressForm.name.trim() ||
      !addressForm.streetAddress.trim() ||
      !addressForm.city.trim() ||
      !addressForm.state.trim() ||
      !addressForm.zipCode.trim() ||
      !addressForm.country.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      setLoading((prev) => ({ ...prev, deliveryAddresses: true }));
      const addressData = {
        name: addressForm.name,
        street_address: addressForm.streetAddress,
        city: addressForm.city,
        state: addressForm.state,
        zip_code: addressForm.zipCode,
        country: addressForm.country,
      };

      if (editingAddress) {
        const updated = await deliveryAddressApi.update(
          editingAddress.id,
          addressData
        );
        setDeliveryAddresses((prev) =>
          prev.map((a) => (a.id === updated.id ? updated : a))
        );
        toast.success("Address updated successfully");
      } else {
        const createdAddress = await deliveryAddressApi.create(addressData);
        setDeliveryAddresses((prev) => [...prev, createdAddress]);
        toast.success("Address added successfully");
      }

      resetAddressForm();
      setShowAddAddressModal(false);
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address");
    } finally {
      setLoading((prev) => ({ ...prev, deliveryAddresses: false }));
    }
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      setLoading((prev) => ({ ...prev, deliveryAddresses: true }));
      await deliveryAddressApi.delete(id);
      setDeliveryAddresses(deliveryAddresses.filter((addr) => addr.id !== id));
      toast.success("Address deleted successfully");
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    } finally {
      setLoading((prev) => ({ ...prev, deliveryAddresses: false }));
    }
  };

  // Payment Terms CRUD operations
  const onEditPaymentTerm = (term: PaymentTerm) => {
    setEditingPaymentTerm(term);
    setPaymentTermForm({ name: term.name || "" });
    setShowAddPaymentTermModal(true);
  };

  const resetPaymentTermForm = () => {
    setPaymentTermForm({ name: "" });
    setEditingPaymentTerm(null);
  };

  const handleSavePaymentTerm = async () => {
    if (!paymentTermForm.name.trim()) {
      toast.error("Please enter payment term name");
      return;
    }
    try {
      setLoading((prev) => ({ ...prev, paymentTerms: true }));
      const termData = { name: paymentTermForm.name };

      if (editingPaymentTerm) {
        const updated = await paymentTermApi.update(
          editingPaymentTerm.id,
          termData
        );
        setPaymentTerms((prev) =>
          prev.map((t) => (t.id === updated.id ? updated : t))
        );
        toast.success("Payment term updated successfully");
      } else {
        const createdTerm = await paymentTermApi.create(termData);
        setPaymentTerms((prev) => [...prev, createdTerm]);
        toast.success("Payment term added successfully");
      }

      resetPaymentTermForm();
      setShowAddPaymentTermModal(false);
    } catch (error) {
      console.error("Error saving payment term:", error);
      toast.error("Failed to save payment term");
    } finally {
      setLoading((prev) => ({ ...prev, paymentTerms: false }));
    }
  };

  const handleDeletePaymentTerm = async (id: number) => {
    try {
      setLoading((prev) => ({ ...prev, paymentTerms: true }));
      await paymentTermApi.delete(id);
      setPaymentTerms(paymentTerms.filter((term) => term.id !== id));
      toast.success("Payment term deleted successfully");
    } catch (error) {
      console.error("Error deleting payment term:", error);
      toast.error("Failed to delete payment term");
    } finally {
      setLoading((prev) => ({ ...prev, paymentTerms: false }));
    }
  };

  // Unit of Measure CRUD operations
  const onEditUnit = (u: UnitOfMeasure) => {
    setEditingUnit(u);
    setUnitForm({ name: u.name || "" });
    setShowAddUnitModal(true);
  };

  const resetUnitForm = () => {
    setUnitForm({ name: "" });
    setEditingUnit(null);
  };

  const handleSaveUnit = async () => {
    if (!unitForm.name.trim()) {
      toast.error("Please enter unit name");
      return;
    }
    try {
      setLoading((prev) => ({ ...prev, unitsOfMeasure: true }));
      const unitData = { name: unitForm.name };

      if (editingUnit) {
        const updated = await unitOfMeasureApi.update(editingUnit.id, unitData);
        setUnitsOfMeasure((prev) =>
          prev.map((u) => (u.id === updated.id ? updated : u))
        );
        toast.success("Unit of measure updated successfully");
      } else {
        const createdUnit = await unitOfMeasureApi.create(unitData);
        setUnitsOfMeasure((prev) => [...prev, createdUnit]);
        toast.success("Unit of measure added successfully");
      }

      resetUnitForm();
      setShowAddUnitModal(false);
    } catch (error) {
      console.error("Error saving unit:", error);
      toast.error("Failed to save unit of measure");
    } finally {
      setLoading((prev) => ({ ...prev, unitsOfMeasure: false }));
    }
  };

  const handleDeleteUnit = async (id: number) => {
    try {
      setLoading((prev) => ({ ...prev, unitsOfMeasure: true }));
      await unitOfMeasureApi.delete(id);
      setUnitsOfMeasure(unitsOfMeasure.filter((unit) => unit.id !== id));
      toast.success("Unit of measure deleted successfully");
    } catch (error) {
      console.error("Error deleting unit:", error);
      toast.error("Failed to delete unit of measure");
    } finally {
      setLoading((prev) => ({ ...prev, unitsOfMeasure: false }));
    }
  };

  // Catalog Item CRUD operations
  const onEditItem = (ci: CatalogItem) => {
    setEditingItem(ci);
    setItemForm({
      itemCode: ci.item_code || "",
      description: ci.description || "",
      unitPrice: ci.unit_price || 0,
      uom: ci.uom || "",
    });
    setShowAddItemModal(true);
  };

  const resetItemForm = () => {
    setItemForm({ itemCode: "", description: "", unitPrice: 0, uom: "" });
    setEditingItem(null);
  };

  const handleSaveItem = async () => {
    if (
      !itemForm.itemCode.trim() ||
      !itemForm.description.trim() ||
      !itemForm.uom.trim() ||
      itemForm.unitPrice <= 0
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      setLoading((prev) => ({ ...prev, catalogItems: true }));
      const itemData = {
        item_code: itemForm.itemCode,
        description: itemForm.description,
        unit_price: itemForm.unitPrice,
        uom: itemForm.uom,
      };

      if (editingItem) {
        const updated = await catalogItemsApi.update(editingItem.id, itemData);
        setCatalogItems((prev) =>
          prev.map((i) => (i.id === updated.id ? updated : i))
        );
        toast.success("Catalog item updated successfully");
      } else {
        const createdItem = await catalogItemsApi.create(itemData);
        setCatalogItems((prev) => [...prev, createdItem]);
        toast.success("Catalog item added successfully");
      }

      resetItemForm();
      setShowAddItemModal(false);
    } catch (error) {
      console.error("Error saving item:", error);
      toast.error("Failed to save catalog item");
    } finally {
      setLoading((prev) => ({ ...prev, catalogItems: false }));
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      setLoading((prev) => ({ ...prev, catalogItems: true }));
      await catalogItemsApi.delete(id);
      setCatalogItems(catalogItems.filter((item) => item.id !== id));
      toast.success("Catalog item deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete catalog item");
    } finally {
      setLoading((prev) => ({ ...prev, catalogItems: false }));
    }
  };

  // Settings update handlers
  const handlePOReferenceFieldToggle = async (enabled: boolean) => {
    try {
      setSettingsLoading(true);
      // Send string value instead of boolean
      const stringValue = enabled ? "enabled" : "disabled";
      await settingsApi.update("po_reference_field_enabled", stringValue);
      setPOReferenceFieldEnabled(enabled);
      toast.success(`PO Reference Field ${enabled ? "enabled" : "disabled"}`);
    } catch (error) {
      console.error("Error updating PO Reference Field setting:", error);
      toast.error("Failed to update PO Reference Field setting");
      // Revert the toggle
      setPOReferenceFieldEnabled(!enabled);
    } finally {
      setSettingsLoading(false);
    }
  };

  // Template functionality
  const handleSaveTemplate = async () => {
    try {
      setSettingsLoading(true);
      await settingsApi.update("purchase_order_template", selectedTemplate);
      toast.success(
        `Template saved: ${
          selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)
        }`
      );
    } catch (error) {
      console.error("Error saving template setting:", error);
      toast.error("Failed to save template setting");
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleTemplateChange = (value: "classic" | "centered" | "modern") => {
    setSelectedTemplate(value);
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
            <h1 className="text-xl font-semibold text-foreground font-inter">
              PO Request Settings
            </h1>
          </div>
        </div>

        {/* Main Tabs */}
        <div className="border-b border-border flex items-center justify-between px-0 -mt-2">
          <div className="flex items-center flex-1 -mb-px pb-1">
            {[
              { key: "fields", label: "Fields" },
              { key: "vendors", label: "Vendors" },
              { key: "departments", label: "Departments" },
              { key: "addresses", label: "Addresses" },
              { key: "payment", label: "Payment" },
              { key: "units", label: "Units" },
              { key: "items", label: "Items" },
              { key: "costs", label: "Costs" },
              { key: "template", label: "Template" },
            ].map((tab, index) => (
              <button
                key={tab.key}
                className={`
                   px-4 py-2.5 flex items-center gap-2 justify-center transition-all duration-200 relative border-b-2
                   ${index > 0 ? "-ml-px" : ""}
                   ${
                     activeTab === tab.key
                       ? `bg-white text-gray-900 font-semibold z-10 border-b-[#27313e] shadow-md border-transparent rounded-t-md`
                       : "text-muted-foreground font-medium hover:bg-gray-50 hover:text-gray-700 border-b-transparent"
                   }
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
        {activeTab === "fields" && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Field Configuration
              </h3>
            </div>
            {/* PO Reference Field Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div className="space-y-1">
                  <h3 className="text-base font-medium text-foreground">
                    PO Reference Field
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {poReferenceFieldEnabled
                      ? "Field is editable by users"
                      : "Field is read-only"}
                  </p>
                  {settingsLoading && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Updating setting...
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="po-reference"
                    checked={poReferenceFieldEnabled}
                    onCheckedChange={handlePOReferenceFieldToggle}
                    disabled={settingsLoading}
                  />
                  <Label htmlFor="po-reference" className="sr-only">
                    Toggle PO Reference Field
                  </Label>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "vendors" && (
          <div className="space-y-4 pt-4">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Vendor Management
              </h3>
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
                  height: "auto",
                }}
              >
                <Table className="min-w-full" style={{ tableLayout: "fixed" }}>
                  <TableHeader className="sticky top-0 z-10">
                    <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                      <TableHead
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t"
                        style={{
                          backgroundColor: "#DFE7F3",
                          borderBottomColor: "#c9d1e0",
                          borderTopColor: "#c9d1e0",
                        }}
                      >
                        Vendor Name
                      </TableHead>
                      <TableHead
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t"
                        style={{
                          backgroundColor: "#DFE7F3",
                          borderBottomColor: "#c9d1e0",
                          borderTopColor: "#c9d1e0",
                        }}
                      >
                        Contact Person
                      </TableHead>
                      <TableHead
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t"
                        style={{
                          backgroundColor: "#DFE7F3",
                          borderBottomColor: "#c9d1e0",
                          borderTopColor: "#c9d1e0",
                        }}
                      >
                        Email
                      </TableHead>
                      <TableHead
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t"
                        style={{
                          backgroundColor: "#DFE7F3",
                          borderBottomColor: "#c9d1e0",
                          borderTopColor: "#c9d1e0",
                        }}
                      >
                        Phone
                      </TableHead>
                      <TableHead
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t"
                        style={{
                          backgroundColor: "#DFE7F3",
                          borderBottomColor: "#c9d1e0",
                          borderTopColor: "#c9d1e0",
                        }}
                      >
                        Location
                      </TableHead>
                      <TableHead
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t text-right"
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
                    {loading.vendors ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-16 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading vendors...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : vendors.length > 0 ? (
                      vendors.map((vendor) => (
                        <TableRow
                          key={vendor.id}
                          className="h-10 hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">
                            {vendor.name}
                          </TableCell>
                          <TableCell className="py-2 border-r-0 text-sm text-foreground">
                            {vendor.contact_person || "N/A"}
                          </TableCell>
                          <TableCell className="py-2 border-r-0 text-sm">
                            {vendor.email ? (
                              <a
                                href={`mailto:${vendor.email}`}
                                className="text-blue-600 hover:text-blue-800 underline"
                              >
                                {vendor.email}
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </TableCell>
                          <TableCell className="py-2 border-r-0 text-sm text-foreground">
                            {vendor.phone || "N/A"}
                          </TableCell>
                          <TableCell className="py-2 border-r-0 text-sm text-foreground">
                            {vendor.street_address || "N/A"}
                          </TableCell>
                          <TableCell className="py-2 border-r-0 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => onEditVendor(vendor)}
                                disabled={loading.vendors}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                onClick={() => handleDeleteVendor(vendor.id)}
                                disabled={loading.vendors}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="h-16 text-center text-muted-foreground"
                        >
                          No vendors configured yet. Add your first vendor
                          above.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "departments" && (
          <div className="space-y-4 pt-4">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Department Management
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload size={16} />
                  Upload CSV
                </Button>
                <Button
                  className="flex items-center gap-2"
                  onClick={() => setShowAddDepartmentModal(true)}
                >
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
                  height: "auto",
                }}
              >
                <Table className="min-w-full" style={{ tableLayout: "fixed" }}>
                  <TableHeader className="sticky top-0 z-10">
                    <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                      <TableHead
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t"
                        style={{
                          backgroundColor: "#DFE7F3",
                          borderBottomColor: "#c9d1e0",
                          borderTopColor: "#c9d1e0",
                        }}
                      >
                        Department Name
                      </TableHead>
                      <TableHead
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t"
                        style={{
                          backgroundColor: "#DFE7F3",
                          borderBottomColor: "#c9d1e0",
                          borderTopColor: "#c9d1e0",
                        }}
                      >
                        Manager
                      </TableHead>
                      <TableHead
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t"
                        style={{
                          backgroundColor: "#DFE7F3",
                          borderBottomColor: "#c9d1e0",
                          borderTopColor: "#c9d1e0",
                        }}
                      >
                        Email
                      </TableHead>
                      <TableHead
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t"
                        style={{
                          backgroundColor: "#DFE7F3",
                          borderBottomColor: "#c9d1e0",
                          borderTopColor: "#c9d1e0",
                        }}
                      >
                        Budget Code
                      </TableHead>
                      <TableHead
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t text-right"
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
                    {loading.departments ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-16 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading departments...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : departments.length > 0 ? (
                      departments.map((department) => (
                        <TableRow
                          key={department.id}
                          className="h-10 hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">
                            {department.name}
                          </TableCell>
                          <TableCell className="py-2 border-r-0 text-sm text-foreground">
                            {department.manager || "N/A"}
                          </TableCell>
                          <TableCell className="py-2 border-r-0 text-sm">
                            {department.email ? (
                              <a
                                href={`mailto:${department.email}`}
                                className="text-blue-600 hover:text-blue-800 underline"
                              >
                                {department.email}
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </TableCell>
                          <TableCell className="py-2 border-r-0 text-sm">
                            {department.budget_code ? (
                              <Badge variant="secondary">
                                {department.budget_code}
                              </Badge>
                            ) : (
                              "N/A"
                            )}
                          </TableCell>
                          <TableCell className="py-2 border-r-0 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => onEditDepartment(department)}
                                disabled={loading.departments}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                onClick={() =>
                                  handleDeleteDepartment(department.id)
                                }
                                disabled={loading.departments}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="h-16 text-center text-muted-foreground"
                        >
                          No departments configured yet. Add your first
                          department above.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "addresses" && (
          <div className="space-y-4 pt-4">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Address Management
              </h3>
              <div className="flex gap-2">
                <Button
                  className="flex items-center gap-2"
                  onClick={() => setShowAddAddressModal(true)}
                >
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
                  height: "auto",
                }}
              >
                <Table className="min-w-full" style={{ tableLayout: "fixed" }}>
                  <TableHeader className="sticky top-0 z-10">
                    <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                      <TableHead
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t"
                        style={{
                          backgroundColor: "#DFE7F3",
                          borderBottomColor: "#c9d1e0",
                          borderTopColor: "#c9d1e0",
                        }}
                      >
                        Address Name
                      </TableHead>
                      <TableHead
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t"
                        style={{
                          backgroundColor: "#DFE7F3",
                          borderBottomColor: "#c9d1e0",
                          borderTopColor: "#c9d1e0",
                        }}
                      >
                        Street Address
                      </TableHead>
                      <TableHead
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t"
                        style={{
                          backgroundColor: "#DFE7F3",
                          borderBottomColor: "#c9d1e0",
                          borderTopColor: "#c9d1e0",
                        }}
                      >
                        City
                      </TableHead>
                      <TableHead
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t"
                        style={{
                          backgroundColor: "#DFE7F3",
                          borderBottomColor: "#c9d1e0",
                          borderTopColor: "#c9d1e0",
                        }}
                      >
                        State
                      </TableHead>
                      <TableHead
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t"
                        style={{
                          backgroundColor: "#DFE7F3",
                          borderBottomColor: "#c9d1e0",
                          borderTopColor: "#c9d1e0",
                        }}
                      >
                        ZIP Code
                      </TableHead>
                      <TableHead
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t text-right"
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
                    {loading.deliveryAddresses ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-16 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading addresses...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : deliveryAddresses.length > 0 ? (
                      deliveryAddresses.map((address) => (
                        <TableRow
                          key={address.id}
                          className="h-10 hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">
                            {address.name}
                          </TableCell>
                          <TableCell className="py-2 border-r-0 text-sm text-foreground">
                            {address.street_address || "N/A"}
                          </TableCell>
                          <TableCell className="py-2 border-r-0 text-sm text-foreground">
                            {address.city || "N/A"}
                          </TableCell>
                          <TableCell className="py-2 border-r-0 text-sm text-foreground">
                            {address.state || "N/A"}
                          </TableCell>
                          <TableCell className="py-2 border-r-0 text-sm text-foreground">
                            {address.zip_code || "N/A"}
                          </TableCell>
                          <TableCell className="py-2 border-r-0 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => onEditAddress(address)}
                                disabled={loading.deliveryAddresses}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                onClick={() => handleDeleteAddress(address.id)}
                                disabled={loading.deliveryAddresses}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="h-16 text-center text-muted-foreground"
                        >
                          No delivery addresses configured yet. Add your first
                          address above.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "payment" && (
          <div className="space-y-4 pt-4">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Payment Terms
              </h3>
              <div className="flex gap-2">
                <Button
                  className="flex items-center gap-2"
                  onClick={() => setShowAddPaymentTermModal(true)}
                >
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
                  height: "auto",
                }}
              >
                <Table className="min-w-full" style={{ tableLayout: "fixed" }}>
                  <TableHeader className="sticky top-0 z-10">
                    <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                      <TableHead
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t"
                        style={{
                          backgroundColor: "#DFE7F3",
                          borderBottomColor: "#c9d1e0",
                          borderTopColor: "#c9d1e0",
                        }}
                      >
                        Payment Terms
                      </TableHead>
                      <TableHead
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t text-right"
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
                    {loading.paymentTerms ? (
                      <TableRow>
                        <TableCell colSpan={2} className="h-16 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading payment terms...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : paymentTerms.length > 0 ? (
                      paymentTerms.map((term) => (
                        <TableRow
                          key={term.id}
                          className="h-10 hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">
                            {term.name}
                          </TableCell>
                          <TableCell className="py-2 border-r-0 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => onEditPaymentTerm(term)}
                                disabled={loading.paymentTerms}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                onClick={() => handleDeletePaymentTerm(term.id)}
                                disabled={loading.paymentTerms}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={2}
                          className="h-16 text-center text-muted-foreground"
                        >
                          No payment terms configured yet. Add your first terms
                          above.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "units" && (
          <div className="space-y-4 pt-4">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Units of Measure
              </h3>
              <div className="flex gap-2">
                <Button
                  className="flex items-center gap-2"
                  onClick={() => setShowAddUnitModal(true)}
                >
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
                  height: "auto",
                }}
              >
                <Table className="min-w-full" style={{ tableLayout: "fixed" }}>
                  <TableHeader className="sticky top-0 z-10">
                    <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                      <TableHead
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t"
                        style={{
                          backgroundColor: "#DFE7F3",
                          borderBottomColor: "#c9d1e0",
                          borderTopColor: "#c9d1e0",
                        }}
                      >
                        Unit of Measure
                      </TableHead>
                      <TableHead
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t text-right"
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
                    {loading.unitsOfMeasure ? (
                      <TableRow>
                        <TableCell colSpan={2} className="h-16 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading units of measure...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : unitsOfMeasure.length > 0 ? (
                      unitsOfMeasure.map((uom) => (
                        <TableRow
                          key={uom.id}
                          className="h-10 hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">
                            {uom.name}
                          </TableCell>
                          <TableCell className="py-2 border-r-0 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => onEditUnit(uom)}
                                disabled={loading.unitsOfMeasure}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                onClick={() => handleDeleteUnit(uom.id)}
                                disabled={loading.unitsOfMeasure}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={2}
                          className="h-16 text-center text-muted-foreground"
                        >
                          No units of measure configured yet. Add your first
                          unit above.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "items" && (
          <div className="space-y-4 pt-4">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Line Items
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload size={16} />
                  Upload CSV
                </Button>
                <Button
                  className="flex items-center gap-2"
                  onClick={() => setShowAddItemModal(true)}
                >
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
                  height: "auto",
                }}
              >
                <Table className="min-w-full" style={{ tableLayout: "fixed" }}>
                  <TableHeader className="sticky top-0 z-10">
                    <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                      <TableHead
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t"
                        style={{
                          backgroundColor: "#DFE7F3",
                          borderBottomColor: "#c9d1e0",
                          borderTopColor: "#c9d1e0",
                        }}
                      >
                        Item Code
                      </TableHead>
                      <TableHead
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t"
                        style={{
                          backgroundColor: "#DFE7F3",
                          borderBottomColor: "#c9d1e0",
                          borderTopColor: "#c9d1e0",
                        }}
                      >
                        Description
                      </TableHead>
                      <TableHead
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t"
                        style={{
                          backgroundColor: "#DFE7F3",
                          borderBottomColor: "#c9d1e0",
                          borderTopColor: "#c9d1e0",
                        }}
                      >
                        Unit of Measure
                      </TableHead>
                      <TableHead
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t"
                        style={{
                          backgroundColor: "#DFE7F3",
                          borderBottomColor: "#c9d1e0",
                          borderTopColor: "#c9d1e0",
                        }}
                      >
                        Unit Price
                      </TableHead>
                      <TableHead
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t text-right"
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
                    {loading.catalogItems ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-16 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading catalog items...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : catalogItems.length > 0 ? (
                      catalogItems.map((item) => (
                        <TableRow
                          key={item.id}
                          className="h-10 hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">
                            {item.item_code}
                          </TableCell>
                          <TableCell className="py-2 border-r-0 text-sm text-foreground">
                            {item.description}
                          </TableCell>
                          <TableCell className="py-2 border-r-0 text-sm text-foreground">
                            {item.uom}
                          </TableCell>
                          <TableCell className="text-green-600 font-medium py-2 border-r-0 text-sm">
                            {formatCurrency(item.unit_price)}
                          </TableCell>
                          <TableCell className="py-2 border-r-0 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => onEditItem(item)}
                                disabled={loading.catalogItems}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                onClick={() => handleDeleteItem(item.id)}
                                disabled={loading.catalogItems}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="h-16 text-center text-muted-foreground"
                        >
                          No line items configured yet. Add your first line item
                          above.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "costs" && (
          <div className="space-y-8 pt-4">
            {/* Cost Centers Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  Cost Centers
                </h3>
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
                    height: "auto",
                  }}
                >
                  <Table
                    className="min-w-full"
                    style={{ tableLayout: "fixed" }}
                  >
                    <TableHeader className="sticky top-0 z-10">
                      <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                        <TableHead
                          className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t"
                          style={{
                            backgroundColor: "#DFE7F3",
                            borderBottomColor: "#c9d1e0",
                            borderTopColor: "#c9d1e0",
                          }}
                        >
                          Cost Center Code
                        </TableHead>
                        <TableHead
                          className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t"
                          style={{
                            backgroundColor: "#DFE7F3",
                            borderBottomColor: "#c9d1e0",
                            borderTopColor: "#c9d1e0",
                          }}
                        >
                          Name
                        </TableHead>
                        <TableHead
                          className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t"
                          style={{
                            backgroundColor: "#DFE7F3",
                            borderBottomColor: "#c9d1e0",
                            borderTopColor: "#c9d1e0",
                          }}
                        >
                          Department
                        </TableHead>
                        <TableHead
                          className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t"
                          style={{
                            backgroundColor: "#DFE7F3",
                            borderBottomColor: "#c9d1e0",
                            borderTopColor: "#c9d1e0",
                          }}
                        >
                          GL Code
                        </TableHead>
                        <TableHead
                          className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t text-right"
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
                      <TableRow className="h-10 hover:bg-muted/50 transition-colors">
                        <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">
                          CC-001
                        </TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground">
                          IT Operations
                        </TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground">
                          IT Department
                        </TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground">
                          GL-5000
                        </TableCell>
                        <TableCell className="py-2 border-r-0 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow className="h-10 hover:bg-muted/50 transition-colors">
                        <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">
                          CC-002
                        </TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground">
                          HR Administration
                        </TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground">
                          HR Department
                        </TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground">
                          GL-6000
                        </TableCell>
                        <TableCell className="py-2 border-r-0 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow className="h-10 hover:bg-muted/50 transition-colors">
                        <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">
                          CC-003
                        </TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground">
                          Marketing Campaigns
                        </TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground">
                          Marketing
                        </TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground">
                          GL-7000
                        </TableCell>
                        <TableCell className="py-2 border-r-0 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
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
                <h3 className="text-lg font-semibold text-foreground">
                  General Ledger Codes
                </h3>
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
                    height: "auto",
                  }}
                >
                  <Table
                    className="min-w-full"
                    style={{ tableLayout: "fixed" }}
                  >
                    <TableHeader className="sticky top-0 z-10">
                      <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                        <TableHead
                          className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t"
                          style={{
                            backgroundColor: "#DFE7F3",
                            borderBottomColor: "#c9d1e0",
                            borderTopColor: "#c9d1e0",
                          }}
                        >
                          GL Code
                        </TableHead>
                        <TableHead
                          className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t"
                          style={{
                            backgroundColor: "#DFE7F3",
                            borderBottomColor: "#c9d1e0",
                            borderTopColor: "#c9d1e0",
                          }}
                        >
                          Description
                        </TableHead>
                        <TableHead
                          className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t"
                          style={{
                            backgroundColor: "#DFE7F3",
                            borderBottomColor: "#c9d1e0",
                            borderTopColor: "#c9d1e0",
                          }}
                        >
                          Category
                        </TableHead>
                        <TableHead
                          className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t text-right"
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
                      <TableRow className="h-10 hover:bg-muted/50 transition-colors">
                        <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">
                          GL-5000
                        </TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground">
                          Information Technology
                        </TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground">
                          Operations
                        </TableCell>
                        <TableCell className="py-2 border-r-0 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow className="h-10 hover:bg-muted/50 transition-colors">
                        <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">
                          GL-6000
                        </TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground">
                          Human Resources
                        </TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground">
                          Administration
                        </TableCell>
                        <TableCell className="py-2 border-r-0 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow className="h-10 hover:bg-muted/50 transition-colors">
                        <TableCell className="font-semibold py-2 border-r-0 text-sm text-foreground">
                          GL-7000
                        </TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground">
                          Marketing & Advertising
                        </TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground">
                          Sales & Marketing
                        </TableCell>
                        <TableCell className="py-2 border-r-0 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
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

        {activeTab === "template" && (
          <div className="space-y-4 pt-4">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Purchase Order Template
              </h3>
              {settingsLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading template settings...
                </div>
              )}
            </div>

            {/* Template Selection */}
            <Card className="p-6">
              <div className="space-y-4">
                <h4 className="text-base font-medium text-foreground">
                  Choose Template Layout
                </h4>
                <p className="text-sm text-muted-foreground">
                  Select how your purchase orders will be formatted and
                  displayed.
                  {!settingsLoading && (
                    <span className="font-medium text-foreground ml-1">
                      Current:{" "}
                      {selectedTemplate.charAt(0).toUpperCase() +
                        selectedTemplate.slice(1)}
                    </span>
                  )}
                </p>

                <RadioGroup
                  value={selectedTemplate}
                  onValueChange={(value: "classic" | "centered" | "modern") =>
                    handleTemplateChange(value)
                  }
                  disabled={settingsLoading}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
                >
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                    <RadioGroupItem value="classic" id="classic" />
                    <div className="flex-1">
                      <Label htmlFor="classic" className="cursor-pointer">
                        <div className="font-medium">Classic Layout</div>
                        <div className="text-sm text-muted-foreground">
                          Traditional professional format
                        </div>
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                    <RadioGroupItem value="centered" id="centered" />
                    <div className="flex-1">
                      <Label htmlFor="centered" className="cursor-pointer">
                        <div className="font-medium">Centered Layout</div>
                        <div className="text-sm text-muted-foreground">
                          Logo and title centered
                        </div>
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                    <RadioGroupItem value="modern" id="modern" />
                    <div className="flex-1">
                      <Label htmlFor="modern" className="cursor-pointer">
                        <div className="font-medium">Modern Layout</div>
                        <div className="text-sm text-muted-foreground">
                          Contemporary gradient design
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>

                {/* Template Preview */}
                <div className="mt-8">
                  <h4 className="text-base font-medium text-foreground mb-4">
                    Template Preview
                  </h4>
                  <div className="border rounded-lg p-4 bg-gray-50 overflow-hidden">
                    <div className="scale-75 origin-top-left transform">
                      <POPreview
                        purchaseOrder={samplePO}
                        layout={selectedTemplate}
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4 border-t">
                  <Button
                    onClick={handleSaveTemplate}
                    disabled={settingsLoading}
                    className="flex items-center gap-2"
                  >
                    {settingsLoading && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    Save Template Selection
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Add New Vendor Modal */}
      <Dialog open={showAddVendorModal} onOpenChange={setShowAddVendorModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-semibold">
                  {editingVendor ? "Edit Vendor" : "Add New Vendor"}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter comprehensive vendor information for your records.
                </p>
              </div>
              {/* <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  setShowAddVendorModal(false);
                  resetVendorForm();
                }}
              >
                <X className="h-4 w-4" />
              </Button> */}
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
                onChange={(e) =>
                  handleVendorInputChange("vendorName", e.target.value)
                }
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
                onChange={(e) =>
                  handleVendorInputChange("contactPerson", e.target.value)
                }
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
                onChange={(e) =>
                  handleVendorInputChange("email", e.target.value)
                }
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
                onChange={(e) =>
                  handleVendorInputChange("phone", e.target.value)
                }
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
                onChange={(e) =>
                  handleVendorInputChange("streetAddress", e.target.value)
                }
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
                onChange={(e) =>
                  handleVendorInputChange("city", e.target.value)
                }
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
                onChange={(e) =>
                  handleVendorInputChange("state", e.target.value)
                }
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
                onChange={(e) =>
                  handleVendorInputChange("zipCode", e.target.value)
                }
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
                onChange={(e) =>
                  handleVendorInputChange("taxId", e.target.value)
                }
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleCancelVendor}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveVendor}
              disabled={
                !vendorForm.vendorName.trim() ||
                !vendorForm.contactPerson.trim() ||
                !vendorForm.email.trim()
              }
            >
              {editingVendor ? "Update Vendor" : "Save Vendor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Department Modal */}
      <Dialog
        open={showAddDepartmentModal}
        onOpenChange={setShowAddDepartmentModal}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>
                {editingDepartment ? "Edit Department" : "Add Department"}
              </DialogTitle>
              {/* <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  setShowAddDepartmentModal(false);
                  resetDepartmentForm();
                }}
              >
                <X className="h-4 w-4" />
              </Button> */}
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {/* Department Name */}
            <div className="space-y-2">
              <Label htmlFor="departmentName" className="text-sm font-medium">
                Department Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="departmentName"
                value={departmentForm.name}
                onChange={(e) =>
                  handleDepartmentInputChange("name", e.target.value)
                }
                placeholder="IT"
              />
            </div>

            {/* Manager */}
            <div className="space-y-2">
              <Label htmlFor="manager" className="text-sm font-medium">
                Manager <span className="text-destructive">*</span>
              </Label>
              <Input
                id="manager"
                value={departmentForm.manager}
                onChange={(e) =>
                  handleDepartmentInputChange("manager", e.target.value)
                }
                placeholder="John Smith"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="departmentEmail" className="text-sm font-medium">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="departmentEmail"
                type="email"
                value={departmentForm.email}
                onChange={(e) =>
                  handleDepartmentInputChange("email", e.target.value)
                }
                placeholder="j.smith@company.com"
              />
            </div>

            {/* Budget Code */}
            <div className="space-y-2">
              <Label htmlFor="budgetCode" className="text-sm font-medium">
                Budget Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="budgetCode"
                value={departmentForm.budgetCode}
                onChange={(e) =>
                  handleDepartmentInputChange("budgetCode", e.target.value)
                }
                placeholder="IT-001"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAddDepartmentModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveDepartment}
              disabled={
                !departmentForm.name.trim() ||
                !departmentForm.manager.trim() ||
                !departmentForm.email.trim() ||
                !departmentForm.budgetCode.trim()
              }
            >
              {editingDepartment ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Address Modal */}
      <Dialog open={showAddAddressModal} onOpenChange={setShowAddAddressModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>
                {editingAddress ? "Edit Address" : "Add Address"}
              </DialogTitle>
              {/* <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  setShowAddAddressModal(false);
                  resetAddressForm();
                }}
              >
                <X className="h-4 w-4" />
              </Button> */}
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {/* Address Name */}
            <div className="space-y-2">
              <Label htmlFor="addressName" className="text-sm font-medium">
                Address Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="addressName"
                value={addressForm.name}
                onChange={(e) =>
                  handleAddressInputChange("name", e.target.value)
                }
                placeholder="Warehouse A"
              />
            </div>

            {/* Street Address */}
            <div className="space-y-2">
              <Label htmlFor="streetAddress" className="text-sm font-medium">
                Street Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="streetAddress"
                value={addressForm.streetAddress}
                onChange={(e) =>
                  handleAddressInputChange("streetAddress", e.target.value)
                }
                placeholder="123 Main St"
              />
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium">
                City <span className="text-destructive">*</span>
              </Label>
              <Input
                id="city"
                value={addressForm.city}
                onChange={(e) =>
                  handleAddressInputChange("city", e.target.value)
                }
                placeholder="New York"
              />
            </div>

            {/* State */}
            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm font-medium">
                State <span className="text-destructive">*</span>
              </Label>
              <Input
                id="state"
                value={addressForm.state}
                onChange={(e) =>
                  handleAddressInputChange("state", e.target.value)
                }
                placeholder="NY"
              />
            </div>

            {/* ZIP Code */}
            <div className="space-y-2">
              <Label htmlFor="zipCode" className="text-sm font-medium">
                ZIP Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="zipCode"
                value={addressForm.zipCode}
                onChange={(e) =>
                  handleAddressInputChange("zipCode", e.target.value)
                }
                placeholder="10001"
              />
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country" className="text-sm font-medium">
                Country <span className="text-destructive">*</span>
              </Label>
              <Input
                id="country"
                value={addressForm.country}
                onChange={(e) =>
                  handleAddressInputChange("country", e.target.value)
                }
                placeholder="USA"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAddAddressModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAddress}
              disabled={
                !addressForm.name.trim() ||
                !addressForm.streetAddress.trim() ||
                !addressForm.city.trim() ||
                !addressForm.state.trim() ||
                !addressForm.zipCode.trim() ||
                !addressForm.country.trim()
              }
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Payment Term Modal */}
      <Dialog
        open={showAddPaymentTermModal}
        onOpenChange={setShowAddPaymentTermModal}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>
                {editingPaymentTerm ? "Edit Payment Term" : "Add Payment Term"}
              </DialogTitle>
              {/* <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  setShowAddPaymentTermModal(false);
                  resetPaymentTermForm();
                }}
              >
                <X className="h-4 w-4" />
              </Button> */}
            </div>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="paymentTermName" className="mb-2 block">
              Payment Term Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="paymentTermName"
              value={paymentTermForm.name}
              onChange={(e) =>
                handlePaymentTermInputChange("name", e.target.value)
              }
              placeholder="Net 30"
            />
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAddPaymentTermModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavePaymentTerm}
              disabled={!paymentTermForm.name.trim()}
            >
              {editingPaymentTerm ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Unit Modal */}
      <Dialog open={showAddUnitModal} onOpenChange={setShowAddUnitModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>
                {editingUnit ? "Edit Unit of Measure" : "Add Unit of Measure"}
              </DialogTitle>
              {/* <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  setShowAddUnitModal(false);
                  resetUnitForm();
                }}
              >
                <X className="h-4 w-4" />
              </Button> */}
            </div>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor="unitName" className="mb-2 block">
              Unit Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="unitName"
              value={unitForm.name}
              onChange={(e) => handleUnitInputChange("name", e.target.value)}
              placeholder="Each"
            />
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAddUnitModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveUnit} disabled={!unitForm.name.trim()}>
              {editingUnit ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Item Modal */}
      <Dialog open={showAddItemModal} onOpenChange={setShowAddItemModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>
                {editingItem ? "Edit Line Item" : "Add Line Item"}
              </DialogTitle>
              {/* <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  setShowAddItemModal(false);
                  resetItemForm();
                }}
              >
                <X className="h-4 w-4" />
              </Button> */}
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {/* Item Code */}
            <div className="space-y-2">
              <Label htmlFor="itemCode" className="text-sm font-medium">
                Item Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="itemCode"
                value={itemForm.itemCode}
                onChange={(e) =>
                  handleItemInputChange("itemCode", e.target.value)
                }
                placeholder="ITEM-001"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description <span className="text-destructive">*</span>
              </Label>
              <Input
                id="description"
                value={itemForm.description}
                onChange={(e) =>
                  handleItemInputChange("description", e.target.value)
                }
                placeholder="Sample Item"
              />
            </div>

            {/* Unit of Measure */}
            <div className="space-y-2">
              <Label htmlFor="uom" className="text-sm font-medium">
                Unit of Measure <span className="text-destructive">*</span>
              </Label>
              <Select
                onValueChange={(value) => handleItemInputChange("uom", value)}
                value={itemForm.uom}
              >
                <SelectTrigger id="uom" className="w-full">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {unitsOfMeasure.map((unit) => (
                    <SelectItem key={unit.id} value={unit.name}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Unit Price */}
            <div className="space-y-2">
              <Label htmlFor="unitPrice" className="text-sm font-medium">
                Unit Price <span className="text-destructive">*</span>
              </Label>
              <Input
                id="unitPrice"
                type="number"
                min={0}
                step="0.01"
                value={itemForm.unitPrice}
                onChange={(e) =>
                  handleItemInputChange("unitPrice", parseFloat(e.target.value))
                }
                placeholder="0.00"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAddItemModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveItem}
              disabled={
                !itemForm.itemCode.trim() ||
                !itemForm.description.trim() ||
                !itemForm.uom.trim() ||
                itemForm.unitPrice <= 0
              }
            >
              {editingItem ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default PORequestSettings;
