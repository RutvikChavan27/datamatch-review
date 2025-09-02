
import React from 'react';
import { FileText, Zap, Settings, Target, Wrench, CheckCircle } from 'lucide-react';

interface WizardProgressProps {
  currentStep: number;
  maxSteps: number;
}

export const WizardProgress: React.FC<WizardProgressProps> = ({ 
  currentStep, 
  maxSteps 
}) => {
  const steps = [
    { label: 'Setup', icon: FileText },
    { label: 'Trigger', icon: Zap },
    { label: 'Configure', icon: Settings },
    { label: 'Actions', icon: Target }, 
    { label: 'Details', icon: Wrench },
    { label: 'Review', icon: CheckCircle }
  ];

  return (
    <div className="w-full">
      {/* Compact Progress Bar */}
      <div className="relative h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
        <div 
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${(currentStep / maxSteps) * 100}%` }}
        />
      </div>
      
      {/* Compact Step Indicators */}
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;
          const IconComponent = step.icon;
          
          return (
            <div key={index} className="flex items-center">
              <div className={`
                relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300
                ${isCompleted ? 'bg-green-500 text-white' : ''}
                ${isActive ? 'bg-blue-500 text-white scale-110' : ''}
                ${isUpcoming ? 'bg-gray-200 text-gray-500' : ''}
              `}>
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <IconComponent className="w-4 h-4" />
                )}
                
                {isActive && (
                  <div className="absolute inset-0 rounded-full bg-blue-500 animate-pulse opacity-25" />
                )}
              </div>
              
              {/* Step Label - Only show for active step */}
              {isActive && (
                <div className="ml-3 text-sm font-medium text-blue-600">
                  {step.label}
                </div>
              )}
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={`
                  h-px flex-1 mx-2 transition-colors duration-300
                  ${stepNumber < currentStep ? 'bg-green-500' : 'bg-gray-200'}
                `} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
