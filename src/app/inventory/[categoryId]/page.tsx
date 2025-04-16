"use client";

import { useState, useEffect } from "react";

import TableHeader from "@/components/TableHeader";
import DescriptionCard from "@/components/DescriptionCard";
import { useInventoryDescriptionList } from "@/app/hooks/inventorydescriptions/useInventoryDescriptionList";
import SearchInput from "@/components/SearchBox";
import Loading from "@/app/loading";
import { InventoryDescriptionInterface } from "@/types/InventoryInterface";
import { useCategoryList } from "@/app/hooks/categories/useCategoryList";
import Pagination from "@/components/Pagination";
import React from "react";
import { getCookie } from "cookies-next";

export default function CategoryDetail(context: any) {
  const { params } = context;
  const categoryId = params.categoryId as string;
  const [result, setResult] = useState<InventoryDescriptionInterface[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 15;
  const [searchTerm, setSearchTerm] = useState<string>("");
  const authKey = getCookie("authKey") as string;

  const { data: categoryData } = useCategoryList(authKey, {
    page: 0,
    limit: 0,
  });
  const pageTitle = categoryData?.data.filter(
    (category) => category.Id === categoryId
  )[0].Name;

  const hasModelName = categoryData?.data.filter(
    (category) => category.Id === categoryId
  )[0].HasModelName;
  const hasPartNumber = categoryData?.data.filter(
    (category) => category.Id === categoryId
  )[0].HasPartNumber;

  const {
    data,
    error: inventoryError,
    isLoading: inventoryLoading,
  } = useInventoryDescriptionList(authKey || "", {
    categoryId: categoryId,
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
  });
  const { data: inventoryDescriptionList, totalCount } = data || {
    data: [],
    totalCount: 0,
  };
  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil(totalCount / itemsPerPage)
  );
  useEffect(() => {
    if (inventoryDescriptionList && inventoryDescriptionList.length > 0) {
      // Update the total pages based on response
      setTotalPages(Math.ceil(totalCount / itemsPerPage));
    }
  }, [inventoryDescriptionList, totalCount]);

  useEffect(() => {
    const filteredData = inventoryDescriptionList?.filter((category) =>
      category.Description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setResult(filteredData ? filteredData : []);
  }, [searchTerm, inventoryDescriptionList]);

  if (inventoryError) return <div>Error: {inventoryError?.message}</div>;

  if (inventoryLoading || !data) return <Loading />;

  return (
    <div className="inventoryList flex flex-col gap-4">
      <h1 className="text-text font-bold text-xl">{pageTitle} Inventory</h1>
      <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <>
        {result.length ? (
          <TableHeader
            tableTitle="Description"
            dataTitle="inventory"
            hasModelName={hasModelName}
            hasPartNumber={hasPartNumber}
          />
        ) : (
          !searchTerm.length && (
            <div>
              <h1 className="text-error text-xl text-center">
                No inventory found for
                <span className="font-bold"> {pageTitle}</span>
              </h1>
            </div>
          )
        )}
        {result.length ? (
          <>
            <ul className="flex flex-col gap-1">
              {result?.map((inventory) => (
                <DescriptionCard
                  key={inventory.Id}
                  description={inventory}
                  title="inventory"
                  hasModelName={hasModelName}
                  hasPartNumber={hasPartNumber}
                />
              ))}
            </ul>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        ) : (
          !!searchTerm.length && (
            <p className="text-error font-bold text-center">
              Could not find the inventory you are looking for!
            </p>
          )
        )}
      </>
    </div>
  );
}
