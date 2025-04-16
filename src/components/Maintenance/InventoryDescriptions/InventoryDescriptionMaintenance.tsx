import React, { useEffect, useState } from "react";
import {
  AddRounded,
  CancelRounded,
  DeleteRounded,
  EditRounded,
  SaveRounded,
} from "@mui/icons-material";
import { useCategoryList } from "@/app/hooks/categories/useCategoryList";
import { useInventoryDescriptionForMaintenance } from "@/app/hooks/inventorydescriptions/useInventoryDescriptionForMaintenance";
import { useAddOrUpdateInventoryDescription } from "@/app/hooks/inventorydescriptions/useInventoryDescriptionAddOrUpdate";
import { useDeleteInventoryDescription } from "@/app/hooks/inventorydescriptions/useInventoryDescriptionDelete";
import Pagination from "../../Pagination";
import SearchInput from "../../SearchBox";
import InvDescAddOverlay from "./InventoryDescriptionMaintenanceAddOverlay";
import { toast } from "react-toastify";
import { AddOrUpdateInventoryDescriptionPayloadInterface } from "@/types/InventoryInterface";
import { SidebarSectionInterface } from "@/types/ComponentInterface";
import { getCookie } from "cookies-next";
import { useDropdownList } from "@/app/hooks/globaldropdown/useGlobalDropdown";

