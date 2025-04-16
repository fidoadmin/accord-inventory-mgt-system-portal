import React from "react";
import { Button, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

interface ExceedQuantityComponentProps {
  onNotifyRestock: (args: any) => any; 
  onClose: () => void; 
}

const ExceedQuantityComponent: React.FC<ExceedQuantityComponentProps> = ({
  onNotifyRestock,
  onClose,
}) => {
  const handleNotify = () => {
    onNotifyRestock({}); 
  };

  return (
    <div className="exceed-quantity-popup fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg space-y-4 w-1/3 relative">
        <IconButton
          className="absolute top-2 right-2"
          onClick={onClose} 
          aria-label="Close"
        >
          <CloseIcon />
        </IconButton>
        <h3 className="text-xl font-bold">Quantity Exceeds Available Stock</h3>
        <Button variant="contained" color="primary" onClick={handleNotify}>
          Notify When Restocked
        </Button>
      </div>
    </div>
  );
};

export default ExceedQuantityComponent;
