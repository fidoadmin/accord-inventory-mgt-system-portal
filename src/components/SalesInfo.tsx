import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import Link from "next/link";
import logoImg from "/public/assets/images/Logo/fidoButtonNoBG.png";
import Pagination from "./Pagination";
import { useFetchSalesInfo } from "@/app/hooks/salesinfo/useSalesInfo";
  
const SalesInfo = ({}) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState<string>("modified");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [roleCode, setRoleCode] = useState<string | null>(null);

  const authKey = getCookie("authKey") as string;
  const itemsPerPage = 10;
  const { data, error, isLoading } = useFetchSalesInfo(authKey, {
    page,
    limit,
    sortBy,
    sortOrder,
  });
  useEffect(() => {
    const RoleCode = localStorage.getItem("RoleCode");
    setRoleCode(RoleCode);
  }, []);

  const handleDetailsClick = (checkoutNumber: string, index?: number) => {
    let Url = "";
    Url = `/checkout/${checkoutNumber}/challan?page=${index}&onlySaleChallan=true`;
    return Url;
  };

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full  border-collapse border-2">
        <thead>
          <tr className="bg-tablehead text-sm font-semibold">
            <th className="p-2 border">SN</th>
            {roleCode === "USERROLE_SYSTEMADMIN" && (
              <th className="cursor-pointer py-2 px-3 ">
                Client
                {sortBy === "client" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
            )}
            <th className="p-2 border cursor-pointer">
              Challan Number{" "}
              {sortBy === "challan_number" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-2 border cursor-pointer">
              Challan Date{" "}
              {sortBy === "challan_date" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-2 border cursor-pointer">
              Invoice Number{" "}
              {sortBy === "invoice_number" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-2 border cursor-pointer">
              Invoice Date{" "}
              {sortBy === "invoice_date" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-2 border cursor-pointer">
              Amount{" "}
              {sortBy === "invoice_amount" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-2 border cursor-pointer">
              Seller Company{" "}
              {sortBy === "seller_company" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-2 border cursor-pointer">
              Customer{" "}
              {sortBy === "customer" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>

            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.length ? (
            data.data.map((sale, index) => (
              <tr key={index} className="hover:bg-gray-50 text-center">
                <td className="p-0.5 border">
                  {(page - 1) * limit + index + 1}
                </td>
                {roleCode === "USERROLE_SYSTEMADMIN" && (
                  <td className="p-0.5 border">{sale.ClientName}</td>
                )}
                <td className="p-0.5 border">{sale.ChallanNumber}</td>
                <td className="p-0.5 border">{sale.ChallanDate}</td>
                <td className="p-0.5 border">{sale.InvoiceNumber}</td>
                <td className="p-0.5 border">{sale.InvoiceDate}</td>
                <td className="p-0.5 border">{sale.Amount}</td>
                <td className="p-0.5 border">{sale.SellerCompany}</td>
                <td className="p-0.5 border">{sale.CustomerName}</td>

                <td className="p-0.5 border">
                  <Link
                    href={handleDetailsClick(sale?.CheckoutNumber, index + 1)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="flex justify-center items-center">
                      <Image
                        src={logoImg}
                        alt="Button"
                        width={15}
                        height={15}
                        className="h-auto w-auto"
                        title="button"
                        priority
                      />
                    </div>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="p-3 text-center text-error">
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {(data?.data.length ? data?.data.length : 0) > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil((data?.totalCount || 0) / itemsPerPage)}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default SalesInfo;
