"use client";

import React, { useState, useEffect } from "react";
import { SidebarSectionInterface } from "@/types/ComponentInterface";
import ClientMaintenanceContainer from "@/components/Maintenance/Client/ClientMaintenance";
import BranchesMaintenanceContainer from "@/components/Maintenance/Branches/BranchesMaintenance";
import DepartmentMaintenance from "@/components/Maintenance/Department/DepartmentMaintenance";
import ManufacturerMaintenance from "@/components/Maintenance/Manufacturers/ManufacturerMaintenance";
import SupplierMaintenance from "@/components/Maintenance/Suppliers/SupplierMaintenance";
import CompaniesMaintenanceContainer from "@/components/Maintenance/Companies/CompaniesMaintenance";

const CompaniesMaintenance: React.FC = () => {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<SidebarSectionInterface[] | null>(
    null
  );
  const componentOptions = [
    { Code: "ACCESSLABEL-CLIENT", Component: ClientMaintenanceContainer },
    { Code: "ACCESSLABEL-COMPANY", Component: CompaniesMaintenanceContainer },
    { Code: "ACCESSLABEL-BRANCH", Component: BranchesMaintenanceContainer },
    { Code: "ACCESSLABEL-DEPARTMENT", Component: DepartmentMaintenance },
    { Code: "ACCESSLABEL-MANUFACTURER", Component: ManufacturerMaintenance },
    { Code: "ACCESSLABEL-SUPPLIER", Component: SupplierMaintenance },
  ];

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCode(event.target.value || null);
  };

  useEffect(() => {
    const menuItemsFromStorage = localStorage.getItem("menuItems");
    if (menuItemsFromStorage) {
      try {
        const parsedMenuItems = JSON.parse(menuItemsFromStorage);
        setMenuItems(parsedMenuItems);
      } catch (error) {
        console.error("Failed to parse menuItems from localStorage:", error);
      }
    }
  }, []);

  const dropdownsArray = menuItems?.flatMap((menu) => {
    if (menu.Code === "ACCESSLABEL-MAINTENANCE") {
      return menu.SideBarDropdowns?.flatMap((child: any) => {
        if (child.Code === "ACCESSLABEL-ORGANIZATION" && child.PageDropdowns) {
          return child.PageDropdowns;
        }
        return [];
      });
    }
    return [];
  });

  const mergedComponents = componentOptions
    .map((component) => {
      const matchingDropdown = dropdownsArray?.find(
        (dropdown) =>
          dropdown?.Code?.toLowerCase() === component.Code.toLowerCase()
      );

      if (matchingDropdown) {
        return { ...matchingDropdown, ...component };
      }

      return null;
    })
    .filter(Boolean);

  useEffect(() => {
    if (mergedComponents.length > 0 && selectedCode === null) {
      setSelectedCode(mergedComponents[0].Code);
    }
  }, [mergedComponents, selectedCode]);

  return (
    <div>
      {selectedCode !== null && (
        <div className="mt-6 text-xl font-semibold">
          Company Maintenance <span className="mx-2">&gt;</span>
          {
            mergedComponents?.find((option) => option.Code === selectedCode)
              ?.Name
          }
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start gap-4 mt-4">
        <select
          value={selectedCode ?? ""}
          onChange={handleSelectChange}
          className="border border-gray-300 rounded-xl font-bold px-4 py-2"
        >
          <option value="" disabled>
            Select a component
          </option>
          {mergedComponents.map((option) => (
            <option key={option.Code} value={option.Code}>
              {option.Name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        {mergedComponents?.map((option) =>
          selectedCode === option.Code ? (
            <option.Component key={option.Code} />
          ) : null
        )}
      </div>
    </div>
  );
};

export default CompaniesMaintenance;
