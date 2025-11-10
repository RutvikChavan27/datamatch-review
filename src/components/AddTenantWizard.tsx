import React, { useState } from "react";
import {
  ArrowLeft,
  Upload,
  Copy,
  Palette,
  GitBranch,
  ClipboardList,
  FileCheck,
  Info,
  Lock,
  FolderOpen,
  HardDrive,
  BarChart3,
  Check,
  CalendarIcon,
  Pencil,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useNavigate, Link } from "react-router-dom";
import { format, addDays, addMonths, addYears } from "date-fns";
import { cn } from "@/lib/utils";

const AddTenantWizard: React.FC = () => {
  const navigate = useNavigate();
  const [tenantName, setTenantName] = useState("");
  const [urlSlug, setUrlSlug] = useState("");
  const [classificationThreshold, setClassificationThreshold] = useState("");
  const [entityRecognitionThreshold, setEntityRecognitionThreshold] =
    useState("");
  const [iuLimit, setIuLimit] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("maxxified");
  const [customPrimaryColor, setCustomPrimaryColor] = useState("#2563eb");
  const [customSecondaryColor, setCustomSecondaryColor] = useState("#e2e8f0");
  const [showPrimaryColorPicker, setShowPrimaryColorPicker] = useState(false);
  const [showSecondaryColorPicker, setShowSecondaryColorPicker] =
    useState(false);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [tenantExpiryDate, setTenantExpiryDate] = useState<Date | undefined>();
  const [moduleExpiryDates, setModuleExpiryDates] = useState<
    Record<string, Date | undefined>
  >({});
  const [tenantDatePickerOpen, setTenantDatePickerOpen] = useState(false);
  const [tempTenantDate, setTempTenantDate] = useState<Date | undefined>();
  const [modulePickerOpen, setModulePickerOpen] = useState<
    Record<string, boolean>
  >({});

  const handleCopyUrl = () => {
    const fullUrl = `https://maxxified.com/${urlSlug}`;
    navigator.clipboard.writeText(fullUrl);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/svg+xml",
      ];
      if (!validTypes.includes(file.type)) {
        alert("Please select a PNG, JPG, or SVG file");
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      setSelectedLogo(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setSelectedLogo(null);
    setLogoPreview(null);
  };

  const toggleModule = (module: string) => {
    setSelectedModules((prev) =>
      prev.includes(module)
        ? prev.filter((m) => m !== module)
        : [...prev, module]
    );
  };

  const setQuickExpiryDate = (type: "3m" | "6m" | "1y") => {
    const now = new Date();
    if (type === "3m") {
      setTempTenantDate(addMonths(now, 3));
    } else if (type === "6m") {
      setTempTenantDate(addMonths(now, 6));
    } else if (type === "1y") {
      setTempTenantDate(addYears(now, 1));
    }
  };

  const handleTenantDateConfirm = () => {
    setTenantExpiryDate(tempTenantDate);
    setTenantDatePickerOpen(false);
  };

  const handleTenantDateCancel = () => {
    setTempTenantDate(tenantExpiryDate);
    setTenantDatePickerOpen(false);
  };

  const setModuleExpiryDate = (moduleId: string, date: Date | undefined) => {
    setModuleExpiryDates((prev) => ({
      ...prev,
      [moduleId]: date,
    }));
  };

  const toggleModulePicker = (moduleId: string, open: boolean) => {
    setModulePickerOpen((prev) => ({
      ...prev,
      [moduleId]: open,
    }));
  };

  const triggerFileInput = () => {
    document.getElementById("logo-upload")?.click();
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log("Form submitted");
    navigate("/super-admin/tenants");
  };

  const handleCancel = () => {
    navigate("/super-admin/tenants");
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-background"></div>

      {/* Breadcrumb */}
      <div className="mb-6 pt-4 px-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/super-admin/tenants" className="font-medium">
                  Tenants
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="font-medium text-primary">
                Add New Tenant
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-8">
        <Card className="shadow-2xl rounded-3xl backdrop-blur-sm border-0 bg-card/95">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Add New Tenant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
              {/* Left Two Columns - Form Fields */}
              <div className="space-y-6 md:col-span-2">
                {/* Tenant Name and Expiry Date Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tenant Name */}
                  <div className="space-y-2">
                    <Label htmlFor="tenantName" className="text-sm font-medium">
                      Tenant Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="tenantName"
                      value={tenantName}
                      onChange={(e) => setTenantName(e.target.value)}
                      placeholder="Please Enter Tenant Name"
                    />
                  </div>

                  {/* Expiry Date */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Expiry Date <span className="text-destructive">*</span>
                    </Label>
                    <Popover
                      open={tenantDatePickerOpen}
                      onOpenChange={(open) => {
                        setTenantDatePickerOpen(open);
                        if (open) {
                          setTempTenantDate(tenantExpiryDate);
                        }
                      }}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-between text-left font-normal",
                            !tenantExpiryDate && "text-muted-foreground"
                          )}
                        >
                          {tenantExpiryDate ? (
                            format(tenantExpiryDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-2 h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <div className="p-3 border-b">
                          <Label className="text-xs font-medium mb-2 block">
                            Quick Select
                          </Label>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setQuickExpiryDate("3m")}
                              className="flex-1"
                            >
                              3 Months
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setQuickExpiryDate("6m")}
                              className="flex-1"
                            >
                              6 Months
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setQuickExpiryDate("1y")}
                              className="flex-1"
                            >
                              1 Year
                            </Button>
                          </div>
                        </div>
                        <Calendar
                          mode="single"
                          selected={tempTenantDate}
                          onSelect={setTempTenantDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                        <div className="p-3 border-t space-y-3">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleTenantDateCancel}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleTenantDateConfirm}
                              className="flex-1"
                            >
                              Okay
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* URL Name */}
                <div className="space-y-2">
                  <Label htmlFor="urlSlug" className="text-sm font-medium">
                    URL Name <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex items-center border rounded-md bg-background">
                    <span className="px-3 text-sm text-muted-foreground bg-muted rounded-l-md border-r flex items-center">
                      https://maxxified.com/
                    </span>
                    <Input
                      id="urlSlug"
                      value={urlSlug}
                      onChange={(e) => setUrlSlug(e.target.value)}
                      placeholder="Please provide slug"
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-l-none"
                    />
                    <Button
                      variant="ghost"
                      onClick={handleCopyUrl}
                      disabled={!urlSlug}
                      className="mr-2"
                      size="sm"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy URL
                    </Button>
                  </div>
                </div>
              </div>

              {/* Third Column - Tenant Logo */}
              <div className="space-y-2 md:col-span-1">
                <Label className="text-sm font-medium">Tenant Logo</Label>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Card
                  className="border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer h-[calc(100%-2rem)]"
                  onClick={triggerFileInput}
                >
                  <CardContent className="p-6 text-center flex items-center justify-center h-full">
                    {logoPreview ? (
                      <div className="flex flex-col items-center justify-center w-full h-full relative">
                        <div className="relative mb-3">
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="max-h-24 max-w-24 object-contain rounded"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                          {((selectedLogo?.size || 0) / 1024 / 1024).toFixed(2)}{" "}
                          MB
                        </p>
                        <div className="flex gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    triggerFileInput();
                                  }}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveLogo();
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Remove</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                          <Upload className="h-6 w-6 text-blue-500" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Please Upload Tenant Logo
                        </p>
                        <p className="text-xs text-muted-foreground/80 mt-1">
                          PNG, JPG, SVG • Max 5MB
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Theme Selection */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-foreground">
                Theme Selection
              </Label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Maxxified Default Theme */}
                <Card
                  className={`cursor-pointer transition-all duration-200 rounded-2xl shadow-lg backdrop-blur-sm ${
                    selectedTheme === "maxxified"
                      ? "border-2 border-primary shadow-xl"
                      : "border hover:shadow-xl"
                  }`}
                  onClick={() => setSelectedTheme("maxxified")}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <h3 className="font-medium text-muted-foreground text-sm">
                        Maxxified (Default)
                      </h3>
                      <div className="flex gap-2">
                        <div className="flex-1 h-16 bg-primary rounded-lg flex flex-col items-center justify-center">
                          <span className="text-xs text-primary-foreground font-medium">
                            Primary
                          </span>
                          <span className="text-xs text-primary-foreground/80">
                            #2563eb
                          </span>
                        </div>
                        <div className="flex-1 h-16 bg-slate-200 rounded-lg flex flex-col items-center justify-center">
                          <span className="text-xs text-slate-700 font-medium">
                            Secondary
                          </span>
                          <span className="text-xs text-slate-600">
                            #e2e8f0
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Vasion Automate Pro Theme */}
                <Card
                  className={`cursor-pointer transition-all duration-200 rounded-2xl shadow-lg backdrop-blur-sm ${
                    selectedTheme === "vasion"
                      ? "border-2 border-primary shadow-xl"
                      : "border hover:shadow-xl"
                  }`}
                  onClick={() => setSelectedTheme("vasion")}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <h3 className="font-medium text-muted-foreground text-sm">
                        Vasion Automate Pro
                      </h3>
                      <div className="flex gap-2">
                        <div
                          className="flex-1 h-16 rounded-lg flex flex-col items-center justify-center"
                          style={{ backgroundColor: "#3D2562" }}
                        >
                          <span className="text-xs text-white font-medium">
                            Primary
                          </span>
                          <span className="text-xs text-white/80">#3D2562</span>
                        </div>
                        <div className="flex-1 h-16 bg-gray-200 rounded-lg flex flex-col items-center justify-center">
                          <span className="text-xs text-gray-700 font-medium">
                            Secondary
                          </span>
                          <span className="text-xs text-gray-600">#e5e7eb</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Custom Theme */}
                <Card
                  className={`cursor-pointer transition-all duration-200 rounded-2xl shadow-lg backdrop-blur-sm ${
                    selectedTheme === "custom"
                      ? "border-2 border-primary shadow-xl"
                      : "border hover:shadow-xl"
                  }`}
                  onClick={() => setSelectedTheme("custom")}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-muted-foreground text-sm">
                          Custom Theme
                        </h3>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent side="right" className="max-w-xs">
                              <div className="space-y-2 text-sm">
                                <p className="font-semibold">
                                  Color Selection Guidelines:
                                </p>
                                <ul className="list-disc pl-4 space-y-1">
                                  <li>
                                    <strong>Primary Color:</strong> Main brand
                                    color used for buttons, links, and key
                                    actions
                                  </li>
                                  <li>
                                    <strong>Secondary Color:</strong> Supporting
                                    color for backgrounds and accents
                                  </li>
                                  <li>
                                    <strong>Contrast:</strong> Ensure sufficient
                                    contrast (WCAG AA: 4.5:1 for text)
                                  </li>
                                  <li>
                                    <strong>Accessibility:</strong> Test colors
                                    with text overlays for readability
                                  </li>
                                  <li>
                                    <strong>Consistency:</strong> Use colors
                                    that complement your brand identity
                                  </li>
                                </ul>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="flex gap-2">
                        {/* Primary Color Picker */}
                        <div className="relative flex-1">
                          <div
                            className="h-16 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                            style={{
                              backgroundColor:
                                selectedTheme === "custom"
                                  ? customPrimaryColor
                                  : "white",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTheme("custom");
                              setShowPrimaryColorPicker(
                                !showPrimaryColorPicker
                              );
                            }}
                          >
                            {selectedTheme === "custom" ? (
                              <>
                                <span className="text-xs text-white font-medium drop-shadow-md">
                                  Primary
                                </span>
                                <span className="text-xs text-white/80 drop-shadow-md">
                                  {customPrimaryColor}
                                </span>
                              </>
                            ) : (
                              <>
                                <Palette className="h-5 w-5 text-muted-foreground mb-1" />
                                <span className="text-xs text-muted-foreground font-medium">
                                  Select color
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  Primary
                                </span>
                              </>
                            )}
                          </div>
                          {showPrimaryColorPicker && (
                            <div className="absolute top-full left-0 mt-2 z-50">
                              <div className="bg-background border rounded-lg p-3 shadow-lg">
                                <input
                                  type="color"
                                  value={customPrimaryColor}
                                  onChange={(e) =>
                                    setCustomPrimaryColor(e.target.value)
                                  }
                                  className="w-20 h-10 border rounded cursor-pointer"
                                />
                                <div className="mt-2 flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      setShowPrimaryColorPicker(false)
                                    }
                                  >
                                    Done
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Secondary Color Picker */}
                        <div className="relative flex-1">
                          <div
                            className="h-16 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                            style={{
                              backgroundColor:
                                selectedTheme === "custom"
                                  ? customSecondaryColor
                                  : "white",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTheme("custom");
                              setShowSecondaryColorPicker(
                                !showSecondaryColorPicker
                              );
                            }}
                          >
                            {selectedTheme === "custom" ? (
                              <>
                                <span className="text-xs text-gray-700 font-medium">
                                  Secondary
                                </span>
                                <span className="text-xs text-gray-600">
                                  {customSecondaryColor}
                                </span>
                              </>
                            ) : (
                              <>
                                <Palette className="h-5 w-5 text-muted-foreground mb-1" />
                                <span className="text-xs text-muted-foreground font-medium">
                                  Select color
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  Secondary
                                </span>
                              </>
                            )}
                          </div>
                          {showSecondaryColorPicker && (
                            <div className="absolute top-full left-0 mt-2 z-50">
                              <div className="bg-background border rounded-lg p-3 shadow-lg">
                                <input
                                  type="color"
                                  value={customSecondaryColor}
                                  onChange={(e) =>
                                    setCustomSecondaryColor(e.target.value)
                                  }
                                  className="w-20 h-10 border rounded cursor-pointer"
                                />
                                <div className="mt-2 flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      setShowSecondaryColorPicker(false)
                                    }
                                  >
                                    Done
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Module Configuration */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Label className="text-lg font-semibold text-foreground">
                  Module Configuration
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Must be within tenant expiry:{" "}
                        {tenantExpiryDate
                          ? format(tenantExpiryDate, "MMMM do, yyyy")
                          : "Not set"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-3">
                {/* Workflows Module */}
                <Card
                  className={`transition-all duration-200 border ${
                    selectedModules.includes("workflows") ? "bg-primary/5" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <GitBranch className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground">
                            Workflows
                          </h3>
                          {selectedModules.includes("workflows") && (
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Manage workflow tasks, notification channels, and
                          reminder settings
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {selectedModules.includes("workflows") && (
                          <Popover
                            open={modulePickerOpen["workflows"]}
                            onOpenChange={(open) =>
                              toggleModulePicker("workflows", open)
                            }
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="justify-between"
                              >
                                {moduleExpiryDates["workflows"]
                                  ? format(
                                      moduleExpiryDates["workflows"],
                                      "MMM dd, yyyy"
                                    )
                                  : "Expiry Date"}
                                <CalendarIcon className="ml-2 h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={moduleExpiryDates["workflows"]}
                                onSelect={(date) =>
                                  setModuleExpiryDate("workflows", date)
                                }
                                disabled={(date) =>
                                  date < new Date() ||
                                  (tenantExpiryDate && date > tenantExpiryDate)
                                }
                                initialFocus
                                className={cn("p-3 pointer-events-auto")}
                              />
                              <div className="p-3 border-t flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    toggleModulePicker("workflows", false)
                                  }
                                  className="flex-1"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    toggleModulePicker("workflows", false)
                                  }
                                  className="flex-1"
                                >
                                  Okay
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                        <Button
                          size="sm"
                          variant={
                            selectedModules.includes("workflows")
                              ? "default"
                              : "outline"
                          }
                          onClick={() => toggleModule("workflows")}
                        >
                          {selectedModules.includes("workflows")
                            ? "Selected"
                            : "Select"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* PO Requests Module */}
                <Card
                  className={`transition-all duration-200 border ${
                    selectedModules.includes("po-requests")
                      ? "bg-primary/5"
                      : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                        <ClipboardList className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground">
                            PO Requests
                          </h3>
                          {selectedModules.includes("po-requests") && (
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Configure PO fields, vendors, departments, line items,
                          and cost centers
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {selectedModules.includes("po-requests") && (
                          <Popover
                            open={modulePickerOpen["po-requests"]}
                            onOpenChange={(open) =>
                              toggleModulePicker("po-requests", open)
                            }
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="justify-between"
                              >
                                {moduleExpiryDates["po-requests"]
                                  ? format(
                                      moduleExpiryDates["po-requests"],
                                      "MMM dd, yyyy"
                                    )
                                  : "Expiry Date"}
                                <CalendarIcon className="ml-2 h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={moduleExpiryDates["po-requests"]}
                                onSelect={(date) =>
                                  setModuleExpiryDate("po-requests", date)
                                }
                                disabled={(date) =>
                                  date < new Date() ||
                                  (tenantExpiryDate && date > tenantExpiryDate)
                                }
                                initialFocus
                                className={cn("p-3 pointer-events-auto")}
                              />
                              <div className="p-3 border-t flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    toggleModulePicker("po-requests", false)
                                  }
                                  className="flex-1"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    toggleModulePicker("po-requests", false)
                                  }
                                  className="flex-1"
                                >
                                  Okay
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                        <Button
                          size="sm"
                          variant={
                            selectedModules.includes("po-requests")
                              ? "default"
                              : "outline"
                          }
                          onClick={() => toggleModule("po-requests")}
                        >
                          {selectedModules.includes("po-requests")
                            ? "Selected"
                            : "Select"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Document Matching Module */}
                <Card
                  className={`transition-all duration-200 border ${
                    selectedModules.includes("document-matching")
                      ? "bg-primary/5"
                      : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                        <FileCheck className="h-5 w-5 text-purple-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground">
                            Document Matching
                          </h3>
                          {selectedModules.includes("document-matching") && (
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Configure variance thresholds for automatic document
                          matching
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {selectedModules.includes("document-matching") && (
                          <Popover
                            open={modulePickerOpen["document-matching"]}
                            onOpenChange={(open) =>
                              toggleModulePicker("document-matching", open)
                            }
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="justify-between"
                              >
                                {moduleExpiryDates["document-matching"]
                                  ? format(
                                      moduleExpiryDates["document-matching"],
                                      "MMM dd, yyyy"
                                    )
                                  : "Expiry Date"}
                                <CalendarIcon className="ml-2 h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={
                                  moduleExpiryDates["document-matching"]
                                }
                                onSelect={(date) =>
                                  setModuleExpiryDate("document-matching", date)
                                }
                                disabled={(date) =>
                                  date < new Date() ||
                                  (tenantExpiryDate && date > tenantExpiryDate)
                                }
                                initialFocus
                                className={cn("p-3 pointer-events-auto")}
                              />
                              <div className="p-3 border-t flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    toggleModulePicker(
                                      "document-matching",
                                      false
                                    )
                                  }
                                  className="flex-1"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    toggleModulePicker(
                                      "document-matching",
                                      false
                                    )
                                  }
                                  className="flex-1"
                                >
                                  Okay
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                        <Button
                          size="sm"
                          variant={
                            selectedModules.includes("document-matching")
                              ? "default"
                              : "outline"
                          }
                          onClick={() => toggleModule("document-matching")}
                        >
                          {selectedModules.includes("document-matching")
                            ? "Selected"
                            : "Select"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Workspace Module - Default/Locked */}
                <Card className="border bg-muted/20 opacity-75">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <FolderOpen className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground">Workspace</h3>
                      <p className="text-sm text-muted-foreground">
                        Default module for document workspace and collaboration
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled
                      className="flex-shrink-0"
                    >
                      <Lock className="h-4 w-4 mr-1" />
                      Default
                    </Button>
                  </CardContent>
                </Card>

                {/* Storage Module - Default/Locked */}
                <Card className="border bg-muted/20 opacity-75">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <HardDrive className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground">Storage</h3>
                      <p className="text-sm text-muted-foreground">
                        Default module for document storage and management
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled
                      className="flex-shrink-0"
                    >
                      <Lock className="h-4 w-4 mr-1" />
                      Default
                    </Button>
                  </CardContent>
                </Card>

                {/* Reports Module - Default/Locked */}
                <Card className="border bg-muted/20 opacity-75">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground">Reports</h3>
                      <p className="text-sm text-muted-foreground">
                        Default module for analytics and reporting features
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled
                      className="flex-shrink-0"
                    >
                      <Lock className="h-4 w-4 mr-1" />
                      Default
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Add</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddTenantWizard;
