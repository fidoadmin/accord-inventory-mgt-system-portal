"use client";

import { useState, useEffect } from "react";

import { useInventoryDescriptionList } from "../hooks/inventorydescriptions/useInventoryDescriptionList";
import SearchInput from "@/components/SearchBox";
import Pagination from "@/components/Pagination";
import Loading from "../loading";
import DescriptionCard from "@/components/DescriptionCard";
import TableHeader from "@/components/TableHeader";
import { useInventory } from "../hooks/inventories/useInventory";
import SectionHeader from "@/components/SectionHeader";
import { FaxRounded } from "@mui/icons-material";
import { getCookie } from "cookies-next";

export default function Inventory() {
  const [authKey, setAuthKey] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 15;

  const { data: inventoryData, error, isLoading } = useInventory(authKey || "");

  useEffect(() => {
    const authKey = getCookie("authKey") as string;

    setAuthKey(authKey);
  }, []);

  const params = {
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
  };

  const {
    data,
    error: inventoryError,
    isLoading: inventoryLoading,
  } = useInventoryDescriptionList(authKey || "", params);

  const { data: inventoryDescriptionList, totalCount } = data || {
    data: [],
    totalCount: 0,
  };

  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil(totalCount / itemsPerPage)
  );

  useEffect(() => {
    if (inventoryDescriptionList && inventoryDescriptionList.length > 0) {
      setTotalPages(Math.ceil(totalCount / itemsPerPage));
    }
  }, [inventoryDescriptionList, totalCount]);

  if (inventoryLoading) return <Loading />;
  if (inventoryError) return <div>Error: {inventoryError.message}</div>;

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 items-center mt-4">
        <div className="w-full md:w-auto">
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
      </div>

      <div className="inventorySection">
        {!searchTerm &&
          inventoryData?.map((category, index) =>
            category.CategoryName ? (
              <div className="mb-4 flex flex-col gap-4" key={index}>
                <SectionHeader
                  title={`${category.CategoryName} Inventory`}
                  button
                  buttonClass={`bg-primary text-white hover:opacity-90`}
                  buttonText={`View ${category.CategoryName} Inventory`}
                  buttonIcon={FaxRounded}
                  buttonHref={
                    category.CategoryName.toLowerCase() !== "all"
                      ? `/inventory/${category.CategoryId}`
                      : `/inventory/${category.CategoryName.toLowerCase()}`
                  }
                />
                {category.DescriptionList?.length ? (
                  <ul className="space-y-1">
                    {category.CategoryName.toLowerCase() !== "all" ? (
                      <TableHeader
                        tableTitle="Description"
                        dataTitle="inventory"
                      />
                    ) : (
                      <TableHeader tableTitle="Description" />
                    )}
                    {category.DescriptionList?.map((item) =>
                      category.CategoryName.toLowerCase() !== "all" ? (
                        <DescriptionCard
                          key={item.Id}
                          description={item}
                          title="inventory"
                        />
                      ) : (
                        <DescriptionCard key={item.Id} description={item} />
                      )
                    )}
                  </ul>
                ) : (
                  <h1 className="text-error font-bold">
                    No Inventory for {category.CategoryName}
                  </h1>
                )}
              </div>
            ) : null
          )}

        {!!searchTerm.length && !!inventoryDescriptionList?.length ? (
          <>
            <ul className="flex flex-col gap-1 mb-4">
              <TableHeader tableTitle="Description" />
              {inventoryDescriptionList?.map((inventory) => (
                <DescriptionCard key={inventory.Id} description={inventory} />
              ))}
            </ul>

            {/* Pagination controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        ) : (
          !inventoryDescriptionList?.length && (
            <h1 className="text-error font-bold text-center">
              Could not find the inventory you are looking for!
            </h1>
          )
        )}
      </div>
    </>
  );
}
