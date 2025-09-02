import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CreateWorkflowPopoverProps {
  children: React.ReactNode;
}

export const CreateWorkflowPopover: React.FC<CreateWorkflowPopoverProps> = ({
  children
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/workflows/create');
  };

  return (
    <div onClick={handleClick}>
      {children}
    </div>
  );
};
