"use client";
import Pagination from "@/components/Pagination";
import React, { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { InvoiceNullReport } from "@/types/ReportInterface";
import { useInvoiceNullReport } from "@/app/hooks/reports/useInvoiceNullReport";
import { DownloadRounded } from "@mui/icons-material";
import { useDropdownList } from "@/app/hooks/globaldropdown/useGlobalDropdown";

interface InvoiceReportPageProps {
  action: string;
  onDownloadComplete: () => void;
}

function convertToCSV(data: any[]): string {
  if (!data || data.length === 0) return "";
  const headers = Object.keys(data[0]);
  const csvRows = [];
  csvRows.push(headers.join(","));
  data.forEach((row) => {
    const values = headers.map((header) => {
      let val = row[header];
      if (val === null || val === undefined) {
        val = "";
      }
      val = String(val).replace(/"/g, '""');
      if (val.search(/("|,|\n)/g) >= 0) {
        val = `"${val}"`;
      }
      return val;
    });
    csvRows.push(values.join(","));
  });
  return csvRows.join("\n");
}

const InvoiceNullReportPage = ({
  action,
  onDownloadComplete,
}: InvoiceReportPageProps) => {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortBy, setSortBy] = useState<string>("salechallannumber");
  const [searchTerm, setSearchTerm] = useState("");
  const [fetchCSV, setFetchCSV] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [roleCode, setRoleCode] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [search, setSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [isClientSelected, setIsClientSelected] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const authKey = getCookie("authKey") as string;

  const [params, setParams] = useState({
    page: currentPage,
    limit: itemsPerPage,
    sortBy,
    sortOrder,
    search: searchTerm,
  });

  const { data, error, isLoading } = useInvoiceNullReport(authKey, {
    ...params,
    clientid: selectedClientId || undefined,
  });

  const { data: client } = useDropdownList("clients", search, filters);

  useEffect(() => {
    setParams({
      page: currentPage,
      limit: itemsPerPage,
      sortBy,
      sortOrder,
      search: searchTerm,
    });
    const RoleCode = localStorage.getItem("RoleCode");
    setRoleCode(RoleCode);
  }, [currentPage, itemsPerPage, sortBy, sortOrder, searchTerm]);

  useEffect(() => {
    if (fetchCSV) {
      setParams((prevParams) => ({
        ...prevParams,
        limit: 0,
        page: 0,
      }));
    }
  }, [fetchCSV]);

  useEffect(() => {
    if (fetchCSV && data && params.limit === 0 && data.data) {
      const csvContent = convertToCSV(data.data);
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "INVOICENULL.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setFetchCSV(false);
      setItemsPerPage(5);
      if (typeof onDownloadComplete === "function") {
        onDownloadComplete();
      }
    }
  }, [fetchCSV, data, params.limit, onDownloadComplete]);

  const handleExportCSV = () => {
    setItemsPerPage(0);
    setFetchCSV(true);
  };
  const handleSelectClient = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedClientId(selectedValue);

    setIsClientSelected(selectedValue !== "");
  };

  return (
    <div className="w-full px-4 mt-4">
      <div className="flex items-center gap-4 mt-[-56px] pl-44">
        {roleCode === "USERROLE_SYSTEMADMIN" && (
          <select
            className="border border-gray-300 px-4 py-2 rounded-xl w-64"
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
      </div>
      <div className="mb-4 flex justify-end gap-4">
        <button
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700"
          onClick={handleExportCSV}
        >
          <DownloadRounded /> Export
        </button>
      </div>
      <div className="table-container overflow-x-auto">
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-error">Error loading data: {error.message}</div>
        ) : (
          <table className="table-auto w-full border-collapse border-2">
            <thead className="bg-gray-100">
              <tr className="bg-tablehead border-b-2 text-left">
                <th className="p-2">SN</th>
                {roleCode === "USERROLE_SYSTEMADMIN" && (
                  <th className="cursor-pointer p-2">Client</th>
                )}
                <th className="cursor-pointer p-2">Challan No</th>
                <th className="cursor-pointer p-2">Seller Company</th>
                <th className="cursor-pointer p-2">Challan Date</th>
                <th className="cursor-pointer p-2">Customer Name</th>
                <th className="cursor-pointer p-2">Product</th>
                <th className="cursor-pointer p-2">Category Name</th>
                <th className="cursor-pointer p-2">Invoice Number</th>
                <th className="cursor-pointer p-2">Sales Person</th>
                <th className="cursor-pointer p-2">Mobile Number</th>
                <th className="cursor-pointer p-2">EmailAddress</th>
                <th className="cursor-pointer p-2">Bill Pending Days</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.length ? (
                data.data.map((item: InvoiceNullReport, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-2 border-b">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    {roleCode === "USERROLE_SYSTEMADMIN" && (
                      <td className="p-2 border-b">{item.ClientName}</td>
                    )}
                    <td className="p-2 border-b">{item.ChallanNumber}</td>
                    <td className="p-2 border-b">{item.SellerCompany}</td>
                    <td className="p-2 border-b">{item.ChallanDate}</td>
                    <td className="p-2 border-b">{item.CustomerName}</td>
                    <td className="p-2 border-b">{item.Product}</td>
                    <td className="p-2 border-b">{item.CategoryName}</td>
                    <td className="p-2 border-b">
                      {item.InvoiceNumber || "NA"}
                    </td>
                    <td className="p-2 border-b">{item.Name}</td>
                    <td className="p-2 border-b">{item.MobileNumber}</td>
                    <td className="p-2 border-b">{item.EmailAddress}</td>
                    <td className="p-2 border-b">
                      {item.BillPendingDays || 0}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="p-1 text-center text-error">
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      {(data?.data.length ? data?.data.length : 0) > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil((data?.totalCount || 0) / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default InvoiceNullReportPage;
