"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css";

import { useInventoryDescriptionList } from "@/app/hooks/inventorydescriptions/useInventoryDescriptionList";
import { useBranchList } from "@/app/hooks/branches/useBranchList";
import { CheckoutInventoryDescriptionDetailInterface } from "@/types/CheckoutInterface";
import SearchInput from "./SearchBox";

import { CheckoutListInterface } from "@/types/CheckoutInterface";
import BranchCheckoutListOverlay from "./BranchTransferListOverlay";
import React from "react";
import { useDropdownList } from "@/app/hooks/globaldropdown/useGlobalDropdown";
import { getCookie } from "cookies-next";

export default function Checkout() {
  const authKey = getCookie("authKey") as string;

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 15;
  const [company, setCompany] = useState<{ name?: string; id?: string }>({});
  const [branch, setBranch] = useState<{ name?: string; id?: string }>({});
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<
    CheckoutInventoryDescriptionDetailInterface[]
  >([]);

  const [
    checkoutInventoryDescriptionList,
    setSelectedInventoryDescriptionList,
  ] = useState<CheckoutListInterface[]>([]);
  const [isCheckoutListVisible, setIsCheckoutListVisible] = useState(false);

  const params = {
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    isCheckout: true,
    isFromDispatch: false,
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
    setTotalPages(Math.ceil(totalCount / itemsPerPage));
  }, [totalCount, itemsPerPage]);

  const {
    data: branchData,
    error: branchError,
    isLoading: branchLoading,
  } = useDropdownList("branches", search, filters);

  useEffect(() => {
    if (searchTerm.length > 0 && inventoryDescriptionList.length > 0) {
      setResult(inventoryDescriptionList);
    } else {
      setResult([]);
    }
  }, [inventoryDescriptionList, searchTerm]);
  const getAvailableOptions = () => {
    const filteredBranchList =
      branchData?.filter(
        (remainingBranch) => branch.id !== remainingBranch.Id
      ) ?? [];

    return filteredBranchList;
  };

  const handleListOverlayState = () => {
    setIsCheckoutListVisible(!isCheckoutListVisible);
  };

  const handleAddOverlayState = (
    inventoryDescription?: CheckoutInventoryDescriptionDetailInterface
  ) => {
    if (inventoryDescription) {
      const exists = checkoutInventoryDescriptionList.find(
        (item) =>
          item.Id === inventoryDescription.Id &&
          item.CompanyId === inventoryDescription.CompanyId &&
          item.BranchId === inventoryDescription.BranchId &&
          item.ContainerId === inventoryDescription.ContainerId
      );

      if (exists) {
        const updatedList = checkoutInventoryDescriptionList.filter(
          (item) =>
            item.Id !== inventoryDescription.Id ||
            item.CompanyId !== inventoryDescription.CompanyId ||
            item.BranchId !== inventoryDescription.BranchId ||
            item.ContainerId !== inventoryDescription.ContainerId
        );
        setSelectedInventoryDescriptionList(updatedList);
        toast.warn(
          `${
            inventoryDescription.ShortName
              ? inventoryDescription.ShortName
              : inventoryDescription.Description
          } removed from the list`
        );
      } else {
        if (
          checkoutInventoryDescriptionList.length > 0 &&
          (checkoutInventoryDescriptionList[0].CompanyId !==
            inventoryDescription.CompanyId ||
            checkoutInventoryDescriptionList[0].BranchId !==
              inventoryDescription.BranchId)
        ) {
          toast.error("Selected items must have the same company and branch.");
          return;
        }

        setSelectedInventoryDescriptionList((prevList) => [
          ...prevList,
          {
            Id: inventoryDescription.Id,
            ShortName: inventoryDescription.ShortName,
            CompanyId: inventoryDescription.CompanyId,
            ContainerId: inventoryDescription.ContainerId,

            BranchId: inventoryDescription.BranchId,
            BranchName: inventoryDescription.BranchName,
            Quantity: undefined,
            SpecificExpiryDate: "",
            IsPrecheckInRequest: false,
            IsFoc: false,
            FocQuantity: undefined,
            AvailableQuantity: inventoryDescription.AvailableQty,
            PackSize: inventoryDescription.PackSize,
          } as CheckoutListInterface,
        ]);
        toast.success(
          `${
            inventoryDescription.ShortName
              ? inventoryDescription.ShortName
              : inventoryDescription.Description
          } added to the list`
        );
      }
    }
  };

  const handleListUpdate = (updatedList: CheckoutListInterface[]) => {
    setSelectedInventoryDescriptionList(updatedList);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="py-4 rounded-bl-3xl rounded-tr-3xl">
        <h1 className="font-bold text-2xl">Branch Transfer</h1>
        <div className="checkout-container flex justify-between rounded-xl p-4">
          <div className="searchSort flex flex-col md:flex-row justify-between items-center md:items-end">
            <SearchInput
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>

          <div className="flex items-center justify-between my-4">
            <button
              disabled={checkoutInventoryDescriptionList.length === 0}
              className={`text-white rounded-xl px-4 py-2 disabled:bg-transparent disabled:border disabled:border-success disabled:text-success disabled:opacity-60 bg-success hover:opacity-80`}
              onClick={handleListOverlayState}
            >
              Show items in current checkout
            </button>
          </div>
        </div>
        <div className="relative border-2 rounded-lg overflow-hidden">
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr className="border-b-2">
                <th className="p-2"></th>
                <th className="p-2">Short Name</th>
                <th className="p-2">Description</th>
                <th className="p-2">Company Name</th>
                <th className="p-2">Branch Name</th>
                <th className="p-2">Available Qty</th>
              </tr>
            </thead>
            <tbody>
              {result.map((item) => (
                <tr className="border-b">
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      onChange={() => handleAddOverlayState(item)}
                      checked={
                        checkoutInventoryDescriptionList.findIndex(
                          (selectedItem) =>
                            selectedItem.Id === item.Id &&
                            selectedItem.CompanyId === item.CompanyId &&
                            selectedItem.BranchId === item.BranchId &&
                            selectedItem.ContainerId === item.ContainerId
                        ) !== -1
                      }
                    />
                  </td>
                  <td className="p-2 text-center">{item.ShortName}</td>
                  <td className="p-2 text-center">{item.Description}</td>
                  <td className="p-2 text-center">{item.PackSize}</td>

                  <td className="p-2 text-center truncate">
                    {item.CompanyName}
                  </td>
                  <td className="p-2 text-center">{item.BranchName}</td>
                  <td className="p-2 text-center">{item.AvailableQty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 w-fit">
          <h2 className="text-lg font-semibold">
            Selected Item Count: {checkoutInventoryDescriptionList.length}
          </h2>
        </div>
      </div>
      {isCheckoutListVisible && (
        <BranchCheckoutListOverlay
          onOverlayClose={handleListOverlayState}
          checkoutList={checkoutInventoryDescriptionList}
          branchList={getAvailableOptions()}
          onUpdateCheckoutList={handleListUpdate}
        />
      )}
    </div>
  );
}
