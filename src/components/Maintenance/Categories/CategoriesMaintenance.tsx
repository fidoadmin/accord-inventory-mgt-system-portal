import React, { useEffect, useState } from "react";
import {
  AddRounded,
  CancelRounded,
  DeleteRounded,
  SaveRounded,
} from "@mui/icons-material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { useCategoryList } from "@/app/hooks/categories/useCategoryList";
import { useAddOrUpdateCategory } from "@/app/hooks/category/useCategoryAddOrUpdate";
import { useDeleteCategoryDetail } from "@/app/hooks/category/useCategoryDelete";
import { toast } from "react-toastify";
import { AddOrUpdateCategoryPayloadInterface } from "@/types/CategoryInterface";
import Pagination from "@/components/Pagination";
import { SidebarSectionInterface } from "@/types/ComponentInterface";
import { getCookie } from "cookies-next";
import SearchInput from "@/components/SearchBox";
import CategoriesMaintenanceAddOverlay from "./CategoriesMaintenanceAddOverlay";
import { useDropdownList } from "@/app/hooks/globaldropdown/useGlobalDropdown";
function CategoriesMaintenanceContainer() {
  const authKey = getCookie("authKey") as string;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [addbutton, setAddButton] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("modified");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [categories, setCategories] = useState<any[]>([]);
  const [editableCategory, setEditableCategory] = useState<any | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [isClientSelected, setIsClientSelected] = useState(false);
  const [roleCode, setRoleCode] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [search, setSearch] = useState("");
  const [menuItems, setMenuItems] = useState<SidebarSectionInterface[] | null>(
    null
  );
  const { mutate: addOrUpdateCategory } = useAddOrUpdateCategory();
  const { mutate: deleteCategoryDetails } = useDeleteCategoryDetail();

  const {
    data: categoryList,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useCategoryList(authKey || "", {
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    sortBy: sortBy,
    sortOrder: sortOrder,
    clientid: selectedClientId || undefined,
  });

  const { data: client } = useDropdownList("clients", search, filters);

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
  }, [searchTerm, sortBy, sortOrder, selectedClientId]);

  const accessDetails = menuItems?.flatMap((menu) => {
    if (menu.Name === "Maintenance") {
      return menu.SideBarDropdowns?.flatMap((child) => {
        if (child.Name === "System" && child.PageDropdowns) {
          return child.PageDropdowns.filter(
            (dropdown) => dropdown.Name === "Category"
          );
        }
        return [];
      });
    }
    return [];
  });

  const handleEditCategory = (categoryId: string, category: any) => {
    setEditingCategoryId(categoryId);
    setEditableCategory({ ...category });
  };

  const handleSaveCategory = async () => {
    if (editableCategory) {
      const payload: AddOrUpdateCategoryPayloadInterface = {
        Id: editingCategoryId || "",
        Name: editableCategory?.Name,
        HasManufactureDate: editableCategory?.HasManufactureDate,
        HasExpirationDate: editableCategory?.HasExpirationDate,
        HasModelName: editableCategory?.HasModelName,
        HasPartNumber: editableCategory?.HasPartNumber,
        ShowSize: editableCategory?.ShowSize,
        AllowExpiredInventory: editableCategory?.AllowExpiredInventory,
      };

      setCategories((prevUsers) =>
        prevUsers.map((category) =>
          category.Id === editingCategoryId
            ? { ...categories, ...editableCategory }
            : categories
        )
      );

      try {
        await addOrUpdateCategory(payload);
        setEditingCategoryId(null);
        setEditableCategory(null);
        setSortBy("modified");
        setSortOrder("desc");
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(`Error updating category: ${error.message}`);
        } else {
          toast.error("Unknown error updating category.");
        }
      }
    }
  };

  const handleDelete = (id: string) => {
    toast(({ closeToast }) => (
      <div>
        <p className="text-white">
          Are you sure you want to delete this category?
        </p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={async () => {
              try {
                await deleteCategoryDetails({
                  Id: id,
                  AuthKey: authKey || "",
                });

                setCategories((prevCategories) =>
                  prevCategories.filter((category) => category.Id !== id)
                );

                closeToast();
              } catch (error: any) {
                toast.error("Failed to delete user", { position: "top-right" });
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

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setEditableCategory(null);
  };

  const handelSuccess = async (newCategories: any) => {
    if (newCategories) {
      setCategories((prevCategories) => [newCategories, ...prevCategories]);
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
        <div className="flex items-center gap-4 mt-[-56px] pl-52">
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
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        <div className="flex justify-end mb-4">
          {accessDetails && accessDetails[0]?.CanCreate === "1" && (
            <button
              className="flex items-center px-4 py-2 border-2 bg-success rounded-xl text-white hover:opacity-80"
              onClick={() => setAddButton(!addbutton)}
            >
              <AddRounded style={{ color: "white" }} className="mr-2" />
              Add
            </button>
          )}
        </div>

        <div className="overflow-x-auto border-2 rounded-lg mt-2">
          <table className="w-full border-collapse table-auto">
            <thead>
              <tr className="bg-tablehead border text-left">
                <th
                  className="cursor-pointer text-left border-b p-2  text-sm"
                  onClick={() => handleSortChange("categoryname")}
                >
                  Category Name{" "}
                  {sortBy === "categoryname" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                {roleCode === "USERROLE_SYSTEMADMIN" && (
                  <th
                    className="cursor-pointer p-2 "
                    onClick={() => handleSortChange("client")}
                  >
                    Client
                    {sortBy === "client" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                )}
                <th
                  className="cursor-pointer text-left border-b p-2  text-sm"
                  onClick={() => handleSortChange("expirationdate")}
                >
                  Expiration Date{" "}
                  {sortBy === "expirationdate" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="cursor-pointer text-left border-b p-2  text-sm"
                  onClick={() => handleSortChange("manufacturerdate")}
                >
                  Manufacturer Date{" "}
                  {sortBy === "manufacturerdate" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </th>

                <th
                  className="cursor-pointer text-left border-b p-2  text-sm"
                  onClick={() => handleSortChange("showsize")}
                >
                  Show Size{" "}
                  {sortBy === "showsize" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="cursor-pointer text-left border-b p-2  text-sm"
                  onClick={() => handleSortChange("allowexpiredinventory")}
                >
                  Allow Expired{" "}
                  {sortBy === "allowexpiredinventory" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="cursor-pointer text-left border-b p-2  text-sm"
                  onClick={() => handleSortChange("partnumber")}
                >
                  Part Number{" "}
                  {sortBy === "partnumber" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="cursor-pointer text-left border-b p-2  text-sm"
                  onClick={() => handleSortChange("modelname")}
                >
                  Model Name{" "}
                  {sortBy === "modelname" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="cursor-pointer text-left border-b p-2  text-sm"
                  onClick={() => handleSortChange("created")}
                >
                  Created
                  {sortBy === "created" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="cursor-pointer text-left border-b p-2  text-sm"
                  onClick={() => handleSortChange("modified")}
                >
                  Modified
                  {sortBy === "modified" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="cursor-pointer text-left border-b p-2  text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categoriesLoading ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-error">
                    Loading categories...
                  </td>
                </tr>
              ) : categoriesError ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-error">
                    Error loading categories:
                  </td>
                </tr>
              ) : !Array.isArray(categoryList?.data) ||
                categoryList.data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-error">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categoryList.data.map((category) => (
                  <tr className="border hover:bg-gray-50" key={category.Id}>
                    <td className="text-left  truncate">
                      {category.Name || ""}
                    </td>
                    {roleCode === "USERROLE_SYSTEMADMIN" && (
                      <td className="p-1">{category.ClientName}</td>
                    )}
                    <td className="p-1 text-left">
                      {editingCategoryId === category.Id ? (
                        <div className="flex justify-left items-left space-x-4">
                          <label
                            className="flex items-left cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={
                                editableCategory?.HasExpirationDate || false
                              }
                              onChange={(e) =>
                                setEditableCategory({
                                  ...editableCategory,
                                  HasExpirationDate: e.target.checked,
                                })
                              }
                              className="toggle-checkbox hidden"
                            />
                            <span
                              className={`toggle-switch w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                                editableCategory?.HasExpirationDate
                                  ? "bg-success"
                                  : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`toggle-dot w-4 h-4 bg-white rounded-full shadow-md transform ${
                                  editableCategory?.HasExpirationDate
                                    ? "translate-x-5"
                                    : "translate-x-0"
                                }`}
                              ></span>
                            </span>
                          </label>
                          <span>
                            {editableCategory?.HasExpirationDate ? "Yes" : "No"}
                          </span>
                        </div>
                      ) : category.HasExpirationDate ? (
                        "Yes"
                      ) : (
                        "No"
                      )}
                    </td>

                    <td className="p-1 text-left">
                      {editingCategoryId === category.Id ? (
                        <div className="flex justify-left items-left space-x-4">
                          <label
                            className="flex items-left cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={
                                editableCategory?.HasManufactureDate ?? false
                              }
                              onChange={(e) =>
                                setEditableCategory({
                                  ...editableCategory,
                                  HasManufactureDate: e.target.checked,
                                })
                              }
                              className="toggle-checkbox hidden"
                            />
                            <span
                              className={`toggle-switch w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                                editableCategory?.HasManufactureDate
                                  ? "bg-success"
                                  : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`toggle-dot w-4 h-4 bg-white rounded-full shadow-md transform ${
                                  editableCategory?.HasManufactureDate
                                    ? "translate-x-5"
                                    : "translate-x-0"
                                }`}
                              ></span>
                            </span>
                          </label>
                          <span>
                            {editableCategory?.HasManufactureDate
                              ? "Yes"
                              : "No"}
                          </span>
                        </div>
                      ) : category.HasManufactureDate ? (
                        "Yes"
                      ) : (
                        "No"
                      )}
                    </td>

                    <td className="p-1 text-left">
                      {editingCategoryId === category.Id ? (
                        <div className="flex justify-left items-left space-x-4">
                          <label className="flex items-left">
                            <input
                              type="checkbox"
                              checked={editableCategory?.ShowSize ?? false}
                              onChange={(e) =>
                                setEditableCategory({
                                  ...editableCategory,
                                  ShowSize: e.target.checked,
                                })
                              }
                              className="toggle-checkbox hidden"
                            />
                            <span
                              className={`toggle-switch w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                                editableCategory?.ShowSize
                                  ? "bg-success"
                                  : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`toggle-dot w-4 h-4 bg-white rounded-full shadow-md transform ${
                                  editableCategory?.ShowSize
                                    ? "translate-x-5"
                                    : "translate-x-0"
                                }`}
                              ></span>
                            </span>
                          </label>
                          <span>
                            {editableCategory?.ShowSize ? "Yes" : "No"}
                          </span>
                        </div>
                      ) : category.ShowSize ? (
                        "Yes"
                      ) : (
                        "No"
                      )}
                    </td>

                    <td className="p-1 text-left">
                      {editingCategoryId === category.Id ? (
                        <div className="flex justify-left items-left space-x-4">
                          <label className="flex items-left">
                            <input
                              type="checkbox"
                              checked={
                                editableCategory?.AllowExpiredInventory ?? false
                              }
                              onChange={(e) =>
                                setEditableCategory({
                                  ...editableCategory,
                                  AllowExpiredInventory: e.target.checked,
                                })
                              }
                              className="toggle-checkbox hidden"
                            />
                            <span
                              className={`toggle-switch w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                                editableCategory?.AllowExpiredInventory
                                  ? "bg-success"
                                  : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`toggle-dot w-4 h-4 bg-white rounded-full shadow-md transform ${
                                  editableCategory?.AllowExpiredInventory
                                    ? "translate-x-5"
                                    : "translate-x-0"
                                }`}
                              ></span>
                            </span>
                          </label>
                          <span>
                            {editableCategory?.AllowExpiredInventory
                              ? "Yes"
                              : "No"}
                          </span>
                        </div>
                      ) : category.AllowExpiredInventory ? (
                        "Yes"
                      ) : (
                        "No"
                      )}
                    </td>

                    <td className="p-1 text-left">
                      {editingCategoryId === category.Id ? (
                        <div className="flex justify-left items-left space-x-4">
                          <label
                            className="flex items-left cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={editableCategory?.HasPartNumber || false}
                              onChange={(e) =>
                                setEditableCategory({
                                  ...editableCategory,
                                  HasPartNumber: e.target.checked,
                                })
                              }
                              className="toggle-checkbox hidden"
                            />
                            <span
                              className={`toggle-switch w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                                editableCategory?.HasPartNumber
                                  ? "bg-success"
                                  : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`toggle-dot w-4 h-4 bg-white rounded-full shadow-md transform ${
                                  editableCategory?.HasPartNumber
                                    ? "translate-x-5"
                                    : "translate-x-0"
                                }`}
                              ></span>
                            </span>
                          </label>
                          <span>
                            {editableCategory?.HasPartNumber ? "Yes" : "No"}
                          </span>
                        </div>
                      ) : category.HasPartNumber ? (
                        "Yes"
                      ) : (
                        "No"
                      )}
                    </td>

                    <td className="p-1 text-left">
                      {editingCategoryId === category.Id ? (
                        <div className="flex justify-left items-left space-x-4">
                          <label
                            className="flex items-left cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={editableCategory?.HasModelName || false}
                              onChange={(e) =>
                                setEditableCategory({
                                  ...editableCategory,
                                  HasModelName: e.target.checked,
                                })
                              }
                              className="toggle-checkbox hidden"
                            />
                            <span
                              className={`toggle-switch w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                                editableCategory?.HasModelName
                                  ? "bg-success"
                                  : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`toggle-dot w-4 h-4 bg-white rounded-full shadow-md transform ${
                                  editableCategory?.HasModelName
                                    ? "translate-x-5"
                                    : "translate-x-0"
                                }`}
                              ></span>
                            </span>
                          </label>
                          <span>
                            {editableCategory?.HasModelName ? "Yes" : "No"}
                          </span>
                        </div>
                      ) : category.HasModelName ? (
                        "Yes"
                      ) : (
                        "No"
                      )}
                    </td>

                    <td className="p-1 text-left">{category.Created}</td>
                    <td className="p-1 text-left">{category.Modified}</td>
                    <td className="p-1 text-left">
                      {editingCategoryId === category.Id ? (
                        <>
                          <button
                            onClick={handleSaveCategory}
                            className="mr-2 text-success"
                          >
                            <SaveRounded />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="mr-2 text-error"
                          >
                            <CancelRounded />
                          </button>
                        </>
                      ) : (
                        <>
                          {accessDetails &&
                            accessDetails[0]?.CanUpdate === "1" && (
                              <button
                                onClick={() =>
                                  handleEditCategory(category.Id, category)
                                }
                                className="text-success hover:underline"
                              >
                                <EditRoundedIcon />
                              </button>
                            )}
                          {accessDetails &&
                            accessDetails[0]?.CanDelete === "1" && (
                              <button
                                onClick={() => handleDelete(category.Id || "")}
                                className="mr-2 text-error"
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
      {(categoryList?.data.length ? categoryList?.data.length : 0) > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil((categoryList?.totalCount || 0) / itemsPerPage)}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
      {addbutton && accessDetails && accessDetails[0]?.CanCreate === "1" && (
        <CategoriesMaintenanceAddOverlay
          onOverlayClose={handleOverlayClose}
          onSuccess={handelSuccess}
        />
      )}
    </>
  );
}

export default CategoriesMaintenanceContainer;
