import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Plus, Minus, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VarianceConfig {
  type: 'percentage' | 'numerical_count' | 'numerical_amount';
  tolerance: number;
}

const DataMatchConfiguration = () => {
  const { toast } = useToast();
  
  const [matchThreshold, setMatchThreshold] = useState([85]);
  const [quantityVariance, setQuantityVariance] = useState<VarianceConfig>({
    type: 'percentage',
    tolerance: 5
  });
  const [unitPriceVariance, setUnitPriceVariance] = useState<VarianceConfig>({
    type: 'percentage',
    tolerance: 10
  });
  const [totalAmountVariance, setTotalAmountVariance] = useState<VarianceConfig>({
    type: 'percentage',
    tolerance: 5
  });

  const handleToleranceChange = (
    variance: VarianceConfig,
    setter: React.Dispatch<React.SetStateAction<VarianceConfig>>,
    newValue: number
  ) => {
    setter({
      ...variance,
      tolerance: Math.max(0, newValue)
    });
  };

  const handleSaveConfiguration = () => {
    // TODO: Implement save functionality
    console.log('Saving configuration:', {
      matchThreshold: matchThreshold[0],
      quantityVariance,
      unitPriceVariance,
      totalAmountVariance
    });
    
    toast({
      title: 'Configuration Saved',
      description: 'Data match configuration has been updated successfully.',
      variant: 'default'
    });
  };

  const VarianceTypeSelector = ({ 
    value, 
    onChange, 
    options 
  }: { 
    value: string; 
    onChange: (value: string) => void; 
    options: Array<{ value: string; label: string }>;
  }) => (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="bg-white border-gray-200 focus:ring-blue-500 focus:border-blue-500">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-white border-gray-200">
        {options.map(option => (
          <SelectItem key={option.value} value={option.value} className="hover:bg-gray-50">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const ToleranceInput = ({ 
    value, 
    onChange 
  }: { 
    value: number; 
    onChange: (value: number) => void;
  }) => (
    <div className="relative">
      <Input
        type="number"
        step="0.1"
        min="0"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-32 pr-14 text-center bg-white border-gray-200 focus:ring-blue-500 focus:border-blue-500"
      />
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="absolute right-7 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors z-10"
      >
        <Minus className="w-3 h-3" />
      </button>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="absolute right-1 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors z-10"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );

  return (
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
              <BreadcrumbPage>Data Match Configuration</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground font-inter">Data Match Configuration</h1>
        </div>
        <Button onClick={handleSaveConfiguration} className="gap-2">
          <Save className="h-4 w-4" />
          Save Configuration
        </Button>
      </div>

      {/* Configuration Cards */}
      <div className="max-w-4xl mx-auto space-y-6 pt-6">
        {/* Line Item Name/Description (Fuzzy Match) */}
        <Card className="border border-border/40 bg-white rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Line Item Name/Description (Fuzzy Match)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">
                  Match Threshold (%)
                </Label>
                <Input 
                  type="number"
                  value={matchThreshold[0]}
                  onChange={(e) => setMatchThreshold([Math.min(100, Math.max(0, parseInt(e.target.value) || 0))])}
                  min={0}
                  max={100}
                  className="w-20 text-right text-sm font-medium"
                />
              </div>
              <Slider
                value={matchThreshold}
                onValueChange={setMatchThreshold}
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Higher percentages require closer text similarity
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quantity Variance */}
        <Card className="border border-border/40 bg-white rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Quantity Variance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Variance Type
                </Label>
                <VarianceTypeSelector
                  value={quantityVariance.type}
                  onChange={(value) => setQuantityVariance({ 
                    ...quantityVariance, 
                    type: value as 'percentage' | 'numerical_count' | 'numerical_amount'
                  })}
                  options={[
                    { value: 'percentage', label: 'Percentage (%)' },
                    { value: 'numerical_count', label: 'Numerical Count' }
                  ]}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Tolerance Value ({quantityVariance.type === 'percentage' ? '%' : ''})
                </Label>
                <ToleranceInput
                  value={quantityVariance.tolerance}
                  onChange={(value) => handleToleranceChange(quantityVariance, setQuantityVariance, value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Unit Price Variance */}
        <Card className="border border-border/40 bg-white rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Unit Price Variance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Variance Type
                </Label>
                <VarianceTypeSelector
                  value={unitPriceVariance.type}
                  onChange={(value) => setUnitPriceVariance({ 
                    ...unitPriceVariance, 
                    type: value as 'percentage' | 'numerical_count' | 'numerical_amount'
                  })}
                  options={[
                    { value: 'percentage', label: 'Percentage (%)' },
                    { value: 'numerical_amount', label: 'Numerical Amount ($)' }
                  ]}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Tolerance Value ({unitPriceVariance.type === 'percentage' ? '%' : '$'})
                </Label>
                <ToleranceInput
                  value={unitPriceVariance.tolerance}
                  onChange={(value) => handleToleranceChange(unitPriceVariance, setUnitPriceVariance, value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Amount Variance */}
        <Card className="border border-border/40 bg-white rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Total Amount Variance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Variance Type
                </Label>
                <VarianceTypeSelector
                  value={totalAmountVariance.type}
                  onChange={(value) => setTotalAmountVariance({ 
                    ...totalAmountVariance, 
                    type: value as 'percentage' | 'numerical_count' | 'numerical_amount'
                  })}
                  options={[
                    { value: 'percentage', label: 'Percentage (%)' },
                    { value: 'numerical_amount', label: 'Numerical Amount ($)' }
                  ]}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Tolerance Value ({totalAmountVariance.type === 'percentage' ? '%' : '$'})
                </Label>
                <ToleranceInput
                  value={totalAmountVariance.tolerance}
                  onChange={(value) => handleToleranceChange(totalAmountVariance, setTotalAmountVariance, value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataMatchConfiguration;