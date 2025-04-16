"use client";
import { CancelRounded, SaveRounded, EditRounded } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { getCookie } from "cookies-next";

import Pagination from "@/components/Pagination";
import { useAddOrUpdateInventoryPrice } from "../hooks/price/usePriceAddOrUpdate";
import { usePriceList } from "../hooks/price/usePriceList";
import { AddOrUpdateInventoryPrice, InventoryPrice } from "@/types/PriceInterface";
import { toast } from "react-toastify";

function PriceComponent() {
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<AddOrUpdateInventoryPrice>();
  const [sortBy, setSortBy] = useState<string>("modified");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const authKey = getCookie("authKey") as string;
  const { mutate: addOrUpdatePrice } = useAddOrUpdateInventoryPrice();

  const [priceData, setPriceData] = useState<InventoryPrice[]>([]);
  const [isSearchClicked, setIsSearchClicked] = useState(false);

  const {
    data: priceList,
    isLoading,
    error,
  } = usePriceList(authKey, {
    page: currentPage,
    limit: itemsPerPage,
    search: isSearchClicked ? searchTerm : undefined,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (priceList?.data) {
      setPriceData(
        priceList.data.map((item) => ({
          ...item,
          isEditing: false,
        }))
      );
    } else {
      setPriceData([]);
    }
  }, [priceList]);

  useEffect(() => {
    if (searchTerm === null || searchTerm === "") {
      setIsSearchClicked(false);
    }
  }, [searchTerm]);

  if (!mounted) return null;
  if (isLoading) return <p>Loading prices...</p>;
  if (error) return <p>Error fetching prices</p>;

  const handleEdit = (id: string) => {
    const itemToEdit = priceData.find((item) => item.Id === id);
    if (itemToEdit) {
      setEditedValues({
        Description: itemToEdit.Description,
        BatchNumber: itemToEdit.BatchNumber,
        ExpirationDate: itemToEdit.ExpirationDate,
        LCNumber: itemToEdit.LCNumber,
        InvoiceNumber: itemToEdit.InvoiceNumber,
        TTNumber: itemToEdit.TTNumber,
        Amount: itemToEdit.Amount,
      });
    }

    setPriceData((prevData) =>
      prevData.map((item) =>
        item.Id === id ? { ...item, isEditing: true } : item
      )
    );
    setEditingItem(id);
  };

  const handleSave = async (id: string) => {
    if (editedValues) {
      const payload: AddOrUpdateInventoryPrice = {
        Id: id,
        Description: editedValues.Description,
        BatchNumber: editedValues.BatchNumber,
        ExpirationDate: editedValues.ExpirationDate,
        LCNumber: editedValues.LCNumber,
        InvoiceNumber: editedValues.InvoiceNumber,
        TTNumber: editedValues.TTNumber,
        Amount: editedValues.Amount,
      };

      toast.info(
        <div>
          <p className="text-lg font-semibold">
            Are you sure you want to submit these changes?
          </p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={async () => {
                try {
                  await addOrUpdatePrice(payload);
                  setPriceData((prevData) =>
                    prevData.map((item) =>
                      item.Id === id ? { ...item, isEditing: false } : item
                    )
                  );
                  setEditingItem(null);
                  toast.dismiss();
                } catch (error) {
                  toast.error("Failed to save changes.");
                }
              }}
              className="bg-success hover:opacity-60 py-1 px-3 text-white rounded-xl"
            >
              Yes
            </button>
            <button
              onClick={() => toast.dismiss()}
              className="bg-error hover:opacity-60 py-1 px-3 text-white rounded-xl"
            >
              No
            </button>
          </div>
        </div>,
        {
          autoClose: false,
          closeOnClick: false,
        }
      );
    }
  };

  const handleCancel = (id: string) => {
    setPriceData((prevData) =>
      prevData.map((item) =>
        item.Id === id ? { ...item, isEditing: false } : item
      )
    );
    setEditingItem(null);
  };

  const handleSortChange = (column: string) => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortBy(column);
    setSortOrder(newSortOrder);
  };

  const filteredData = priceData.filter((item) =>
    Object.values(item).some(
      (value) =>
        value != null &&
        value.toString().toLowerCase().includes(searchTerm?.toLowerCase())
    )
  );

  const handleSearchClick = () => {
    setIsSearchClicked(true);
  };
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <>
      <div className="w-full px-8 mt-4">
        <h1 className="mb-4 text-2xl font-bold">Price</h1>
        <div className="flex justify-start mb-4">
          <input
            type="text"
            className="border p-2 rounded-xl w-96 border-tablehead"
            placeholder="Enter LC Number/ TT Number/ Invoice Number"
            value={searchTerm || ""}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="ml-4 p-2 bg-success text-white rounded-xl w-20"
            onClick={handleSearchClick}
          >
            Search
          </button>
          <button
            className="ml-4 p-2 bg-error text-white rounded-xl w-20"
            onClick={handleClearSearch}
          >
            Clear All
          </button>
        </div>

        {isSearchClicked && filteredData.length === 0 && (
          <p className="text-center text-error">No results found</p>
        )}
        {searchTerm && filteredData.length > 0 && (
          <div className="relative w-full mt-4">
            <div className="overflow-x-auto border-2 rounded-lg">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-tablehead border-b-2 text-left">
                    <th
                      className="cursor-pointer text-left border-b py-3 px-5 text-sm"
                      onClick={() => handleSortChange("InventoryDescription")}
                    >
                      Inventory Description
                      {sortBy === "InventoryDescription" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="cursor-pointer text-left border-b py-3 px-5 text-sm"
                      onClick={() => handleSortChange("BatchNumber")}
                    >
                      Batch Number
                      {sortBy === "BatchNumber" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="cursor-pointer text-left border-b py-3 px-5 text-sm"
                      onClick={() => handleSortChange("ExpiryDate")}
                    >
                      Expiry Date
                      {sortBy === "ExpiryDate" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="cursor-pointer text-left border-b py-3 px-5 text-sm"
                      onClick={() => handleSortChange("LCNumber")}
                    >
                      LC Number
                      {sortBy === "LCNumber" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="cursor-pointer text-left border-b py-3 px-5 text-sm"
                      onClick={() => handleSortChange("InvoiceNumber")}
                    >
                      Invoice Number
                      {sortBy === "InvoiceNumber" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="cursor-pointer text-left border-b py-3 px-5 text-sm"
                      onClick={() => handleSortChange("TTNumber")}
                    >
                      TT Number
                      {sortBy === "TTNumber" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="cursor-pointer text-left border-b py-3 px-5 text-sm"
                      onClick={() => handleSortChange("Amount")}
                    >
                      Amount
                      {sortBy === "Amount" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="cursor-pointer py-3 px-5"
                      onClick={() => handleSortChange("created")}
                    >
                      Created{" "}
                      {sortBy === "created" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="cursor-pointer py-3 px-5"
                      onClick={() => handleSortChange("modified")}
                    >
                      Modified{" "}
                      {sortBy === "modified" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="py-3 px-5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item.Id} className="border-b hover:bg-gray-100">
                      <td className="py-3 px-5">{item.Description}</td>

                      <td className="py-3 px-5">{item.BatchNumber}</td>

                      <td className="py-3 px-5">{item.ExpirationDate}</td>

                      <td className="py-3 px-5">{item.LCNumber}</td>

                      <td className="py-3 px-5">{item.InvoiceNumber}</td>

                      <td className="py-3 px-5">{item.TTNumber}</td>

                      <td className="border-b px-2 py-4 truncate max-w-xs">
                        {editingItem === item.Id ? (
                          <input
                            type="number"
                            value={editedValues?.Amount || ""}
                            onChange={(e) =>
                              setEditedValues({
                                ...editedValues,
                                Amount: parseFloat(e.target.value),
                              })
                            }
                            className="w-full px-2 py-1 border rounded-md"
                          />
                        ) : (
                          item.Amount
                        )}
                      </td>
                      <td className="py-3 px-5">{item.Created}</td>
                      <td className="py-3 px-5">{item.Modified}</td>

                      <td className="border-b px-2 py-4">
                        {editingItem === item.Id ? (
                          <>
                            <button
                              onClick={() => handleSave(item.Id)}
                              className="mr-2 text-success"
                            >
                              <SaveRounded />
                            </button>
                            <button
                              onClick={() => handleCancel(item.Id)}
                              className="mr-2 text-error"
                            >
                              <CancelRounded />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(item.Id)}
                              className="mr-2 text-success"
                            >
                              <EditRounded />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(
                (priceList?.totalCount ? priceList?.totalCount : 0) /
                  itemsPerPage
              )}
              onPageChange={(page: number) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default PriceComponent;
