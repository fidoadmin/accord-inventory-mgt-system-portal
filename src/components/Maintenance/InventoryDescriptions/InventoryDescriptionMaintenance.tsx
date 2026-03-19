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
  const [sortBy, setSortBy] = useState<string>("modified");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [menuItems, setMenuItems] = useState<SidebarSectionInterface[] | null>(
    null
  );
  const [inventory, setInventory] = useState<any[]>([]);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [search, setSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [isClientSelected, setIsClientSelected] = useState(false);
  const [roleCode, setRoleCode] = useState<string | null>(null);

  const { mutateAsync: addOrUpdateInventoryDescription } =
    useAddOrUpdateInventoryDescription();
  const { mutateAsync: deleteInventoryDescription } =
    useDeleteInventoryDescription();
  const {
    data: inventoryDescriptionList,
    error: inventoryError,
    isLoading: inventoryLoading,
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
        ShortName: editedValues?.ShortName,
        ModelName: editedValues?.ModelName,
        ExpiryThresholdDays: editedValues?.ExpiryThresholdDays,
        ReOrderQuantityPerShipper: editedValues?.ReOrderQuantityPerShipper,
      };

      await addOrUpdateInventoryDescription(payload, {
        onSuccess: () => {
          setEditingItem(null);
          setEditedValues({});
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
    toast(({ closeToast }) => (
      <div>
        <p className="text-white">
          Are you sure you want to delete this Inventory?
        </p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={async () => {
              try {
                await deleteInventoryDescription({
                  Id: id,
                  AuthKey: authKey || "",
                });

                closeToast();
              } catch (error: any) {
                closeToast();
              }
            }}
            className="px-3 py-1.5 bg-error text-white rounded-md hover:bg-error"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };
  const handleOverlayClose = () => {
    setAddButton(false);
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
                    onClick={() => handleSortChange("description")}
                  >
                    Description
                    {sortBy === "description" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer text-left border-b p-2  text-sm"
                    onClick={() => handleSortChange("category")}
                  >
                    Category
                    {sortBy === "category" && (sortOrder === "asc" ? "↑" : "↓")}
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
                    onClick={() => handleSortChange("modelname")}
                  >
                    Model Name
                    {sortBy === "modelname" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer border-b p-2  text-sm text-left"
                    onClick={() => handleSortChange("expirythresholddays")}
                  >
                    Expiry Threshold Days
                    {sortBy === "expirythresholddays" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer border-b p-2  text-sm text-left"
                    onClick={() =>
                      handleSortChange("reorderquantitypershipper")
                    }
                  >
                    Reorder Quantity PerShipper
                    {sortBy === "reorderquantitypershipper" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>

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
                      {roleCode === "USERROLE_SYSTEMADMIN" && (
                        <td className="border-b p-1">{item.ClientName}</td>
                      )}
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
                      <td className="border-b p-1 text-left truncate max-w-xs">
                        {item.CategoryName}
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

                      <td className="border-b p-1 text-left truncate max-w-xs">
                        {editingItem === item.Id ? (
                          <input
                            type="text"
                            value={editedValues?.ExpiryThresholdDays || ""}
                            onChange={(e) =>
                              setEditedValues({
                                ...editedValues,
                                ExpiryThresholdDays: Number(e.target.value),
                              })
                            }
                            className="w-full p-1 border rounded-md"
                          />
                        ) : (
                          item.ExpiryThresholdDays
                        )}
                      </td>
                      <td className="border-b p-1 text-left truncate max-w-xs">
                        {editingItem === item.Id ? (
                          <input
                            type="text"
                            value={
                              editedValues?.ReOrderQuantityPerShipper || ""
                            }
                            onChange={(e) =>
                              setEditedValues({
                                ...editedValues,
                                ReOrderQuantityPerShipper: Number(
                                  e.target.value
                                ),
                              })
                            }
                            className="w-full p-1 border rounded-md"
                          />
                        ) : (
                          item.ReOrderQuantityPerShipper
                        )}
                      </td>
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
