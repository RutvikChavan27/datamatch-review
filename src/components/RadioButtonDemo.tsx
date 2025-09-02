import React, { useState } from 'react';
import { RadioButton, RadioGroup } from './ui/custom-radio';
import { Card } from './ui/card';

export const RadioButtonDemo = () => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [workflowType, setWorkflowType] = useState('');
  const [priority, setPriority] = useState('');

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Custom Radio Button Components</h1>
        <p className="text-muted-foreground">Modern, accessible radio buttons with comprehensive states</p>
      </div>

      {/* Payment Method Example */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Payment Method Selection</h2>
        <RadioGroup 
          name="payment-method" 
          value={paymentMethod}
          onChange={setPaymentMethod}
          required
          error={paymentMethod === 'bank' ? 'Bank transfer is temporarily unavailable' : undefined}
        >
          <RadioButton 
            name="payment-method"
            label="Credit Card" 
            value="credit" 
            hint="Visa, MasterCard, American Express accepted"
            required
          />
          <RadioButton 
            name="payment-method"
            label="PayPal" 
            value="paypal"
            hint="Pay securely with your PayPal account"
          />
          <RadioButton 
            name="payment-method"
            label="Bank Transfer" 
            value="bank"
            hint="Direct bank transfer (2-3 business days)"
            error="Currently unavailable due to maintenance"
          />
          <RadioButton 
            name="payment-method"
            label="Cryptocurrency" 
            value="crypto"
            disabled
            hint="Bitcoin, Ethereum, and other major currencies"
          />
        </RadioGroup>
      </Card>

      {/* Workflow Type Example */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Workflow Configuration</h2>
        <RadioGroup 
          name="workflow-type" 
          value={workflowType}
          onChange={setWorkflowType}
        >
          <RadioButton 
            name="workflow-type"
            label="Automated Workflow" 
            value="automated" 
            hint="Runs automatically based on triggers"
            size="lg"
          />
          <RadioButton 
            name="workflow-type"
            label="Manual Review" 
            value="manual"
            hint="Requires manual approval at each step"
            size="lg"
          />
          <RadioButton 
            name="workflow-type"
            label="Hybrid Process" 
            value="hybrid"
            hint="Combines automated and manual steps"
            size="lg"
          />
        </RadioGroup>
      </Card>

      {/* Priority Level Example */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Priority Level (Small Size)</h2>
        <RadioGroup 
          name="priority" 
          value={priority}
          onChange={setPriority}
        >
          <RadioButton 
            name="priority"
            label="Low Priority" 
            value="low" 
            size="sm"
          />
          <RadioButton 
            name="priority"
            label="Medium Priority" 
            value="medium"
            size="sm"
          />
          <RadioButton 
            name="priority"
            label="High Priority" 
            value="high"
            size="sm"
          />
          <RadioButton 
            name="priority"
            label="Critical" 
            value="critical"
            size="sm"
            required
          />
        </RadioGroup>
      </Card>

      {/* Current Values Display */}
      <Card className="p-6 bg-muted/20">
        <h3 className="text-lg font-semibold mb-3">Current Selections</h3>
        <div className="space-y-2 text-sm">
          <p><strong>Payment Method:</strong> {paymentMethod || 'None selected'}</p>
          <p><strong>Workflow Type:</strong> {workflowType || 'None selected'}</p>
          <p><strong>Priority:</strong> {priority || 'None selected'}</p>
        </div>
      </Card>
    </div>
  );
};