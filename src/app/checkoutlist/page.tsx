"use client";
import React, { useState,useEffect } from "react";
import { useCheckouts } from "../hooks/checkouts/useCheckouts";
import TableHeader from "@/components/TableHeader";
import CheckoutListCard from "@/components/CheckoutListCard";
import Loading from "../loading";
import Pagination from "@/components/Pagination";

const CheckoutList: React.FC = () => {

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const [params, setParams] = useState({
    page: page,
    limit: limit,
    varsearch: "",
    sortby: "created",
    sortorder: "desc",
    isfromreport: false,
  });

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      page: page,
    }));
  }, [page]);

  const [sortby, setSortBy] = useState("created");
  const [sortorder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSortChange = (column: string) => {
    const order = sortby === column && sortorder === "asc" ? "desc" : "asc";
    setSortBy(column);
    setSortOrder(order);
  };

  const {
    data: checkouts,
    error: checkoutsError,
    isLoading: checkoutsLoading,
  } = useCheckouts({ ...params, sortby, sortorder });

  if (checkoutsLoading || !checkouts) return <Loading />;
  if (checkoutsError) return <p>Error loading checkouts.</p>;

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-4">Checkout List</h1>
      {checkouts && checkouts.data.length > 0 ? (
        <div className="space-y-2">
          <TableHeader
            tableTitle="checkoutList"
            handleSortChange={handleSortChange}
            sortby={sortby}
            sortorder={sortorder}
          />
          {checkouts?.data.map((checkoutListItem, index) => (
            <CheckoutListCard key={index} checkoutListItem={checkoutListItem} />
          ))}
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(checkouts?.totalCount / limit)}
            onPageChange={(page) => setPage(page)}
          />
        </div>
      ) : (
        <p className="text-center text-gray-500">No checkouts available.</p>
      )}
    </div>
  );
};

export default CheckoutList;
