"use client";
import React, { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import { getCookie } from "cookies-next";
import { DailySalesReport } from "@/types/ReportInterface";
import { useFetchDailySalesReport } from "@/app/hooks/reports/useDailySalesReport";
import { DownloadRounded } from "@mui/icons-material";
import { useDropdownList } from "@/app/hooks/globaldropdown/useGlobalDropdown";

interface DailyReportPageProps {
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

const DailySalesReportPage = ({
  action,
  onDownloadComplete,
}: DailyReportPageProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("categoryname");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [fetchCSV, setFetchCSV] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [roleCode, setRoleCode] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [search, setSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [isClientSelected, setIsClientSelected] = useState(false);

  const authKey = getCookie("authKey") as string;

  const [params, setParams] = useState({
    page: currentPage,
    limit: itemsPerPage,
    sortBy,
    sortOrder,
    search: searchTerm,
  });
  const {
    data: reportData,
    error,
    isLoading,
  } = useFetchDailySalesReport(authKey, {
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
  }, [currentPage, itemsPerPage, sortBy, sortOrder, searchTerm]);

  useEffect(() => {
    if (fetchCSV) {
      setParams((prevParams) => ({
        ...prevParams,
        limit: 0,
        page: 0,
      }));
    }
    const RoleCode = localStorage.getItem("RoleCode");
    setRoleCode(RoleCode);
  }, [fetchCSV]);

  useEffect(() => {
    if (fetchCSV && reportData && params.limit === 0 && reportData.data) {
      const csvContent = convertToCSV(reportData.data);
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "DAILYSTOCK.csv";
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
  }, [fetchCSV, reportData, params.limit, onDownloadComplete]);

  const handleSortChange = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

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
    <>
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
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error loading data.</div>
        ) : (
          <div className="overflow-x-auto border-2 rounded-lg">
            <table className="w-full table-auto">
              <thead className="bg-gray-100">
                <tr className="bg-tablehead border-b-2 text-left">
                  <th className="p-2">SN</th>
                  {roleCode === "USERROLE_SYSTEMADMIN" && (
                    <th className="cursor-pointer p-2">Client</th>
                  )}
                  <th className="cursor-pointer p-2">Category Name </th>
                  <th className="cursor-pointer p-2">Description </th>
                  <th className="cursor-pointer p-2">Creation Date </th>
                  <th className="cursor-pointer p-2">Total Stock </th>
                </tr>
              </thead>
              <tbody>
                {reportData?.data.map(
                  (report: DailySalesReport, index: number) => (
                    <tr key={report.Id} className="hover:bg-gray-50">
                      <td className="p-2 border-b">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      {roleCode === "USERROLE_SYSTEMADMIN" && (
                        <td className="p-2 border-b">{report.ClientName}</td>
                      )}
                      <td className="p-2 border-b">{report.CategoryName}</td>
                      <td className="p-2 border-b">{report.Description}</td>
                      <td className="p-2 border-b">{report.CreationDate}</td>
                      <td className="p-2 border-b">{report.TotalStock}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {(reportData?.data.length ? reportData?.data.length : 0) > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil((reportData?.totalCount || 0) / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
};

export default DailySalesReportPage;
