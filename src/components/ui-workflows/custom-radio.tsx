import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

interface RadioButtonProps {
  label: string;
  name: string;
  value: string;
  checked?: boolean;
  disabled?: boolean;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  hint?: string;
  error?: string;
  onChange?: (value: string) => void;
  className?: string;
}

interface RadioGroupProps {
  name: string;
  value?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  onChange?: (value: string) => void;
  className?: string;
}

const RadioButton = React.forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ 
    label, 
    name, 
    value, 
    checked = false, 
    disabled = false, 
    required = false, 
    size = 'md', 
    hint, 
    error, 
    onChange,
    className,
    ...props 
  }, ref) => {
    const radioId = React.useId();
    
    const sizeClasses = {
      sm: {
        radio: "w-3.5 h-3.5",
        dot: "w-1.5 h-1.5",
        label: "text-sm",
        spacing: "ml-2"
      },
      md: {
        radio: "w-4 h-4", 
        dot: "w-2 h-2",
        label: "text-base",
        spacing: "ml-3"
      },
      lg: {
        radio: "w-5 h-5",
        dot: "w-2.5 h-2.5", 
        label: "text-lg",
        spacing: "ml-3"
      }
    };

    const currentSize = sizeClasses[size];

    return (
      <div className={cn("radio-group", className)}>
        <div className={cn(
          "radio-item flex items-start",
          error && "radio-error-state"
        )}>
          <label 
            htmlFor={radioId}
            className="radio-container relative inline-flex items-center cursor-pointer"
          >
            <input
              ref={ref}
              type="radio"
              id={radioId}
              name={name}
              value={value}
              checked={checked}
              disabled={disabled}
              required={required}
              onChange={(e) => onChange?.(e.target.value)}
              className="radio-input sr-only"
              {...props}
            />
            
            <div className={cn(
              "radio-custom border-[1.5px] rounded-full bg-white transition-all duration-200 ease-in-out relative",
              currentSize.radio,
              // Default state
              "border-gray-600",
              // Hover state
              !disabled && "hover:border-primary hover:bg-primary/5 hover:scale-105",
              // Checked state  
              checked && !error && "border-primary bg-primary/10 animate-radio-select",
              // Error state
              error && "border-red-500 hover:border-red-600",
              error && checked && "bg-red-50 animate-radio-select",
              // Disabled state
              disabled && "border-gray-300 bg-gray-100 cursor-not-allowed",
              // Focus state
              "focus-within:ring-2 focus-within:ring-primary/20 focus-within:ring-offset-1"
            )}>
              {/* Inner dot */}
              <div className={cn(
                "radio-dot absolute rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ease-in-out",
                currentSize.dot,
                // Default state
                checked ? "scale-100" : "scale-0",
                // Colors
                !error && checked && "bg-primary",
                error && checked && "bg-red-600", 
                disabled && checked && "bg-gray-400"
              )} />
            </div>
          </label>
          
          <div className="flex items-center">
            <label 
              htmlFor={radioId}
              className={cn(
                "radio-label font-medium cursor-pointer select-none leading-5",
                currentSize.label,
                currentSize.spacing,
                disabled ? "text-gray-400 cursor-not-allowed" : "text-foreground",
                error && "text-red-900"
              )}
            >
              {label}
              {required && <span className="required-asterisk text-red-500 ml-1">*</span>}
            </label>
            {hint && !error && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 ml-1 text-muted-foreground hover:text-foreground transition-colors cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">{hint}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        
        
        {error && (
          <div className={cn(
            "radio-error mt-1 text-sm text-red-600 flex items-center gap-1",
            size === 'sm' ? "ml-5" : "ml-7"
          )}>
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            {error}
          </div>
        )}
      </div>
    );
  }
);

RadioButton.displayName = "RadioButton";

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ name, value, error, required, children, onChange, className, ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        className={cn("space-y-3", className)}
        role="radiogroup"
        aria-required={required}
        aria-invalid={!!error}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === RadioButton) {
            return React.cloneElement(child as React.ReactElement<RadioButtonProps>, {
              name,
              checked: child.props.value === value,
              onChange: onChange || child.props.onChange,
              error: error && !child.props.error ? error : child.props.error,
            });
          }
          return child;
        })}
      </div>
    );
  }
);

RadioGroup.displayName = "RadioGroup";

export { RadioButton, RadioGroup };