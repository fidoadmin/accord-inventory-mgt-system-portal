"use client";

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CheckoutReport from "@/components/CheckoutReport";

const ReturnPage = () => {
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState<string>(""); // Added search state
  const isreturn: boolean = true;

  const formatDate = (date: Date) =>
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    date.getDate().toString().padStart(2, "0");

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

  return (
    <main className="p-4">
      <h1 className="text-2xl font-semibold mb-6">Return</h1>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="w-full md:w-auto">
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-xl"
          >
            <option value="all">All</option>
            <option value="dispatched">Dispatched</option>
            <option value="returned">Returned</option>
          </select>
        </div>

        <div className="w-full md:w-auto">
          <select
            id="typeFilter"
            value={typeFilter}
            onChange={handleTypeFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-xl"
          >
            <option value="all">All</option>
            <option value="branch">Branch</option>
            <option value="external">External</option>
          </select>
        </div>

        <div className="w-full md:w-auto mb-1">
          <label htmlFor="date-from" className="font-semibold text-lg"></label>
          <DatePicker
            id="date-from"
            dateFormat="yyyy-MM-dd"
            placeholderText="Date From"
            selected={fromDate ? new Date(fromDate) : null}
            onChange={handleDateFromSelect}
            isClearable
            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
          />
        </div>

        <div className="w-full md:w-auto mb-1">
          <label htmlFor="date-to" className="font-semibold text-lg"></label>
          <DatePicker
            id="date-to"
            dateFormat="yyyy-MM-dd"
            placeholderText="Date To"
            selected={toDate ? new Date(toDate) : null}
            onChange={handleDateToSelect}
            isClearable
            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
          />
        </div>

        {/* Search input field */}
        <div className="w-full md:w-auto">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={handleSearchChange}
            className="px-4 py-2 border border-gray-300 rounded-xl"
          />
        </div>
      </div>

      <CheckoutReport
        fromDate={fromDate}
        toDate={toDate}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        isreturn={isreturn}
        search={search}
        checkouts={[]}
      />
    </main>
  );
};

export default ReturnPage;
