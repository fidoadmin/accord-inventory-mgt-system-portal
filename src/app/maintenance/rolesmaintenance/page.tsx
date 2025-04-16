"use client";

import React, { useState, useEffect } from "react";
import RolesMaintenance from "@/components/Maintenance/Roles/RolesMaintenance";
import PermissionMaintenance from "@/components/Maintenance/Permission/PermissionMaintenance";
import { SidebarSectionInterface } from "@/types/ComponentInterface";

const PermissionMaintenancePage: React.FC = () => {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<SidebarSectionInterface[] | null>(
    null
  );

  const componentOptions = [
    {
      Code: "ACCESSLABEL-ROLE",
      Component: RolesMaintenance,
    },
    {
      Code: "ACCESSLABEL-PERMISSION",
      Component: PermissionMaintenance,
    },
  ];

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value;
    setSelectedCode(id || null);
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
        if (child.Code === "ACCESSLABEL-ACCESSCONTROL" && child.PageDropdowns) {
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
      {selectedCode && (
        <div className="mt-6 text-xl font-semibold">
          Roles Maintenance <span className="mx-2">&gt;</span>
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

export default PermissionMaintenancePage;
