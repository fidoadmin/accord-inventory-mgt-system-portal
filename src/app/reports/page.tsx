"use client";

import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DailySalesReportPage from "@/components/DailySalesReport";
import FOCReportPage from "@/components/FOCReport";
import InvoiceNullReportPage from "@/components/InvoiceNullReport";
import LostReportPage from "@/components/LostReport";
import ThresholdReport from "@/components/ThresholdReport";
import { SidebarSectionInterface } from "@/types/ComponentInterface";

const NewReportPage = () => {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<SidebarSectionInterface[] | null>(
    null
  );

  const componentOptions = [
    {
      Code: "ACCESSLABEL-DAILYSTOCK",
      Component: DailySalesReportPage,
    },
    {
      Code: "ACCESSLABEL-FOC",
      Component: FOCReportPage,
    },
    {
      Code: "ACCESSLABEL-INVOICE",
      Component: InvoiceNullReportPage,
    },
    {
      Code: "ACCESSLABEL-LOSTITEM",
      Component: LostReportPage,
    },
    {
      Code: "ACCESSLABEL-THRESHOLD",
      Component: ThresholdReport,
    },
  ];

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
    menu.Code === "ACCESSLABEL-REPORT"
      ? menu.SideBarDropdowns?.flatMap((child: any) =>
          child.Code === "ACCESSLABEL-GENERAL" ? child.PageDropdowns || [] : []
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
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCode(event.target.value || null);
  };

  return (
    <div>
      {selectedCode !== null && (
        <div className="mt-6 text-xl font-semibold">
          Reports <span className="mx-2">&gt;</span>{" "}
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
            Select a Report
          </option>
          {mergedComponents?.map((option) => (
            <option key={option.Code} value={option.Code}>
              {option.Name}
            </option>
          ))}
        </select>
      </div>

      {selectedCode === null && (
        <div className="text-center text-black mt-10">
          <p className="text-3xl font-semibold">
            📊 Select a report to view its details!
          </p>
          <p className="text-2xl mt-2">
            Choose from the dropdown above to generate a report.
          </p>
        </div>
      )}

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

export default NewReportPage;
