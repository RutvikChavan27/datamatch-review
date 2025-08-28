
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const MatchingRulesConfiguration = () => {
  const [rules, setRules] = useState({
    quantityPercentage: 5,
    quantityAbsolute: 10,
    priceVariance: 2,
    totalAmountVariance: 1,
    deliveryWindow: 30,
    invoiceDateRange: 60,
    grnCreationWindow: 7,
    acceptOverDelivery: true,
    minimumDeliveryPercentage: 80,
    includeTaxInMatching: false
  });

  const { toast } = useToast();

  const handleRuleChange = (field: string, value: any) => {
    setRules(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    toast({
      title: 'Matching Rules Saved',
      description: 'Tolerance settings have been updated successfully.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Quantity Tolerance Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Quantity Tolerance Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="qty-percentage">Percentage Tolerance (±%)</Label>
              <Input
                id="qty-percentage"
                type="number"
                min="0"
                max="100"
                value={rules.quantityPercentage}
                onChange={(e) => handleRuleChange('quantityPercentage', Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Default: 5%</p>
            </div>
            <div>
              <Label htmlFor="qty-absolute">Absolute Tolerance (±units)</Label>
              <Input
                id="qty-absolute"
                type="number"
                min="0"
                value={rules.quantityAbsolute}
                onChange={(e) => handleRuleChange('quantityAbsolute', Number(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="over-delivery"
                checked={rules.acceptOverDelivery}
                onCheckedChange={(checked) => handleRuleChange('acceptOverDelivery', checked)}
              />
              <Label htmlFor="over-delivery">Accept over-deliveries</Label>
            </div>
            <div>
              <Label htmlFor="min-delivery">Minimum Delivery Percentage (%)</Label>
              <Input
                id="min-delivery"
                type="number"
                min="0"
                max="100"
                value={rules.minimumDeliveryPercentage}
                onChange={(e) => handleRuleChange('minimumDeliveryPercentage', Number(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Tolerance Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Price Tolerance Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price-variance">Unit Price Variance (±%)</Label>
              <Input
                id="price-variance"
                type="number"
                min="0"
                max="100"
                value={rules.priceVariance}
                onChange={(e) => handleRuleChange('priceVariance', Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Default: 2%</p>
            </div>
            <div>
              <Label htmlFor="total-variance">Total Amount Variance (±%)</Label>
              <Input
                id="total-variance"
                type="number"
                min="0"
                max="100"
                value={rules.totalAmountVariance}
                onChange={(e) => handleRuleChange('totalAmountVariance', Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Default: 1%</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="include-tax"
              checked={rules.includeTaxInMatching}
              onCheckedChange={(checked) => handleRuleChange('includeTaxInMatching', checked)}
            />
            <Label htmlFor="include-tax">Include tax in matching logic</Label>
          </div>
        </CardContent>
      </Card>

      {/* Date Tolerance Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Date Tolerance Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="delivery-window">Delivery Window (±days)</Label>
              <Input
                id="delivery-window"
                type="number"
                min="0"
                value={rules.deliveryWindow}
                onChange={(e) => handleRuleChange('deliveryWindow', Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Default: 30 days</p>
            </div>
            <div>
              <Label htmlFor="invoice-range">Invoice Date Range (days)</Label>
              <Input
                id="invoice-range"
                type="number"
                min="0"
                value={rules.invoiceDateRange}
                onChange={(e) => handleRuleChange('invoiceDateRange', Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="grn-window">GRN Creation Window (days)</Label>
              <Input
                id="grn-window"
                type="number"
                min="0"
                value={rules.grnCreationWindow}
                onChange={(e) => handleRuleChange('grnCreationWindow', Number(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Matching Rules</Button>
      </div>
    </div>
  );
};

export default MatchingRulesConfiguration;
