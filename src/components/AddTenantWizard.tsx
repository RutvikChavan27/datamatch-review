import React, { useState } from 'react';
import { ArrowLeft, Upload, Copy, Palette, GitBranch, ClipboardList, FileCheck, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigate, Link } from 'react-router-dom';

const AddTenantWizard: React.FC = () => {
  const navigate = useNavigate();
  const [tenantName, setTenantName] = useState('');
  const [urlSlug, setUrlSlug] = useState('');
  const [classificationThreshold, setClassificationThreshold] = useState('');
  const [entityRecognitionThreshold, setEntityRecognitionThreshold] = useState('');
  const [iuLimit, setIuLimit] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('maxxified');
  const [customPrimaryColor, setCustomPrimaryColor] = useState('#2563eb');
  const [customSecondaryColor, setCustomSecondaryColor] = useState('#e2e8f0');
  const [showPrimaryColorPicker, setShowPrimaryColorPicker] = useState(false);
  const [showSecondaryColorPicker, setShowSecondaryColorPicker] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  const handleCopyUrl = () => {
    const fullUrl = `https://maxxified.com/${urlSlug}`;
    navigator.clipboard.writeText(fullUrl);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a PNG, JPG, or SVG file');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
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
    setSelectedModules(prev => 
      prev.includes(module) 
        ? prev.filter(m => m !== module)
        : [...prev, module]
    );
  };

  const triggerFileInput = () => {
    document.getElementById('logo-upload')?.click();
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!tenantName || !urlSlug) {
      alert('Please fill in all required fields (Tenant Name and URL Name)');
      return;
    }

    // Create new tenant object
    const newTenant = {
      name: tenantName,
      shortName: urlSlug.toUpperCase().substring(0, 4),
      status: 'In Draft',
      isActive: false,
      logo: logoPreview || '/lovable-uploads/tenant_logo-2.png', // Use uploaded logo or default
      theme: selectedTheme,
      modules: selectedModules
    };

    // Store in localStorage to be picked up by Tenants component
    const existingTenants = JSON.parse(localStorage.getItem('customTenants') || '[]');
    existingTenants.push(newTenant);
    localStorage.setItem('customTenants', JSON.stringify(existingTenants));

    // Show success message
    alert(`Tenant "${tenantName}" added successfully!`);

    // Navigate back to tenants list
    navigate('/super-admin/tenants');
  };

  const handleCancel = () => {
    navigate('/super-admin/tenants');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-background">
      </div>

      {/* Breadcrumb */}
      <div className="mb-6 pt-4 px-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/super-admin/tenants" className="font-medium">Tenants</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="font-medium text-primary">Add New Tenant</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-8">
        <Card className="shadow-2xl rounded-3xl backdrop-blur-sm border-0 bg-card/95">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Add New Tenant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              {/* Left Column - Form Fields */}
              <div className="space-y-6">
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

              {/* Right Column - Tenant Logo */}
              <div className="space-y-2 h-full flex flex-col">
                <Label className="text-sm font-medium">
                  Tenant Logo
                </Label>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Card 
                  className="border-2 border-dashed border-border hover:border-primary/50 transition-colors flex-1 cursor-pointer"
                  onClick={triggerFileInput}
                >
                  <CardContent className="p-8 text-center h-full flex items-center justify-center">
                    {logoPreview ? (
                      <div className="flex flex-col items-center justify-center w-full h-full relative">
                        <div className="relative mb-3">
                          <img 
                            src={logoPreview} 
                            alt="Logo preview" 
                            className="max-h-24 max-w-24 object-contain rounded"
                          />
                        </div>
                        <p className="text-sm font-medium text-foreground mb-1">{selectedLogo?.name}</p>
                        <p className="text-xs text-muted-foreground mb-3">
                          {((selectedLogo?.size || 0) / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerFileInput();
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveLogo();
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                          <Upload className="h-6 w-6 text-blue-500" />
                        </div>
                        <p className="text-sm text-muted-foreground">Please Upload Tenant Logo</p>
                        <p className="text-xs text-muted-foreground/80 mt-1">PNG, JPG, SVG • Max 5MB</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Theme Selection */}
            <div className="space-y-4">
          <Label className="text-lg font-semibold text-foreground">Theme Selection</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Maxxified Default Theme */}
            <Card 
              className={`cursor-pointer transition-all duration-200 rounded-2xl shadow-lg backdrop-blur-sm ${
                selectedTheme === 'maxxified' ? 'border-2 border-primary shadow-xl' : 'border hover:shadow-xl'
              }`}
              onClick={() => setSelectedTheme('maxxified')}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <h3 className="font-medium text-muted-foreground text-sm">Maxxified (Default)</h3>
                  <div className="flex gap-2">
                    <div className="flex-1 h-16 bg-primary rounded-lg flex flex-col items-center justify-center">
                      <span className="text-xs text-primary-foreground font-medium">Primary</span>
                      <span className="text-xs text-primary-foreground/80">#2563eb</span>
                    </div>
                    <div className="flex-1 h-16 bg-slate-200 rounded-lg flex flex-col items-center justify-center">
                      <span className="text-xs text-slate-700 font-medium">Secondary</span>
                      <span className="text-xs text-slate-600">#e2e8f0</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vasion Automate Pro Theme */}
            <Card 
              className={`cursor-pointer transition-all duration-200 rounded-2xl shadow-lg backdrop-blur-sm ${
                selectedTheme === 'vasion' ? 'border-2 border-primary shadow-xl' : 'border hover:shadow-xl'
              }`}
              onClick={() => setSelectedTheme('vasion')}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <h3 className="font-medium text-muted-foreground text-sm">Vasion Automate Pro</h3>
                  <div className="flex gap-2">
                    <div className="flex-1 h-16 rounded-lg flex flex-col items-center justify-center" style={{ backgroundColor: '#3D2562' }}>
                      <span className="text-xs text-white font-medium">Primary</span>
                      <span className="text-xs text-white/80">#3D2562</span>
                    </div>
                    <div className="flex-1 h-16 bg-gray-200 rounded-lg flex flex-col items-center justify-center">
                      <span className="text-xs text-gray-700 font-medium">Secondary</span>
                      <span className="text-xs text-gray-600">#e5e7eb</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Custom Theme */}
            <Card 
              className={`cursor-pointer transition-all duration-200 rounded-2xl shadow-lg backdrop-blur-sm ${
                selectedTheme === 'custom' ? 'border-2 border-primary shadow-xl' : 'border hover:shadow-xl'
              }`}
              onClick={() => setSelectedTheme('custom')}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-muted-foreground text-sm">Custom Theme</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <div className="space-y-2 text-sm">
                            <p className="font-semibold">Color Selection Guidelines:</p>
                            <ul className="list-disc pl-4 space-y-1">
                              <li><strong>Primary Color:</strong> Main brand color used for buttons, links, and key actions</li>
                              <li><strong>Secondary Color:</strong> Supporting color for backgrounds and accents</li>
                              <li><strong>Contrast:</strong> Ensure sufficient contrast (WCAG AA: 4.5:1 for text)</li>
                              <li><strong>Accessibility:</strong> Test colors with text overlays for readability</li>
                              <li><strong>Consistency:</strong> Use colors that complement your brand identity</li>
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
                        style={{ backgroundColor: selectedTheme === 'custom' ? customPrimaryColor : 'white' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTheme('custom');
                          setShowPrimaryColorPicker(!showPrimaryColorPicker);
                        }}
                      >
                        {selectedTheme === 'custom' ? (
                          <>
                            <span className="text-xs text-white font-medium drop-shadow-md">Primary</span>
                            <span className="text-xs text-white/80 drop-shadow-md">{customPrimaryColor}</span>
                          </>
                        ) : (
                          <>
                            <Palette className="h-5 w-5 text-muted-foreground mb-1" />
                            <span className="text-xs text-muted-foreground font-medium">Select color</span>
                            <span className="text-xs text-muted-foreground">Primary</span>
                          </>
                        )}
                      </div>
                      {showPrimaryColorPicker && (
                        <div className="absolute top-full left-0 mt-2 z-50">
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <input
                              type="color"
                              value={customPrimaryColor}
                              onChange={(e) => setCustomPrimaryColor(e.target.value)}
                              className="w-20 h-10 border rounded cursor-pointer"
                            />
                            <div className="mt-2 flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => setShowPrimaryColorPicker(false)}
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
                        style={{ backgroundColor: selectedTheme === 'custom' ? customSecondaryColor : 'white' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTheme('custom');
                          setShowSecondaryColorPicker(!showSecondaryColorPicker);
                        }}
                      >
                        {selectedTheme === 'custom' ? (
                          <>
                            <span className="text-xs text-gray-700 font-medium">Secondary</span>
                            <span className="text-xs text-gray-600">{customSecondaryColor}</span>
                          </>
                        ) : (
                          <>
                            <Palette className="h-5 w-5 text-muted-foreground mb-1" />
                            <span className="text-xs text-muted-foreground font-medium">Select color</span>
                            <span className="text-xs text-muted-foreground">Secondary</span>
                          </>
                        )}
                      </div>
                      {showSecondaryColorPicker && (
                        <div className="absolute top-full left-0 mt-2 z-50">
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <input
                              type="color"
                              value={customSecondaryColor}
                              onChange={(e) => setCustomSecondaryColor(e.target.value)}
                              className="w-20 h-10 border rounded cursor-pointer"
                            />
                            <div className="mt-2 flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => setShowSecondaryColorPicker(false)}
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
              <Label className="text-lg font-semibold text-foreground">Module Configuration</Label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Workflows Module */}
                <Card 
                  className={`transition-all duration-300 rounded-3xl shadow-xl backdrop-blur-sm ${
                    selectedModules.includes('workflows') ? 'border-2 border-primary shadow-2xl bg-primary/5' : 'border hover:shadow-2xl'
                  }`}
                >
                  <CardContent className="p-6 relative">
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <GitBranch className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="pr-12">
                      <h3 className="font-medium text-foreground">Workflows</h3>
                      <p className="text-sm text-muted-foreground mt-1">Manage workflow tasks, notification channels, and reminder settings</p>
                      <div className="mt-4">
                        <Button
                          size="sm"
                          variant={selectedModules.includes('workflows') ? 'default' : 'outline'}
                          onClick={() => toggleModule('workflows')}
                        >
                          {selectedModules.includes('workflows') ? 'Selected' : 'Select'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* PO Requests Module */}
                <Card 
                  className={`transition-all duration-300 rounded-3xl shadow-xl backdrop-blur-sm ${
                    selectedModules.includes('po-requests') ? 'border-2 border-primary shadow-2xl bg-primary/5' : 'border hover:shadow-2xl'
                  }`}
                >
                  <CardContent className="p-6 relative">
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                      <ClipboardList className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="pr-12">
                      <h3 className="font-medium text-foreground">PO Requests</h3>
                      <p className="text-sm text-muted-foreground mt-1">Configure PO fields, vendors, departments, line items, and cost centers</p>
                      <div className="mt-4">
                        <Button
                          size="sm"
                          variant={selectedModules.includes('po-requests') ? 'default' : 'outline'}
                          onClick={() => toggleModule('po-requests')}
                        >
                          {selectedModules.includes('po-requests') ? 'Selected' : 'Select'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Document Matching Module */}
                <Card 
                  className={`transition-all duration-300 rounded-3xl shadow-xl backdrop-blur-sm ${
                    selectedModules.includes('document-matching') ? 'border-2 border-primary shadow-2xl bg-primary/5' : 'border hover:shadow-2xl'
                  }`}
                >
                  <CardContent className="p-6 relative">
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                      <FileCheck className="h-5 w-5 text-purple-500" />
                    </div>
                    <div className="pr-12">
                      <h3 className="font-medium text-foreground">Document Matching</h3>
                      <p className="text-sm text-muted-foreground mt-1">Configure variance thresholds for automatic document matching</p>
                      <div className="mt-4">
                        <Button
                          size="sm"
                          variant={selectedModules.includes('document-matching') ? 'default' : 'outline'}
                          onClick={() => toggleModule('document-matching')}
                        >
                          {selectedModules.includes('document-matching') ? 'Selected' : 'Select'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>


            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
              >
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddTenantWizard;