
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const MatchingRules = () => {
  const [rules, setRules] = useState([
    {
      id: '1',
      name: 'Exact PO Number Match',
      field: 'poNumber',
      condition: 'exact',
      tolerance: 0,
      enabled: true,
      priority: 1
    },
    {
      id: '2',
      name: 'Amount Variance Tolerance',
      field: 'amount',
      condition: 'tolerance',
      tolerance: 5,
      enabled: true,
      priority: 2
    },
    {
      id: '3',
      name: 'Vendor Name Fuzzy Match',
      field: 'vendor',
      condition: 'fuzzy',
      tolerance: 85,
      enabled: true,
      priority: 3
    },
    {
      id: '4',
      name: 'Date Range Match',
      field: 'date',
      condition: 'range',
      tolerance: 30,
      enabled: false,
      priority: 4
    }
  ]);

  const updateRule = (id: string, field: string, value: any) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, [field]: value } : rule
    ));
  };

  const addRule = () => {
    const newRule = {
      id: String(rules.length + 1),
      name: 'New Rule',
      field: 'poNumber',
      condition: 'exact',
      tolerance: 0,
      enabled: true,
      priority: rules.length + 1
    };
    setRules([...rules, newRule]);
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/matching">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Matching
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground font-inter">Matching Rules</h1>
            <p className="text-muted-foreground font-roboto">Configure automatic document matching criteria</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={addRule} variant="outline" className="button-outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Rule
          </Button>
          <Button className="button-primary">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Configuration Info */}
      <Card>
        <CardHeader>
          <CardTitle>Matching Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground font-inter">Auto-Match Threshold</label>
              <Select defaultValue="high">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High Confidence (95%+)</SelectItem>
                  <SelectItem value="medium">Medium Confidence (85%+)</SelectItem>
                  <SelectItem value="low">Low Confidence (75%+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground font-inter">Manual Review Threshold</label>
              <Select defaultValue="medium">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High Variance (10%+)</SelectItem>
                  <SelectItem value="medium">Medium Variance (5%+)</SelectItem>
                  <SelectItem value="low">Low Variance (1%+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground font-inter">Processing Mode</label>
              <Select defaultValue="automatic">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automatic">Fully Automatic</SelectItem>
                  <SelectItem value="semi">Semi-Automatic</SelectItem>
                  <SelectItem value="manual">Manual Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Matching Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Matching Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.map((rule) => (
              <Card key={rule.id} className="border-border">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    <div>
                      <label className="text-sm font-medium text-foreground font-inter">Rule Name</label>
                      <Input
                        value={rule.name}
                        onChange={(e) => updateRule(rule.id, 'name', e.target.value)}
                        className="mt-1 font-roboto"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground font-inter">Field</label>
                      <Select
                        value={rule.field}
                        onValueChange={(value) => updateRule(rule.id, 'field', value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="poNumber">PO Number</SelectItem>
                          <SelectItem value="amount">Amount</SelectItem>
                          <SelectItem value="vendor">Vendor</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="description">Description</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground font-inter">Condition</label>
                      <Select
                        value={rule.condition}
                        onValueChange={(value) => updateRule(rule.id, 'condition', value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="exact">Exact Match</SelectItem>
                          <SelectItem value="tolerance">Tolerance</SelectItem>
                          <SelectItem value="fuzzy">Fuzzy Match</SelectItem>
                          <SelectItem value="range">Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground font-inter">
                        {rule.condition === 'tolerance' ? 'Tolerance (%)' : 
                         rule.condition === 'fuzzy' ? 'Similarity (%)' :
                         rule.condition === 'range' ? 'Days Range' : 'Value'}
                      </label>
                      <Input
                        type="number"
                        value={rule.tolerance}
                        onChange={(e) => updateRule(rule.id, 'tolerance', Number(e.target.value))}
                        className="mt-1 font-roboto"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground font-inter">Priority</label>
                      <Input
                        type="number"
                        value={rule.priority}
                        onChange={(e) => updateRule(rule.id, 'priority', Number(e.target.value))}
                        className="mt-1 font-roboto"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={(checked) => updateRule(rule.id, 'enabled', checked)}
                        />
                        <span className="text-sm text-muted-foreground font-roboto">Enabled</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteRule(rule.id)}
                        className="text-[hsl(var(--status-rejected))] hover:text-[hsl(var(--status-rejected))]/80"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rule Testing */}
      <Card>
        <CardHeader>
          <CardTitle>Test Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground font-inter">Test Document Set</label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a document set to test" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DS-00123">DS-00123 (Invoice + PO)</SelectItem>
                  <SelectItem value="DS-00124">DS-00124 (Invoice + PO + GRN)</SelectItem>
                  <SelectItem value="DS-00125">DS-00125 (Partial Set)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full button-primary">Test Rules</Button>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium text-sm text-foreground font-inter mb-2">Test Results</h4>
            <p className="text-sm text-muted-foreground font-roboto">Select a document set above to test the current matching rules and see the confidence score.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchingRules;
