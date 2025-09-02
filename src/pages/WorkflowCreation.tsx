import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkflowTypeSelection } from '../components/WorkflowTypeSelection';
import { SimpleWorkflowWizard } from '../components/SimpleWorkflowWizard';
import { WizardContainer } from '../components/WizardContainer';

const WorkflowCreation = () => {
  const navigate = useNavigate();
  const [workflowMode, setWorkflowMode] = useState<'selection' | 'simple' | 'advanced'>('selection');

  const handleWorkflowTypeSelect = (type: 'simple' | 'advanced') => {
    setWorkflowMode(type);
  };

  const handleBackToSelection = () => {
    setWorkflowMode('selection');
  };

  const handleBackToList = () => {
    navigate('/workflows');
  };

  const handleSimpleWorkflowComplete = (workflow: any) => {
    console.log('Simple workflow created:', workflow);
    alert('🎉 Simple workflow created successfully! Your automation is now active.');
    navigate('/workflows');
  };

  const handleAdvancedWorkflowComplete = () => {
    console.log('Advanced workflow created successfully!');
    alert('🎉 Advanced workflow created successfully! Your automation is now active.');
    navigate('/workflows');
  };

  if (workflowMode === 'selection') {
    return (
      <WorkflowTypeSelection 
        onSelectType={handleWorkflowTypeSelect} 
        onBack={handleBackToList} 
      />
    );
  }

  if (workflowMode === 'simple') {
    return (
      <SimpleWorkflowWizard 
        onComplete={handleSimpleWorkflowComplete}
        onBack={handleBackToSelection}
      />
    );
  }

  return (
    <WizardContainer 
      onBack={handleBackToSelection} 
      onComplete={handleAdvancedWorkflowComplete} 
    />
  );
};

export default WorkflowCreation;
