"use client";

import { useEffect, useState } from "react";
import TableHeader from "@/components/TableHeader";
import DescriptionCard from "@/components/DescriptionCard";
import Dropdown from "@/components/Dropdown";
import SearchInput from "@/components/SearchBox";
import "react-datepicker/dist/react-datepicker.css";
import Pagination from "@/components/Pagination";
import { useCategoryList } from "@/app/hooks/categories/useCategoryList";
import { InventoryDescriptionInterface } from "@/types/InventoryInterface";
import Loading from "@/app/loading";
import DatePicker from "react-datepicker";
import { useInventoryDescriptionForMaintenance } from "@/app/hooks/inventorydescriptions/useInventoryDescriptionForMaintenance";
import { useDropdownList } from "@/app/hooks/globaldropdown/useGlobalDropdown";
import { getCookie } from "cookies-next";

export default function AllInventory() {
  const authKey = getCookie("authKey") as string;

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState("InStock");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryName, setCategoryName] = useState<string | null>("Categories");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [hasModelName, setHasModelName] = useState<boolean>(false);
  const [hasPartNumber, setHasPartNumber] = useState<boolean>(false);
  const [localInventoryDescriptionList, setLocalInventoryDescriptionList] =
    useState<InventoryDescriptionInterface[] | null>(null);
  const [sortby, setSortBy] = useState<string>("modified");
  const [sortorder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [search, setSearch] = useState("");
  const [roleCode, setRoleCode] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [isClientSelected, setIsClientSelected] = useState(false);

  const { data: categoryList } = useCategoryList(authKey || "", {
    page: 1,
    clientid: selectedClientId || undefined,
  });

  const {
    data: inventoryDescriptionList,
    error: inventoryDescriptionError,
    isLoading: inventoryDescriptionLoading,
  } = useInventoryDescriptionForMaintenance(authKey, {
    page: page,
    limit: limit,
    search: searchTerm,
    categoryId: selectedCategory,
    varsortby: sortby,
    varsortorder: sortorder,
    fromDate: fromDate,
    toDate: toDate,
    isFromReport: true,
    outofstock: selectedOption === "OutofStock",
    instock: selectedOption === "InStock",
    clientid: selectedClientId || undefined,
  });

  useEffect(() => {
    setPage(1);
    const RoleCode = localStorage.getItem("RoleCode");
    setRoleCode(RoleCode);
  }, [searchTerm]);

  const { data: client } = useDropdownList("clients", search, filters);

  const handleOptionChange = (value: string) => {
    setLocalInventoryDescriptionList(null);
    setSelectedOption(value);
    setSelectedCategory("");
    setToDate("");
    setFromDate("");
  };

  const handleSetOpenDropdown = (dropdownId: string) => {
    setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  };

  const handleSelectCategory = (option: { id: string; name: string }) => {
    setSelectedCategory(option.id);
  };

  const handleSortChange = (column: string) => {
    const order = sortby === column && sortorder === "asc" ? "desc" : "asc";
    setSortBy(column);
    setSortOrder(order);
  };

  const handleDateFromSelect = (date: Date | null) => {
    setFromDate(date ? formatDate(date) : "");
  };

  const handleDateToSelect = (date: Date | null) => {
    setToDate(date ? formatDate(date) : "");
  };

  const formatDate = (date: Date) =>
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    date.getDate().toString().padStart(2, "0");

  if (inventoryDescriptionError) {
    return <Loading />;
  }

  const inventoryData =
    localInventoryDescriptionList ?? inventoryDescriptionList?.data;

  const handleSelectClient = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedClientId(selectedValue);

    setIsClientSelected(selectedValue !== "");
  };

  return (
    <>
      <div className="mt-10 text-xl font-semibold">
        Inventory <span className="mx-2"> &gt; </span>
        <h1 className="pl-32 mt-[-29px] truncate">
          {selectedOption === "InStock"
            ? "In Stock Inventory"
            : selectedOption === "OutofStock"
            ? "Out of Stock Inventory"
            : "All Inventory"}
        </h1>
      </div>

      <div className="inventoryList mt-6 w-full max-w-full overflow-visible">
        <div className="flex justify-between md:flex-row items-center">
          <select
            className="w-96 px-4 py-2 border rounded-xl"
            value={selectedOption}
            onChange={(e) => handleOptionChange(e.target.value)}
          >
            <option value="InStock" className="text-center">
              In Stock
            </option>
            <option value="OutofStock" className="text-center">
              Out of Stock
            </option>
            <option value="All" className="text-center">
              All
            </option>
          </select>
          {roleCode === "USERROLE_SYSTEMADMIN" && (
            <div className="w-72 pl-5">
              <select
                className="border border-gray-300 px-4 py-2 rounded-xl w-64"
                onChange={handleSelectClient}
                value={selectedClientId}
                required
              >
                <option value="" disabled={selectedClientId !== ""}>
                  Select a Client
                </option>
                {isClientSelected && <option value="">All</option>}
                {client?.map((client: any) => (
                  <option key={client.Id} value={client.Id}>
                    {client.Name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="w-72 pl-5">
            <Dropdown
              label="Category"
              options={
                categoryList?.data.map((category) => ({
                  id: category.Id,
                  name: category.Name,
                })) ?? []
              }
              isOpen={openDropdown === "category"}
              setIsOpen={() => handleSetOpenDropdown("category")}
              onSelect={handleSelectCategory}
              placeholder="Category"
              required
              search
            />
          </div>

          <div className="w-full flex items-center gap-4 mb-1 pl-6">
            <div className="w-auto">
              <DatePicker
                id="date-from"
                dateFormat="yyyy-MM-dd"
                placeholderText="Date From"
                selected={fromDate ? new Date(fromDate) : null}
                onChange={handleDateFromSelect}
                isClearable
                className="w-full p-2 border border-gray-300 rounded-xl"
              />
            </div>

            <div className="w-auto">
              <DatePicker
                id="date-to"
                dateFormat="yyyy-MM-dd"
                placeholderText="Date To"
                selected={toDate ? new Date(toDate) : null}
                onChange={handleDateToSelect}
                isClearable
                className="w-full p-2 border border-gray-300 rounded-xl"
              />
            </div>

            <div className="w-auto">
              <SearchInput
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 table-fixed">
        {inventoryData?.length ? (
          <TableHeader
            tableTitle="Description"
            handleSortChange={handleSortChange}
            sortby={sortby}
            sortorder={sortorder}
          />
        ) : (
          !searchTerm.length && (
            <div>
              <h1 className="text-error text-xl text-center">
                No Inventory Found
              </h1>
            </div>
          )
        )}
        {inventoryData?.length ? (
          <>
            <ul className="flex flex-col gap-1">
              {inventoryData.map((inventory, index) => (
                <DescriptionCard key={index} description={inventory} />
              ))}
            </ul>
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(
                (inventoryDescriptionList?.totalCount
                  ? inventoryDescriptionList?.totalCount
                  : 0) / limit
              )}
              onPageChange={(page) => setPage(page)}
            />
          </>
        ) : (
          !!searchTerm.length && (
            <p className="text-error font-bold text-center">
              Could not find the inventory you are looking for!
            </p>
          )
        )}
      </div>
    </>
  );
}
