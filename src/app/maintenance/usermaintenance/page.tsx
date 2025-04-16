"use client";

import React, { useState, useEffect } from "react";
import { SidebarSectionInterface } from "@/types/ComponentInterface";
import CustomerMaintenanceContainer from "@/components/Maintenance/Customer/CustomerMaintenance";
import UserMaintenanceContainer from "@/components/Maintenance/Users/UserMaintenance";

const UserMaintenance: React.FC = () => {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<SidebarSectionInterface[] | null>(
    null
  );

  const componentOptions = [
    {
      Code: "ACCESSLABEL-CUSTOMER",
      Component: CustomerMaintenanceContainer,
    },
    {
      Code: "ACCESSLABEL-EMPLOYEE",
      Component: UserMaintenanceContainer,
    },
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

  const dropdownsArray = menuItems?.flatMap((menu) =>
    menu.Code === "ACCESSLABEL-MAINTENANCE"
      ? menu.SideBarDropdowns?.flatMap((child: any) =>
          child.Code === "ACCESSLABEL-USER" ? child.PageDropdowns || [] : []
        )
      : []
  );

  const mergedComponents = dropdownsArray
    ?.map((dropdown) => {
      const matchingComponent = componentOptions.find(
        (component) => component.Code === dropdown.Code
      );
      return matchingComponent
        ? { ...dropdown, Component: matchingComponent.Component }
        : null;
    })
    .filter(Boolean);

  useEffect(() => {
    if ((mergedComponents?.length ?? 0) > 0 && selectedCode === null) {
      setSelectedCode(mergedComponents?.[0]?.Code ?? null);
    }
  }, [mergedComponents, selectedCode]);

  return (
    <div>
      {selectedCode !== null && (
        <div className="mt-6 text-xl font-semibold">
          User Maintenance <span className="mx-2">&gt;</span>{" "}
          {
            mergedComponents?.find((option) => option.Code === selectedCode)
              ?.Name
          }
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start gap-4 mt-5">
        <select
          value={selectedCode ?? ""}
          onChange={handleSelectChange}
          className="border border-gray-300 rounded-xl font-bold px-4 py-2"
        >
          <option value="" disabled>
            Select a component
          </option>
          {mergedComponents?.map((option) => (
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

export default UserMaintenance;
