import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useClientModules } from '../hooks/useClientModules';
import { useToast } from '@/hooks/use-toast';

const SuperAdminModuleConfig = () => {
  const { enabledModules, updateModules } = useClientModules();
  const [selectedClient, setSelectedClient] = useState('acme-corp');
  const [localModules, setLocalModules] = useState(enabledModules);
  const { toast } = useToast();

  const clients = [
    { value: 'acme-corp', label: 'Acme Corporation' },
    { value: 'tech-solutions', label: 'Tech Solutions Inc' },
    { value: 'global-trading', label: 'Global Trading Ltd' }
  ];

  const modules = [
    {
      id: 'invoiceProcessing',
      name: 'Invoice Processing',
      description: 'Always enabled - Core module',
      enabled: true,
      disabled: true
    },
    {
      id: 'purchaseOrder',
      name: 'Purchase Order Integration',
      description: 'Enable PO upload and matching',
      enabled: localModules.purchaseOrder,
      disabled: false
    },
    {
      id: 'goodsReceiptNote',
      name: 'Goods Receipt Note Integration',
      description: 'Enable GRN upload and matching',
      enabled: localModules.goodsReceiptNote,
      disabled: false
    },
    {
      id: 'poRequest',
      name: 'PO Request Module',
      description: 'Enable internal PO creation',
      enabled: localModules.poRequest,
      disabled: false
    }
  ];

  const handleModuleChange = (moduleId: string, checked: boolean) => {
    if (moduleId === 'invoiceProcessing') return; // Cannot change core module
    
    setLocalModules(prev => ({
      ...prev,
      [moduleId]: checked
    }));
  };

  const handleSave = () => {
    updateModules(localModules);
    toast({
      title: 'Configuration Saved',
      description: 'Module configuration has been updated successfully.',
    });
  };

  const handleCancel = () => {
    setLocalModules(enabledModules);
  };

  return (
    <div className="max-w-4xl">
      <Card className="bg-white border border-gray-300">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Client Module Configuration</CardTitle>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client:
            </label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.value} value={client.value}>
                    {client.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <div className="border border-gray-300 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Available Modules</h3>
            
            <div className="space-y-6">
              {modules.map((module) => (
                <div key={module.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={module.id}
                    checked={module.enabled}
                    disabled={module.disabled}
                    onCheckedChange={(checked) => handleModuleChange(module.id, checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={module.id}
                      className={`block text-sm font-medium cursor-pointer ${
                        module.disabled ? 'text-gray-500' : 'text-gray-900'
                      }`}
                      style={{ fontSize: '14px', fontWeight: 500 }}
                    >
                      {module.name}
                    </label>
                    <p 
                      className="text-gray-600 mt-1"
                      style={{ fontSize: '12px', fontWeight: 400, color: '#6B7280' }}
                    >
                      {module.description}
                    </p>
                    {module.disabled && (
                      <p className="text-xs text-gray-500 mt-1">
                        Checkbox disabled, always checked
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-4 mt-6">
            <Button 
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              style={{ height: '40px' }}
            >
              Save Configuration
            </Button>
            <Button 
              onClick={handleCancel}
              variant="outline"
              style={{ height: '40px' }}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminModuleConfig;
