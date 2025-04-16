"use client";

import { useState, useEffect } from "react";
import TableHeader from "@/components/TableHeader";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import AddToCheckoutOverlay from "@/components/AddToCheckoutOverlay";
import { useCompanyList } from "@/app/hooks/companies/useCompanyList";
import { useInventoryDescriptionList } from "@/app/hooks/inventorydescriptions/useInventoryDescriptionList";
import CheckoutCard from "@/components/CheckoutCard";
import InternalCheckoutListOverlay from "./InternalCheckoutListOverlay";
import SearchInput from "./SearchBox";
import { CheckoutListInterface } from "@/types/CheckoutInterface";
import { InventoryDescriptionInterface } from "@/types/InventoryInterface";
import Loading from "@/app/loading";

export default function InternalCheckout() {
  const options = ["Option 1", "Option 2", "Option 3"];
  const [authKey, setAuthKey] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [result, setResult] = useState<InventoryDescriptionInterface[]>([]);
  const [checkoutList, setCheckoutList] = useState<CheckoutListInterface[]>([]);
  const [selectedInventoryDescription, setSelectedInventoryDescription] =
    useState<InventoryDescriptionInterface>();
  const [isCheckoutListVisible, setIsCheckoutListVisible] = useState(false);
  const [addToCheckoutVisible, setAddToCheckoutVisible] = useState(false);

  const {
    data: transfereeData,
    error: buyerError,
    isLoading: buyerLoading,
  } = useCompanyList(authKey || "", {});

  useEffect(() => {
    const key = localStorage.getItem("authKey") as string;
    setAuthKey(key);
  }, []);

  const params = {
    page: page,
    limit: limit,
    search: searchTerm,
  };

  const {
    data: inventoryDescriptionList,
    error: inventoryError,
    isLoading: inventoryLoading,
  } = useInventoryDescriptionList(authKey || "", params);

  useEffect(() => {
    const storedCheckoutList = localStorage.getItem("internalCheckoutList");
    if (storedCheckoutList) {
      setCheckoutList(JSON.parse(storedCheckoutList));
    }
  }, []);

  useEffect(() => {
    const filteredData = inventoryDescriptionList?.filter((category) =>
      category.Description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setResult(searchTerm && filteredData ? filteredData : []);
  }, [inventoryDescriptionList, searchTerm]);

  const handleAddToCheckout = (
    id: string,
    Quantity: number,
    isOpenBox: boolean,
    stock: number[],
    specificExpiryDate: string | null
  ) => {
    const inventoryDescription = inventoryDescriptionList?.find(
      (item) => item.Id === id
    );
    if (!inventoryDescription) {
      toast.error("Item not found.");
      return;
    }

    const exists = checkoutList.find((item) => item.Id === id);
    if (!exists) {
      const updatedCheckoutList = [
        ...checkoutList,
        {
          Id: inventoryDescription.Id,
          Quantity: Quantity,
          ShortName: inventoryDescription.ShortName,
          ManufacturerName: inventoryDescription.ManufacturerName,
          Description: inventoryDescription.Description,
          IsOpenBox: isOpenBox,
          Stock: stock,
          specificExpiryDate: specificExpiryDate,
        },
      ];
      setCheckoutList(updatedCheckoutList);
      localStorage.setItem(
        "internalCheckoutList",
        JSON.stringify(updatedCheckoutList)
      );
      setAddToCheckoutVisible(!addToCheckoutVisible);
      toast.success(
        `${inventoryDescription.Description} has been successfully added to checkout list!`
      );
    } else {
      toast.error(
        `${inventoryDescription.Description} already exists in checkout list.`
      );
    }
  };

  const handleListOverlayState = () => {
    setIsCheckoutListVisible(!isCheckoutListVisible);
  };

  const handleAddOverlayState = (
    inventoryDescription?: InventoryDescriptionInterface
  ) => {
    setSelectedInventoryDescription(inventoryDescription);
    setAddToCheckoutVisible(!addToCheckoutVisible);
  };

  const handleListUpdate = (updatedList: CheckoutListInterface[]) => {
    setCheckoutList(updatedList);
  };

  if (
    buyerLoading ||
    inventoryLoading ||
    !transfereeData ||
    !inventoryDescriptionList
  ) {
    return <Loading />;
  }
  if (buyerError || inventoryError) {
    return <div>Error Loading Data</div>;
  }

  return (
    <>
      <div className="inventory relative pb-6 px-4 md:px-6 flex flex-col gap-4">
        <div className="searchSort flex flex-col md:flex-row justify-between items-center md:items-end">
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          {/* <div className="sortDropdown w-40">
            <p className="sortText">Filter By:</p>
            <div className="DropdownMenu">
            <Dropdown
              options={options}
              onSelect={handleSelect}
              placeholder="Filter"
            />
          </div>
          </div> */}
        </div>
        <div className="inventorySection space-y-2">
          <div className="flex items-center justify-between my-4">
            <h1 className="text-text font-bold text-xl text-center">
              Checkout Inventory
            </h1>
            <button
              disabled={checkoutList.length === 0}
              className={`text-white rounded-3xl px-4 py-2 disabled:bg-transparent disabled:border disabled:border-success disabled:text-success disabled:opacity-60 bg-success hover:opacity-80`}
              onClick={handleListOverlayState}
            >
              Show items in current checkout
            </button>
          </div>
          {result.length ? (
            <TableHeader tableTitle="Description" button />
          ) : (
            <p className="text-center text-text">
              Start searching items to add to current checkout
            </p>
          )}
          <ul className="flex flex-col gap-1">
            {result?.map((inventoryDescription) => (
              <li key={inventoryDescription.Id}>
                <CheckoutCard
                  key={inventoryDescription.Id}
                  description={inventoryDescription}
                  onAddToCheckout={() =>
                    handleAddOverlayState(inventoryDescription)
                  }
                />
              </li>
            ))}
          </ul>
        </div>

        {isCheckoutListVisible && (
          <InternalCheckoutListOverlay
            onOverlayClose={handleListOverlayState}
            checkoutList={checkoutList}
            transfereeList={transfereeData}
            onUpdateCheckoutList={handleListUpdate}
          />
        )}
        {/* {addToCheckoutVisible && (
          <AddToCheckoutOverlay
            onOverlayClose={() =>
              handleAddOverlayState(selectedInventoryDescription)
            }
            inventory={selectedInventoryDescription}
            handleAddToCheckout={handleAddToCheckout}
          />
        )} */}
      </div>
    </>
  );
}
