"use client";
import { InventoryCardPropsInterface } from "@/types/ComponentInterface";
import { WarningRounded } from "@mui/icons-material";

const InventoryCard: React.FC<InventoryCardPropsInterface> = ({
  inventory,
  descriptionId,
}) => {
  return (
    <div
      onClick={() =>
        (window.location.href = `/inventory/details/${descriptionId}/${inventory.Id}`)
      }
      className="inventoryCard flex  justify-between items-center p-2 bg-gray-100 rounded-xl hover:bg-primary hover:text-black text-sm"
    >
      <p className="w-full text-center truncate">
        {inventory.BarCode ? (
          inventory.BarCode
        ) : (
          <div className="flex justify-center">
            <WarningRounded className="text-error" />
          </div>
        )}
      </p>
      <p className="w-full text-center truncate">{inventory.BatchNumber}</p>
      <p className="w-full text-center truncate">{inventory.PackSize}</p>
      <p
        className={`w-full text-center truncate ${
          inventory.ExpirationDate ? "text-text" : "text-error"
        }`}
      >
        {inventory.ExpirationDate || ""}
      </p>
      <p className="w-full text-center truncate font-bold">
        {inventory.Quantity}
      </p>
      <p className="w-full text-center truncate font-bold">
        {inventory.Created}
      </p>
    </div>
  );
};

export default InventoryCard;
