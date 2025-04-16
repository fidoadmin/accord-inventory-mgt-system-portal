// MaintenanceNavigation.tsx

"use client";

import React from "react";
import InventoryRoundedIcon from "@mui/icons-material/InventoryRounded";

type MaintenanceNavigationProps = {
  setSelectedId: (id: number) => void;
  selectedId: number | null | undefined;
  currentRoute: number;
  isUserPage?: boolean;
};

const MaintenanceNavigation: React.FC<MaintenanceNavigationProps> = ({
  setSelectedId,
  selectedId,
  currentRoute,
  isUserPage = false,
}) => {
  return (
    <div className="navigation-container">
      {!isUserPage && (
        <>
          {/* <div className="flex space-x-4">
            <button
              className="flex flex-col items-center  font-bold px-4 py-2 text-black hover:opacity-40"
              onClick={() => setSelectedId(0)}
            >
              <InventoryRoundedIcon fontSize="large" />
              <span>Inventory Description</span>
            </button>
            <button
              className="flex flex-col items-center  font-bold px-4 py-2 text-black hover:opacity-40"
              onClick={() => setSelectedId(1)}
            >
              <InventoryRoundedIcon fontSize="large" />
              <span>Categories</span>
            </button>
            <button
              className="flex flex-col items-center  font-bold px-4 py-2 text-black hover:opacity-40"
              onClick={() => setSelectedId(2)}
            >
              <InventoryRoundedIcon fontSize="large" />
              <span>Branch</span>
            </button>
            <button
              className="flex flex-col items-center  font-bold px-4 py-2 text-black hover:opacity-40"
              onClick={() => setSelectedId(3)}
            >
              <InventoryRoundedIcon fontSize="large" />
              <span>Companies</span>
            </button>
            <button
              className="flex flex-col items-center  font-bold px-4 py-2 text-black hover:opacity-40"
              onClick={() => setSelectedId(4)}
            >
              <InventoryRoundedIcon fontSize="large" />
              <span>Containers</span>
            </button>
            <button
              className="flex flex-col items-center font-bold px-4 py-2 text-black hover:opacity-40"
              onClick={() => setSelectedId(5)}
            >
              <InventoryRoundedIcon fontSize="large" />
              <span>Agents</span>
            </button>
          </div> */}
        </>
      )}
      {isUserPage && (
        <button
          onClick={() => setSelectedId(selectedId ? selectedId : 0)}
        ></button>
      )}
    </div>
  );
};

export default MaintenanceNavigation;
