
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const DocumentProcessingRules = () => {
  const [settings, setSettings] = useState({
    ocrConfidenceThreshold: 85,
    highValueThreshold: 10000,
    autoApprovalEnabled: true,
    requireManualReviewAbove: 50000,
    mandatoryFields: {
      vendorName: true,
      invoiceNumber: true,
      amount: true,
      date: true,
      poNumber: false
    }
  });

  const { toast } = useToast();

  const handleSettingChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleMandatoryFieldChange = (field: string, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      mandatoryFields: { ...prev.mandatoryFields, [field]: checked }
    }));
  };

  const handleSave = () => {
    toast({
      title: 'Processing Rules Saved',
      description: 'Document processing configuration has been updated.',
    });
  };

  return (
    <div className="space-y-6">
      {/* OCR Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>OCR Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ocr-threshold">Confidence Threshold (%)</Label>
              <Input
                id="ocr-threshold"
                type="number"
                min="0"
                max="100"
                value={settings.ocrConfidenceThreshold}
                onChange={(e) => handleSettingChange('ocrConfidenceThreshold', Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum OCR accuracy required (Default: 85%)</p>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Mandatory Fields for Extraction</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {Object.entries(settings.mandatoryFields).map(([field, checked]) => (
                <div key={field} className="flex items-center space-x-2">
                  <Checkbox
                    id={field}
                    checked={checked}
                    onCheckedChange={(checked) => handleMandatoryFieldChange(field, checked as boolean)}
                  />
                  <Label htmlFor={field} className="text-sm capitalize">
                    {field.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto-Approval Criteria */}
      <Card>
        <CardHeader>
          <CardTitle>Auto-Approval Criteria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-approval"
              checked={settings.autoApprovalEnabled}
              onCheckedChange={(checked) => handleSettingChange('autoApprovalEnabled', checked)}
            />
            <Label htmlFor="auto-approval">Enable automatic approval for perfect matches</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="high-value">High-Value Threshold ($)</Label>
              <Input
                id="high-value"
                type="number"
                min="0"
                value={settings.highValueThreshold}
                onChange={(e) => handleSettingChange('highValueThreshold', Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Amounts above this require manual review</p>
            </div>
            <div>
              <Label htmlFor="manual-review">Always Manual Review Above ($)</Label>
              <Input
                id="manual-review"
                type="number"
                min="0"
                value={settings.requireManualReviewAbove}
                onChange={(e) => handleSettingChange('requireManualReviewAbove', Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Never auto-approve above this amount</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exception Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Exception Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-sm font-medium">Discrepancies that always require manual review:</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 bg-gray-50 rounded">• Vendor mismatch</div>
              <div className="p-2 bg-gray-50 rounded">• Missing PO reference</div>
              <div className="p-2 bg-gray-50 rounded">• Duplicate invoice numbers</div>
              <div className="p-2 bg-gray-50 rounded">• Price variance {'>'}  tolerance</div>
              <div className="p-2 bg-gray-50 rounded">• Quantity variance {'>'} tolerance</div>
              <div className="p-2 bg-gray-50 rounded">• Late delivery beyond window</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Processing Rules</Button>
      </div>
    </div>
  );
};

export default DocumentProcessingRules;
