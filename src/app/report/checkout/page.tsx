"use client";

import React, { useState, useEffect } from "react";
import { SidebarSectionInterface } from "@/types/ComponentInterface";
import CheckoutReport from "@/components/CheckoutReport";
import SalesInfo from "@/components/SalesInfo";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useFetchSalesInfo } from "@/app/hooks/salesinfo/useSalesInfo";
import { useDropdownList } from "@/app/hooks/globaldropdown/useGlobalDropdown";
import { useCheckouts } from "@/app/hooks/checkouts/useCheckouts";

const ReportPage: React.FC = () => {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<SidebarSectionInterface[] | null>(
    null
  );
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [authKey, setAuthKey] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [roleCode, setRoleCode] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [isClientSelected, setIsClientSelected] = useState(false);

  const statusAllEnabled = statusFilter === "all";
  const typeAllEnabled = typeFilter === "all";
  const formatDate = (date: Date) =>
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    date.getDate().toString().padStart(2, "0");

  const { data, error, isLoading } = useFetchSalesInfo(
    authKey || "",
    selectedCode !== "ACCESSLABEL-CHECKOUT" && selectedClientId
      ? { clientid: selectedClientId }
      : {}
  );

  const {
    data: checkouts,
    error: checkoutsError,
    isLoading: checkoutsLoading,
  } = useCheckouts({
    clientid: selectedClientId || undefined,
  });

  const { data: client } = useDropdownList("clients", search, filters);

  const componentOptions = [
    {
      Code: "ACCESSLABEL-SALEINFO",
      Component: SalesInfo,
    },
    {
      Code: "ACCESSLABEL-CHECKOUT",
      Component: CheckoutReport,
    },
  ];

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const code = event.target.value;
    setSelectedCode(code || null);
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
    menu.Code === "ACCESSLABEL-REPORT"
      ? menu.SideBarDropdowns?.flatMap((child: any) =>
          child.Code === "ACCESSLABEL-TRANSACTION"
            ? child.PageDropdowns || []
            : []
        )
      : []
  );

  const mergedComponents = componentOptions
    .map((component) => {
      const matchingDropdown = dropdownsArray?.find(
        (dropdown) =>
          dropdown?.Code?.toLowerCase() === component.Code.toLowerCase()
      );

      return matchingDropdown ? { ...matchingDropdown, ...component } : null;
    })
    .filter(Boolean);

  useEffect(() => {
    const RoleCode = localStorage.getItem("RoleCode");
    setRoleCode(RoleCode);
  }, []);

  const handleStatusFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStatusFilter(event.target.value);
  };

  const handleTypeFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setTypeFilter(event.target.value);
  };

  const handleDateFromSelect = (date: Date | null) => {
    setFromDate(date ? formatDate(date) : "");
  };

  const handleDateToSelect = (date: Date | null) => {
    setToDate(date ? formatDate(date) : "");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };
  const handleSelectClient = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedClientId(selectedValue);

    setIsClientSelected(selectedValue !== "");
  };

  return (
    <main className="p-4">
      {selectedCode !== null && (
        <div className="mt-6 text-xl font-semibold">
          Reports <span className="mx-2">&gt;</span>{" "}
          {
            mergedComponents.find((option) => option.Code === selectedCode)
              ?.Name
          }
        </div>
      )}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="w-full md:w-auto mt-4">
            <select
              value={selectedCode ?? ""}
              onChange={handleSelectChange}
              className="border border-gray-300 rounded-xl font-bold px-4 py-2"
            >
              <option value="" disabled>
                Select a Report
              </option>
              {mergedComponents.map((option) => (
                <option key={option.Code} value={option.Code}>
                  {option.Name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedCode && roleCode === "USERROLE_SYSTEMADMIN" && (
          <select
            className="border border-gray-300 px-4 py-2 rounded-xl w-52"
            onChange={handleSelectClient}
            value={selectedClientId}
            required
          >
            <option value="" disabled={selectedClientId !== ""}>
              Select a Client
            </option>
            {isClientSelected && <option value="">All</option>}
            {client?.map((client: any) => (
              <option key={client.Id} value={client.Id}>
                {client.Name}
              </option>
            ))}
          </select>
        )}

        {selectedCode === "ACCESSLABEL-CHECKOUT" && (
          <div className="w-full md:w-auto mb-1">
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-xl"
            >
              <option value="all" disabled={!statusAllEnabled}>
                {statusFilter === "all" ? "Status" : "All"}
              </option>
              <option value="cancelled">Cancelled</option>
              <option value="dispatched">Dispatched</option>
              <option value="returned">Returned</option>
            </select>
          </div>
        )}

        {selectedCode === "ACCESSLABEL-CHECKOUT" && (
          <div className="w-full md:w-auto mb-1">
            <select
              id="typeFilter"
              value={typeFilter}
              onChange={handleTypeFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-xl"
            >
              <option value="all" disabled={!typeAllEnabled}>
                {typeFilter === "all" ? "Type" : "All"}
              </option>
              <option value="branch">Branch</option>
              <option value="external">External</option>
            </select>
          </div>
        )}

        {selectedCode === "ACCESSLABEL-CHECKOUT" && (
          <>
            <div className="w-full md:w-auto mb-1">
              <label
                htmlFor="date-from"
                className="font-semibold text-lg"
              ></label>
              <DatePicker
                id="date-from"
                dateFormat="yyyy-MM-dd"
                placeholderText="Date From"
                selected={fromDate ? new Date(fromDate) : null}
                onChange={handleDateFromSelect}
                isClearable
                className="w-full px-2.5 py-2 border border-gray-300 rounded-xl"
              />
            </div>

            <div className="w-full md:w-auto mb-1">
              <label
                htmlFor="date-to"
                className="font-semibold text-lg"
              ></label>
              <DatePicker
                id="date-to"
                dateFormat="yyyy-MM-dd"
                placeholderText="Date To"
                selected={toDate ? new Date(toDate) : null}
                onChange={handleDateToSelect}
                isClearable
                className="w-full px-2.5 py-2 border border-gray-300 rounded-xl"
              />
            </div>
          </>
        )}
        {selectedCode === "ACCESSLABEL-CHECKOUT" && (
          <div className="w-full md:w-auto mb-1">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={handleSearchChange}
              className="px-4 py-2 border border-gray-300 rounded-xl"
            />
          </div>
        )}
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

      {selectedCode === "ACCESSLABEL-CHECKOUT" ? (
        <CheckoutReport
          fromDate={fromDate}
          toDate={toDate}
          statusFilter={statusFilter}
          typeFilter={typeFilter}
          search={search}
          checkouts={checkouts}
          clientid={selectedClientId}
        />
      ) : selectedCode === "ACCESSLABEL-SALEINFO" ? (
        data?.data && data.data.length > 0 ? (
          <SalesInfo />
        ) : (
          <div className="text-center text-gray-500 mt-10">
            <p className="text-2xl font-semibold text-error">
              No data available!
            </p>
          </div>
        )
      ) : null}
    </main>
  );
};
export default ReportPage;
