"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { useCompanyList } from "@/app/hooks/companies/useCompanyList";
import { useInventoryDescriptionList } from "@/app/hooks/inventorydescriptions/useInventoryDescriptionList";
import { CheckoutInventoryDescriptionDetailInterface } from "@/types/CheckoutInterface";
import SearchInput from "./SearchBox";
import CheckoutListOverlay from "./CheckoutListOverlay";
import { CheckoutListInterface } from "@/types/CheckoutInterface";
import React from "react";
import Pagination from "./Pagination";
import { getCookie } from "cookies-next";
export default function Checkout() {
  const authKey = getCookie("authKey") as string;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [company, setCompany] = useState<{ name?: string; id?: string }>({});
  const [result, setResult] = useState<
    CheckoutInventoryDescriptionDetailInterface[]
  >([]);
  const [
    checkoutInventoryDescriptionList,
    setSelectedInventoryDescriptionList,
  ] = useState<CheckoutListInterface[]>([]);
  const [isCheckoutListVisible, setIsCheckoutListVisible] = useState(false);
  const [totalPages, setTotalPages] = useState<number>(1);

  const params = {
    page: page,
    limit: limit,
    search: searchTerm,
    isCheckout: true,
    isFromDispatch: false,
  };

  const {
    data,
    error: inventoryDescriptionError,
    isLoading: inventoryDesriptionLoading,
  } = useInventoryDescriptionList(authKey || "", params);
  const {
    data: InternalCompanyData,
    error: CompanyError,
    isLoading: CompanyLoading,
  } = useCompanyList(authKey || "", { page, limit, isinternal: "true" });

  const inventoryDescriptionList = data?.data || [];
  const totalCount = data?.totalCount || 0;

  useEffect(() => {
    if (searchTerm.length > 0 && inventoryDescriptionList.length > 0) {
      setResult(inventoryDescriptionList);
    } else {
      setResult([]);
    }
  }, [inventoryDescriptionList, searchTerm]);

  const getAvailableOptions = () => {
    return (
      InternalCompanyData?.data.filter(
        (remainingCompanies) => company.id !== remainingCompanies.Id
      ) ?? []
    );
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
            BranchId: inventoryDescription.BranchId,
            ContainerId: inventoryDescription.ContainerId,
            BranchName: inventoryDescription.BranchName,
            PackSize: inventoryDescription.PackSize,
            Description: inventoryDescription.Description,
            Quantity: undefined,
            SpecificExpiryDate: "",
            IsPrecheckInRequest: false,
            IsFoc: false,
            FocQuantity: undefined,
            AvailableQuantity: inventoryDescription.AvailableQty,
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
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  return (
    <div className="container mx-auto p-4">
      <div className="py-4 rounded-bl-3xl rounded-tr-3xl">
        <h1 className="font-bold text-2xl">Sales Checkout</h1>
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
                <th className="p-2">Pack Size</th>
                <th className="p-2">Company Name</th>
                <th className="p-2">Branch Name</th>
                <th className="p-2">Available Qty</th>
              </tr>
            </thead>
            <tbody>
              {result.length > 0 &&
                result.map((mappeditem) => (
                  <tr className="border-b">
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        onChange={() => handleAddOverlayState(mappeditem)}
                        checked={checkoutInventoryDescriptionList.some(
                          (selectedItem) =>
                            selectedItem.Id === mappeditem.Id &&
                            selectedItem.CompanyId === mappeditem.CompanyId &&
                            selectedItem.BranchId === mappeditem.BranchId &&
                            selectedItem.ContainerId === mappeditem.ContainerId
                        )}
                      />
                    </td>
                    <td className=" text-center w-1/6 break-words">
                      {mappeditem.ShortName}
                    </td>
                    <td
                      className="text-center w-1/6"
                      style={{
                        overflowWrap: "break-word",
                        wordBreak: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {mappeditem.Description}
                    </td>{" "}
                    <td className=" text-center w-1/6 break-words">
                      {mappeditem.PackSize}
                    </td>
                    <td className=" text-center w-1/6 break-words">
                      {mappeditem.CompanyName}
                    </td>
                    <td className=" text-center w-1/6 break-words">
                      {mappeditem.BranchName}
                    </td>
                    <td className=" text-center w-1/6 break-words">
                      {mappeditem.AvailableQty}
                    </td>
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
        <CheckoutListOverlay
          onOverlayClose={handleListOverlayState}
          checkoutList={checkoutInventoryDescriptionList}
          transfereeList={getAvailableOptions()}
          onUpdateCheckoutList={handleListUpdate}
        />
      )}

      {searchTerm.length > 0 && totalCount && (
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(totalCount / limit)}
          onPageChange={(page) => setPage(page)}
        />
      )}
    </div>
  );
}
