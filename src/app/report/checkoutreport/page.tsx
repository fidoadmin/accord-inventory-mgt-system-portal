"use client";
import React, { useState, useEffect } from "react";
import { useCheckouts } from "../../hooks/checkouts/useCheckouts";
import TableHeader from "@/components/TableHeader";
import CheckoutListCard from "@/components/CheckoutListCard";
import { useCategoryList } from "@/app/hooks/categories/useCategoryList";
import SearchInput from "@/components/SearchBox";
import Loading from "../../loading";
import { getCookie } from "cookies-next";

interface CheckoutReportProps {
  fromDate: string;
  toDate: string;
}

const CheckoutReport: React.FC<CheckoutReportProps> = ({
  fromDate,
  toDate,
}) => {
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    varsearch: "",
    statusfilter: "all",
    fromDate,
    toDate,
  });

  const [sortby, setSortBy] = useState("created");
  const authKey = getCookie("authKey") as string;

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [hasModelName, setHasModelName] = useState<boolean>(false);
  const [hasPartNumber, setHasPartNumber] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const itemsPerPage = 10;
  const itemsCategoryPage = 20;
  const [sortorder, setSortOrder] = useState<"asc" | "desc">("desc");

  const {
    data: checkouts,
    error: checkoutsError,
    isLoading: checkoutsLoading,
  } = useCheckouts({ ...params, sortby, sortorder });
  const {
    data: categoryList,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useCategoryList(authKey || "", {
    page: 1,
    limit: itemsCategoryPage,
  });

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setParams((prev) => ({
      ...prev,
      statusfilter: value,
      onlycancelled: value === "cancelled",
      onlydispatched: value === "dispatched",
    }));
  };

  const category = categoryList?.data || [];

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setHasModelName(categoryId === "specificCategoryID");

    const selectedCategoryData = category.find(
      (category: any) => category.Id === categoryId
    );
    if (selectedCategoryData) {
      setHasModelName(!!selectedCategoryData.HasModelName);
      setHasPartNumber(!!selectedCategoryData.HasPartNumber);
    }
  };

  const handleSortChange = (column: string) => {
    setSortBy(column);
    setSortOrder((prevOrder) => (prevOrder === "desc" ? "asc" : "desc"));
  };

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      fromDate,
      toDate,
    }));
  }, [fromDate, toDate]);

  if (checkoutsLoading || !checkouts) return <Loading />;
  if (checkoutsError) return <p>Error loading checkouts.</p>;

  return (
    <div className="w-full">
      <h1 className=" text-2xl font-semibold mb-6">Checkout Report</h1>

      <div className="flex justify-start space-x-4">
        <label htmlFor="statusFilter" className="mr-2 mt-2 font-bold">
          Filter By Status -
        </label>
        <select
          id="statusFilter"
          value={params.statusfilter}
          onChange={handleFilterChange}
          className="px-4 py-2 rounded-xl border border-gray-300 mb-10"
        >
          <option value="all">All</option>
          <option value="cancelled">Cancelled</option>
          <option value="dispatched">Dispatched</option>
        </select>
      </div>

      <div className="w-fit px-72">
        <div className="p-2 space-y-2">
          <div className="flex items-center md:flex-row gap-4 mt-[-105px]">
            <div className="w-full mt-5 text-sm">
              <SearchInput
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </div>
          </div>
        </div>
      </div>

      {checkouts && checkouts.totalCount > 0 ? (
        <div className="space-y-2">
          <TableHeader
            tableTitle="checkoutList"
            handleSortChange={handleSortChange}
            sortby={sortby}
            sortorder={sortorder}
          />

          {checkouts.data.map((checkoutListItem, index) => (
            <CheckoutListCard key={index} checkoutListItem={checkoutListItem} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No checkouts available.</p>
      )}
    </div>
  );
};

export default CheckoutReport;
