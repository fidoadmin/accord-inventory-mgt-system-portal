import React from "react";
import { useInventoryPerCompany } from "@/app/hooks/inventories/useInventoriesPerCompany";
import Loading from "@/app/loading";

import { KeyboardArrowLeftRounded } from "@mui/icons-material";

import Link from "next/link";
import { DeficitQtyModalInterface } from "@/types/ComponentInterface";
import { getCookie } from "cookies-next";

const DeficitQtyModal: React.FC<DeficitQtyModalInterface> = ({
  inventoryDescription,
  currentCompany,
  currentBranch,
  onBack,
  onNotify,
}) => {
  // Fetching auth key from cookies
  const authKey = getCookie("authKey") as string;

  // Defining parameters for API call
  const params = {
    page: 1,
    limit: 10, // You can adjust this value to control the number of items per page
    inventoryDescriptionId: inventoryDescription?.Id!,
    companyId: currentCompany?.id!,
  };

  // Custom hook to fetch inventory data
  const {
    data: inventoryPerCompanyData,
    error,
    isLoading,
  } = useInventoryPerCompany(authKey || "", params);

  // Loading state
  if (isLoading) {
    return <Loading />;
  }

  // Error or No Data Found handling
  if (
    error ||
    !inventoryPerCompanyData ||
    inventoryPerCompanyData.length === 0
  ) {
    return (
      <div className="branchInventoryInfo p-4">
        {/* Back button */}
        <button
          onClick={onBack}
          className="backButton flex items-center gap-2 text-primary hover:text-primary-dark"
        >
          <KeyboardArrowLeftRounded />
          Back
        </button>

        {/* Error/No Data Title */}
        <h1 className="text-2xl font-bold mt-4 text-error text-center">
          {error ? "Error Loading Inventory" : "No Inventory Data Found"}
        </h1>

        {/* Detailed message */}
        <p className="text-text mt-2 text-center">
          {error
            ? "We encountered an error while loading the inventory data. Please try refreshing the page or contact support if the issue persists."
            : `There is currently no inventory data available for ${currentCompany?.name} across its branches. Please check back later or contact the administrator for further assistance.`}
        </p>
      </div>
    );
  }

  // Main Content when data is available
  return (
    <div className="branchInventoryInfo p-4 text-center">
      {/* Back button */}
      <button
        onClick={onBack}
        className="backButton flex items-center gap-2 text-primary hover:text-primary-dark"
      >
        <KeyboardArrowLeftRounded />
        Back
      </button>

      {/* Section title and description */}
      <h1 className="text-center text-error font-bold text-lg uppercase">
        Not Enough Available Quantity
      </h1>
      <h1 className="font-bold mt-4">
        {inventoryDescription.Description} Inventory Information <br />
        <span className="text-primary text-lg">for {currentCompany?.name}</span>
      </h1>
      <p className="text-text mt-2 opacity-60">
        Displaying the available inventory quantities for the selected company
        across branches. Below you will find detailed information on the
        inventory levels.
      </p>
      <p className="text-text">
        Selected Deficit Data from Branch:{" "}
        <span className="text-success"> {currentBranch.name}</span>
      </p>

      {/* Inventory Data Table */}
      <div className="inventoryTable mt-6 rounded-xl text-center">
        {inventoryPerCompanyData.filter(
          (branchData) => branchData.BranchId != currentBranch.id
        ).length ? (
          <>
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="px-4 py-2">Branch Name</th>
                  <th className="px-4 py-2">Available Quantity</th>
                </tr>
              </thead>
              <tbody className="bg-background">
                {inventoryPerCompanyData
                  .filter(
                    (inventory) => inventory.BranchId !== currentBranch.id
                  )
                  .map((inventory) => (
                    <tr key={inventory.BranchId} className="border-t">
                      <td className="px-4 py-2">{inventory.BranchName}</td>
                      <td
                        className={`px-4 py-2 ${
                          inventory.AvailableQuantity <= 0
                            ? "text-error font-bold"
                            : "text-success"
                        }`}
                      >
                        {inventory.AvailableQuantity}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="my-4 flex gap-4 w-full justify-around">
              <Link
                href={`/checkout`}
                className="bg-success hover:opacity-80 text-white px-4 py-2 rounded-xl"
              >
                Go to Branch Transfer
              </Link>
              <button
                className="bg-highlight hover:opacity-80 text-white px-4 py-2 rounded-xl"
                onClick={onNotify}
              >
                Notify When Restocked
              </button>
            </div>
          </>
        ) : (
          <div className="w-full px-4">
            <h1 className="text-center text-error font-bold">
              Inventory not found in other branches
            </h1>
            <div className="my-4">
              <button
                className="bg-highlight hover:opacity-80 text-white px-4 py-2 rounded-xl"
                onClick={onNotify}
              >
                Notify When Restocked
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeficitQtyModal;