function InventoryDescriptionMaintenanceContainer() {
  const authKey = getCookie("authKey") as string;
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [addbutton, setAddButton] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [message, setMessage] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("modified");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [hasExpiryDate, setHasExpiryDate] = useState<boolean>(true);
  const [hasBatchNumber, setHasBatchNumber] = useState<boolean>(true);
  const [menuItems, setMenuItems] = useState<SidebarSectionInterface[] | null>(
    null
  );
  const [inventory, setInventory] = useState<any[]>([]);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [search, setSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [isClientSelected, setIsClientSelected] = useState(false);
  const [roleCode, setRoleCode] = useState<string | null>(null);

  const { mutate: addOrUpdateInventoryDescription } =
    useAddOrUpdateInventoryDescription();
  const { mutate: deleteInventoryDescription } =
    useDeleteInventoryDescription();
  const {
    data: inventoryDescriptionList,
    error: inventoryError,
    isLoading: inventoryLoading,
    refetch: refetchInventoryData,
  } = useInventoryDescriptionForMaintenance(authKey, {
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    categoryId: selectedCategory,
    varsortby: sortBy,
    varsortorder: sortOrder,
    clientid: selectedClientId || undefined,
  });
  const { data: client } = useDropdownList("clients", search, filters);

  const { data: categoryList } = useCategoryList(authKey || "", {
    page: 1,
    clientid: selectedClientId || undefined,
  });

  useEffect(() => {
    const menuItemsFromStorage = localStorage.getItem("menuItems");
    if (menuItemsFromStorage) {
      try {
        const parsedMenuItems = JSON.parse(menuItemsFromStorage);
        setMenuItems(parsedMenuItems);
      } catch (error) {
        console.error("Failed to parse menuItems from localStorage:", error);
      }
    }
    const RoleCode = localStorage.getItem("RoleCode");
    setRoleCode(RoleCode);
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, sortBy, sortOrder, selectedClientId]);

  const accessDetails = menuItems?.flatMap((menu) => {
    if (menu.Name === "Maintenance") {
      return menu.SideBarDropdowns?.flatMap((child) => {
        if (child.Name === "System" && child.PageDropdowns) {
          return child.PageDropdowns.filter(
            (dropdown) => dropdown.Name === "Inventory Description"
          );
        }
        return [];
      });
    }
    return [];
  });

  const totalCount = inventoryDescriptionList?.totalCount || 0;
  const data = inventoryDescriptionList?.data || [];
  const category = categoryList?.data || [];

  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil(totalCount / itemsPerPage)
  );

  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editedValues, setEditedValues] =
    useState<AddOrUpdateInventoryDescriptionPayloadInterface>();

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const hasPartNumber = inventoryDescriptionList?.data?.some(
    (item) =>
      item.PartNumber &&
      data?.some((inventory) => inventory.PartNumber !== null)
  );

  const hasModelName = inventoryDescriptionList?.data?.some(
    (item) =>
      item.ModelName && data?.some((inventory) => inventory.ModelName !== null)
  );

  const handleEdit = (id: string) => {
    setEditingItem(id);
    const item = data.find((val) => val.Id === id);
    if (item) {
      setEditedValues({
        ...item,
        Description: item.Description || "",
        ShortName: item.ShortName || "",
        ModelName: item.ModelName || "",
        PartNumber: item.PartNumber || "",
        HasExpiryDate: item.HasExpiryDate ? item.HasExpiryDate : undefined,
        HasBatchNumber: item.HasBatchNumber ? item.HasBatchNumber : undefined,
        DivideQuantity: item.DivideQuantity ? item.DivideQuantity : undefined,
      });
    }
  };

  const handleSave = async (id: string) => {
    if (!editedValues?.Description) {
      toast.error("Description is required ", {
        position: "top-right",
      });
      return;
    }

    try {
      const payload: AddOrUpdateInventoryDescriptionPayloadInterface = {
        Id: editedValues?.Id,
        Description: editedValues?.Description,
        CategoryName: editedValues?.CategoryName,
        CategoryId: editedValues?.CategoryId,
        ShortName: editedValues?.ShortName,
        ManufacturerName: editedValues?.ManufacturerName,
        ManufacturerId: editedValues?.ManufacturerId,
        ModelName: editedValues?.ModelName,
        PartNumber: editedValues?.PartNumber,
        HasExpiryDate: editedValues?.HasExpiryDate,
        HasBatchNumber: editedValues?.HasBatchNumber,
        DivideQuantity: editedValues?.DivideQuantity,
      };

      await addOrUpdateInventoryDescription(payload, {
        onSuccess: () => {
          setEditingItem(null);
          setEditedValues({});
          refetchInventoryData();
        },
        onError: (error) => {
          toast.error(
            `Error updating item: ${error.message || "Unknown error"}`,
            {
              position: "top-right",
            }
          );
        },
      });
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setEditedValues({});
  };

  const handleDelete = (id: string) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p className="text-black">
            Are you sure you want to delete this Inventory?
          </p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                deleteInventoryDescription(
                  { Id: id, AuthKey: authKey },
                  {
                    onSuccess: () => {
                      refetchInventoryData();
                      closeToast();
                    },
                    onError: (error) => {
                      toast.error(
                        `Error deleting item: ${
                          error.message || "Unknown error"
                        }`,
                        {
                          position: "top-right",
                        }
                      );
                      closeToast();
                    },
                  }
                );
              }}
              className="px-3 py-1.5 bg-error text-white rounded-md hover:bg-error"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        position: "top-right",
        className: "bg-warning text-white",
      }
    );
  };

  const handleOverlayClose = () => {
    setAddButton(false);
    refetchInventoryData();
  };

  const handleSortChange = (column: string) => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortBy(column);
    setSortOrder(newSortOrder);
  };

  const handelSuccess = async (newInventory: any) => {
    if (newInventory) {
      setInventory((prevInventory) => [newInventory, ...prevInventory]);
      setSortBy("created");
      setSortOrder("desc");
    }
  };
  const handleSelectClient = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedClientId(selectedValue);

    setIsClientSelected(selectedValue !== "");
  };

  return (
    <>
      <div className="w-full px-8 mt-4">
        <div className="flex items-center gap-4 mt-[-58.5px] pl-48">
          <label
            htmlFor="category-select"
            className="block text-gray-700 font-bold text-sm pl-2"
          ></label>
          {roleCode === "USERROLE_SYSTEMADMIN" && (
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
          )}
          <select
            id="category-select"
            onChange={(e) => handleSelectCategory(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-xl w-64"
          >
            <option value="">All Categories</option>
            {category.map((category) => (
              <option key={category.Id} value={category.Id}>
                {category.Name}
              </option>
            ))}
          </select>
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        <div className="relative w-full">
          <div className="py-1 flex justify-end mb-8">
            {accessDetails && accessDetails[0]?.CanCreate === "1" && (
              <button
                className="btn bg-success rounded-xl px-4 py-2 text-white flex items-center md:justify-around mb-6"
                type="button"
                onClick={() => setAddButton(!addbutton)}
              >
                Add
                <AddRounded />
              </button>
            )}
          </div>

          <div className="overflow-x-auto border-2 rounded-lg relative top-[-40px]">
            <table className="w-full border-collapse table-fixed">
              <thead>
                <tr className="bg-tablehead border-b-2 text-left">
                  <th
                    className="cursor-pointer text-left border-b p-2  text-sm"
                    onClick={() => handleSortChange("manufacturername")}
                  >
                    Manufacturer
                    {sortBy === "manufacturername" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  {roleCode === "USERROLE_SYSTEMADMIN" && (
                    <th
                      className="cursor-pointer p-2"
                      onClick={() => handleSortChange("client")}
                    >
                      Client
                      {sortBy === "client" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                  )}
                  <th
                    className="cursor-pointer text-left border-b p-2  text-sm"
                    onClick={() => handleSortChange("category")}
                  >
                    Category{" "}
                    {sortBy === "category" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer text-left border-b p-2  text-sm"
                    onClick={() => handleSortChange("description")}
                  >
                    Description
                    {sortBy === "description" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer text-left border-b p-2  text-sm"
                    onClick={() => handleSortChange("shortname")}
                  >
                    Short Name
                    {sortBy === "shortname" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer text-left border-b p-2  text-sm"
                    onClick={() => handleSortChange("dividequantity")}
                  >
                    Divide Quantity
                    {sortBy === "dividequantity" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  {hasExpiryDate && (
                    <th
                      className="cursor-pointer border-b p-2  text-sm text-left"
                      onClick={() => handleSortChange("expiry")}
                    >
                      Expiry Date
                      {sortBy === "expiry" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                  )}
                  {hasBatchNumber && (
                    <th
                      className="cursor-pointer text-left border-b p-2  text-sm"
                      onClick={() => handleSortChange("batchnumber")}
                    >
                      Batch No
                      {sortBy === "batchnumber" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                  )}
                  {selectedCategory && hasModelName && (
                    <th
                      className="cursor-pointer text-left border-b p-2  text-sm"
                      onClick={() => handleSortChange("modelname")}
                    >
                      Model Name
                      {sortBy === "modelname" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                  )}
                  {selectedCategory && hasPartNumber && (
                    <th
                      className="cursor-pointer text-left border-b p-2  text-sm"
                      onClick={() => handleSortChange("partnumber")}
                    >
                      Part Number
                      {sortBy === "partnumber" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                  )}
                  <th className="cursor-pointer border-b p-2 text-sm text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {inventoryLoading ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-error">
                      Loading description...
                    </td>
                  </tr>
                ) : inventoryError ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-error">
                      Error loading description:
                    </td>
                  </tr>
                ) : !Array.isArray(inventoryDescriptionList?.data) ||
                  inventoryDescriptionList.data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-error">
                      No description found.
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr key={item.Id}>
                      <td className="border-b p-1 truncate max-w-xs">
                        {item.ManufacturerName}
                      </td>
                      {roleCode === "USERROLE_SYSTEMADMIN" && (
                        <td className="border-b p-1">{item.ClientName}</td>
                      )}
                      <td className="border-b p-1">{item.CategoryName}</td>
                      <td className="border-b p-1 truncate max-w-xs">
                        {editingItem === item.Id ? (
                          <input
                            type="text"
                            value={editedValues?.Description || ""}
                            onChange={(e) =>
                              setEditedValues({
                                ...editedValues,
                                Description: e.target.value,
                              })
                            }
                            className="w-full p-1 border rounded-md"
                          />
                        ) : (
                          item.Description
                        )}
                      </td>
                      <td className="border-b p-1 text-left truncate">
                        {editingItem === item.Id ? (
                          <input
                            type="text"
                            value={editedValues?.ShortName || ""}
                            onChange={(e) =>
                              setEditedValues({
                                ...editedValues,
                                ShortName: e.target.value,
                              })
                            }
                            className="w-full p-1 border rounded-md"
                          />
                        ) : (
                          item.ShortName
                        )}
                      </td>
                      <td className="border-b p-1 text-left">
                        {item.DivideQuantity ? "Yes" : "No"}
                      </td>

                      <td className="border-b p-1 text-left">
                        {editingItem === item.Id ? (
                          <div className="flex justify-left items-left space-x-4">
                            <label className="flex items-left">
                              <input
                                type="checkbox"
                                checked={!!editedValues?.HasExpiryDate}
                                onChange={() =>
                                  setEditedValues((prevState) => ({
                                    ...prevState,
                                    HasExpiryDate: !prevState?.HasExpiryDate,
                                  }))
                                }
                                className="toggle-checkbox hidden"
                              />
                              <span
                                className={`toggle-switch w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                                  editedValues?.HasExpiryDate
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                }`}
                              >
                                <span
                                  className={`toggle-dot w-4 h-4 bg-white rounded-full shadow-md transform ${
                                    editedValues?.HasExpiryDate
                                      ? "translate-x-5"
                                      : "translate-x-0"
                                  }`}
                                ></span>
                              </span>
                            </label>
                            <span>
                              {editedValues?.HasExpiryDate ? "Yes" : "No"}
                            </span>
                          </div>
                        ) : (
                          <p>{item.HasExpiryDate ? "Yes" : "No"}</p>
                        )}
                      </td>
                      <td className="border-b p-1 text-left">
                        {editingItem === item.Id ? (
                          <div className="flex justify-left items-left space-x-4">
                            <label className="flex items-left">
                              <input
                                type="checkbox"
                                checked={!!editedValues?.HasBatchNumber}
                                onChange={() =>
                                  setEditedValues((prevState) => ({
                                    ...prevState,
                                    HasBatchNumber: !prevState?.HasBatchNumber,
                                  }))
                                }
                                className="toggle-checkbox hidden"
                              />
                              <span
                                className={`toggle-switch w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                                  editedValues?.HasBatchNumber
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                }`}
                              >
                                <span
                                  className={`toggle-dot w-4 h-4 bg-white rounded-full shadow-md transform ${
                                    editedValues?.HasBatchNumber
                                      ? "translate-x-5"
                                      : "translate-x-0"
                                  }`}
                                ></span>
                              </span>
                            </label>
                            <span>
                              {editedValues?.HasBatchNumber ? "Yes" : "No"}
                            </span>
                          </div>
                        ) : (
                          <span
                            onClick={() => setEditingItem(item.Id)}
                            className="cursor-pointer hover:underline"
                          >
                            {item.HasBatchNumber ? "Yes" : "No"}
                          </span>
                        )}
                      </td>
                      {selectedCategory && hasModelName && (
                        <td className="border-b p-1 text-left truncate max-w-xs">
                          {editingItem === item.Id ? (
                            <input
                              type="text"
                              value={editedValues?.ModelName || ""}
                              onChange={(e) =>
                                setEditedValues({
                                  ...editedValues,
                                  ModelName: e.target.value,
                                })
                              }
                              className="w-full p-1 border rounded-md"
                            />
                          ) : (
                            item.ModelName || "No"
                          )}
                        </td>
                      )}
                      {selectedCategory && hasPartNumber && (
                        <td className="border-b p-1 truncate max-w-xs text-left">
                          {editingItem === item.Id ? (
                            <input
                              type="text"
                              value={editedValues?.PartNumber || ""}
                              onChange={(e) =>
                                setEditedValues({
                                  ...editedValues,
                                  PartNumber: e.target.value,
                                })
                              }
                              className="w-full p-1 border rounded-md"
                            />
                          ) : (
                            item.PartNumber || "No"
                          )}
                        </td>
                      )}
                      <td className="border-b p-1 text-left">
                        {editingItem === item.Id ? (
                          <>
                            <button
                              onClick={() => handleSave(item.Id)}
                              className="mr-2 text-success"
                            >
                              <SaveRounded />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="text-error"
                            >
                              <CancelRounded />
                            </button>
                          </>
                        ) : (
                          <>
                            {accessDetails &&
                              accessDetails[0]?.CanUpdate === "1" && (
                                <button
                                  onClick={() => handleEdit(item.Id)}
                                  className="text-success"
                                >
                                  <EditRounded />
                                </button>
                              )}
                            {accessDetails &&
                              accessDetails[0]?.CanDelete === "1" && (
                                <button
                                  onClick={() => handleDelete(item.Id)}
                                  className="text-error"
                                >
                                  <DeleteRounded />
                                </button>
                              )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {(inventoryDescriptionList?.data.length
          ? inventoryDescriptionList?.data.length
          : 0) > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(
              (inventoryDescriptionList?.totalCount || 0) / itemsPerPage
            )}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}

        {addbutton && accessDetails && accessDetails[0]?.CanCreate === "1" && (
          <InvDescAddOverlay
            onOverlayClose={handleOverlayClose}
            onSuccess={handelSuccess}
          />
        )}
      </div>
    </>
  );
}

export default InventoryDescriptionMaintenanceContainer;
