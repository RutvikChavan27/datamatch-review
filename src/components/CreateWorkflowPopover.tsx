import React from 'react';
interface CreateWorkflowPopoverProps {
  children: React.ReactNode;
}
export const CreateWorkflowPopover: React.FC<CreateWorkflowPopoverProps> = ({
  children
}) => {
  const handleClick = () => {
    window.open('https://workflows-ui.lovable.app/', '_blank');
  };

  return (
    <div onClick={handleClick}>
      {children}
    </div>
  );
};