"use client";
import { InventoryDetail } from "@/types/ReportInterface";

interface ReportCardProps {
  InventoryDetails: InventoryDetail[];
  customername: string;
}

const ReportCard: React.FC<ReportCardProps> = ({
  InventoryDetails,
  customername,
}) => {
  return (
    <div className="w-full mx-auto  border-2  p-4 flex items-center ">
      <div className=" flex w-[14%]  flex-col  space-y-2">
        <div className="flex-1 w-full text-center">
          <p>{customername}</p>
        </div>
      </div>
      <div className="flex-1  flex  flex-col space-y-2">
        {InventoryDetails.map((inventoryItem, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b "
          >
            <div className="flex-1 w-1/6 text-center ">
              <p
                className="truncate"
                title={inventoryItem.InventoryDescription}
              >
                {inventoryItem.ShortName}
              </p>
            </div>
            <div className="flex-1 w-1/6 text-center ">
              <p>{inventoryItem.ExpirationDate}</p>
            </div>
            <div className="flex-1 w-1/6 text-center ">
              <p>{inventoryItem.Quantity}</p>
            </div>
            <div className="flex-1 w-1/6 text-center ">
              <p>{inventoryItem.Date}</p>
            </div>
            <div className="flex-1 w-1/6 text-center ">
              <p className="">
                {inventoryItem.FirstName} {inventoryItem.LastName}
              </p>
            </div>

            <div className="flex-1 w-1/6 text-center   break-words">
              <p>{inventoryItem.EmailAddress}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportCard;
