"use client";

import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { getCookie } from "cookies-next";
import DailySalesReportPage from "@/components/DailySalesReport";
import FOCReportPage from "@/components/FOCReport";
import InvoiceNullReportPage from "@/components/InvoiceNullReport";
import LostReportPage from "@/components/LostReport";
import ThresholdReport from "@/components/ThresholdReport";
import { SidebarSectionInterface } from "@/types/ComponentInterface";

const NewReportPage = () => {
  const [selectedReport, setSelectedReport] = useState<string>("");
  const [action, setAction] = useState<"pdf" | "csv" | "abc">("abc");
  const [authKey, setAuthKey] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<SidebarSectionInterface[] | null>(
    null
  );

  useEffect(() => {
    const authKey = getCookie("authKey") as string;
    setAuthKey(authKey);
  }, []);

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

  const onDownloadComplete = () => {
    setAction("abc");
  };

  const componentOptions = menuItems?.[0]?.PageDropdowns?.map(
    (dropdown: any, index: number) => ({
      id: index,
      label: dropdown.Name.toLowerCase().replace(/\s+/g, ""),
      Name: dropdown.Name,
      Component: getComponentByName(dropdown.Name),
    })
  );

  const getComponentByName = (name: string) => {
    switch (name) {
      case "FOC":
        return FOCReportPage;
      case "Invoice Null":
        return InvoiceNullReportPage;
      case "Daily Stock":
        return DailySalesReportPage;
      case "Lost Item":
        return LostReportPage;
      case "Threshold":
        return ThresholdReport;
      default:
        return null;
    }
  };

  return (
    <main className="p-4">
      <h1 className="text-2xl font-semibold mb-6">Reports</h1>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="w-full md:w-auto">
          <select
            id="report-select"
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
          >
            <option value="">Select a report</option>
            {componentOptions?.map((option: any) => (
              <option key={option.id} value={option.label}>
                {option.Name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!selectedReport && (
        <div className="text-center text-black mt-10">
          <p className="text-3xl font-semibold">
            📊 Select a report to view its details!
          </p>
          <p className="text-2xl mt-2">
            Choose from the dropdown above to generate a report.
          </p>
        </div>
      )}

      {componentOptions?.map(
        (option: any) =>
          selectedReport === option.label &&
          option.Component && (
            <option.Component
              key={option.id}
              action={action}
              onDownloadComplete={onDownloadComplete}
            />
          )
      )}
    </main>
  );
};

export default NewReportPage;
