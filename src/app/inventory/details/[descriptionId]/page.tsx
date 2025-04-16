"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { KeyboardArrowLeftRounded } from "@mui/icons-material";
import { useInventoryList } from "@/app/hooks/inventories/useInventoryList";
import InventoryCard from "@/components/InventoryCard";
import TableHeader from "@/components/TableHeader";
import Link from "next/link";
import Loading from "@/app/loading";
import Pagination from "@/components/Pagination";
import { getCookie } from "cookies-next";

const DescriptionDetail = ({
  params,
}: {
  params: { descriptionId: string };
}) => {
  const authKey = getCookie("authKey") as string;

  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [queryParams, setQueryParams] = useState<{
    sortby: string;
    sortorder: "asc" | "desc";
    page: number;
    limit: number;
  }>({
    sortby: "created",
    sortorder: "desc",
    page: page,
    limit: limit,
  });

  const { data, error, isLoading } = useInventoryList(
    authKey,
    params.descriptionId,
    queryParams
  );

  const handleSortChange = (column: string) => {
    setQueryParams((prev) => ({
      ...prev,
      sortby: column,
      sortorder: prev.sortorder === "desc" ? "asc" : "desc",
    }));
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setQueryParams((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  useEffect(() => {
    if (data && (!data.data || data.data.length === 0)) {
      router.push(`/report/inventory`);
    }
  }, [data, router]);

  if (isLoading || !data) {
    return <Loading />;
  }
  if (error) return <div>Error: {error.message}</div>;

  const hasInventory = data.data && data.data.length > 0;

  return (
    <div className="">
      <div className="topSection w-full sticky top-0 bg-background">
        <div className="backBtn px-4 mx-auto">
          <button
            type="button"
            onClick={() => router.push(`/report/inventory`)}
          >
            <KeyboardArrowLeftRounded />
          </button>
        </div>
        <div className="w-full flex justify-around items-center px-4 mt-2">
          <p className="text-left mt-2">
            <span className="font-bold">Manufacturer Name:</span>{" "}
            {data.data[0]?.ManufacturerName}
          </p>
          <p className="text-left mt-2">
            <span className="font-bold">Description:</span>{" "}
            {data.data[0]?.Description}
          </p>
          <p className="text-left mt-2">
            <span className="font-bold">Short Name:</span>{" "}
            {data.data[0]?.ShortName}
          </p>
        </div>
        <hr className="mt-11 pb-10 border-black" />
      </div>
      {hasInventory ? (
        <div className="inventoryList pb-4 space-y-1">
          <TableHeader
            tableTitle="Inventory"
            handleSortChange={handleSortChange}
            sortby={queryParams.sortby}
            sortorder={queryParams.sortorder}
          />
          {data?.data.map((inventory) => (
            <ul key={inventory.Id}>
              <InventoryCard
                inventory={inventory}
                descriptionId={params.descriptionId}
              />
            </ul>
          ))}
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(data?.totalCount / limit)}
            onPageChange={(page) => handlePageChange(page)}
          />
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-error">No inventory found</h1>
          <h2 className="text-text">
            Would you like to{" "}
            <Link
              href="/check-in"
              className="text-success hover:text-successAccent"
            >
              check-in
            </Link>
            ?
          </h2>
        </div>
      )}
    </div>
  );
};

export default DescriptionDetail;
