import React, { useEffect, useState } from "react";
import {
  AddRounded,
  CancelRounded,
  DeleteRounded,
  EditRounded,
  SaveRounded,
} from "@mui/icons-material";
import { useCategoryList } from "@/app/hooks/categories/useCategoryList";
import { useContainersForMaintenance } from "@/app/hooks/containers/useContainerListForMaintenance";
import Pagination from "../../Pagination";
import SearchInput from "@/components/SearchBox";
import ContainerAddOverlay from "./ContainersMaintenanceAddOverlay";
import Dropdown from "@/components/Dropdown";
import { useDeleteContainer } from "@/app/hooks/Container/useContainerDelete";
import { useAddOrUpdateContainer } from "@/app/hooks/Container/useContainerAddOrUpdate";
import { toast } from "react-toastify";
import { SidebarSectionInterface } from "@/types/ComponentInterface";
import { getCookie } from "cookies-next";
import { useDropdownList } from "@/app/hooks/globaldropdown/useGlobalDropdown";
export default function ContainersMaintenanceContainer() {
  const authKey = getCookie("authKey") as string;

  const [selectedContainer, setSelectedContainer] = useState<{
    name?: string;
    id?: string;
  } | null>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categoryName, setCategoryName] = useState<string | null>("Categories");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { mutate: addOrUpdateContainer } = useAddOrUpdateContainer();
  const [sortBy, setSortBy] = useState<string>("created");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [addButton, setAddButton] = useState<boolean>(false);
  const [formError, setFormError] = useState<string[] | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<SidebarSectionInterface[] | null>(
    null
  );
  const [roleCode, setRoleCode] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [search, setSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [isClientSelected, setIsClientSelected] = useState(false);
  const itemsPerPage = 10;
  const [editableData, setEditableData] = useState<{
    Id: string | undefined;
    Size: string | undefined;
    SmallUnit: string | undefined;
    ChallanUnit: string | undefined;
  }>();
  const handleSetOpenDropdown = (dropdownId: string) => {
    setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  };
  const { data: containerList } =
    useContainersForMaintenance(authKey || "", {
      page: currentPage,
      limit: 10,
      search: searchTerm,
      categoryId: selectedCategory,
      sortBy: sortBy,
      sortOrder: sortOrder,
      type: selectedContainer?.name,
      clientid: selectedClientId || undefined,
    }) || {};
  const {
    data: categoryList = [],
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useCategoryList(authKey || "", {
    page: 1,
  });
  const { data: client } = useDropdownList("clients", search, filters);

  const categories = Array.isArray(categoryList)
    ? categoryList
    : categoryList?.data || [];
  const handleSelectContainer = (option: { id: string; name: string }) => {
    setSelectedContainer(option);
    setEditingIndex(null);
  };

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
  }, [
    selectedCategory,
    selectedContainer,
    searchTerm,
    sortBy,
    sortOrder,
    selectedClientId,
  ]);

  const accessDetails = menuItems?.flatMap((menu) => {
    if (menu.Name === "Maintenance") {
      return menu.SideBarDropdowns?.flatMap((child) => {
        if (child.Name === "System" && child.PageDropdowns) {
          return child.PageDropdowns.filter(
            (dropdown) => dropdown.Name === "Container"
          );
        }
        return [];
      });
    }
    return [];
  });

  const handleSelectCategory = (option: {
    id: string;
    name: string;
    isExpiry?: boolean;
  }) => {
    setSelectedCategory(option.id);
    setCategoryName(option.name);
    setEditingIndex(null);
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);
  const handleOverlayClose = () => {
    setAddButton(false);
  };
  const handelSuccess = async () => {
    setSortBy("created");
    setSortOrder("desc");
    setSelectedCategory("");
    handleSelectCategory({ id: "", name: "" });
    setSelectedContainer(null);
    setOpenDropdown(null);
    setCategoryName(null);
  };
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };
  const handleEditClick = (pack: any) => {
    setEditingIndex(pack.Id);
    setEditableData({
      Id: pack.Id,
      Size: pack.Size,
      SmallUnit: pack.SmallUnit,
      ChallanUnit: pack.ChallanUnit || undefined,
    });
  };

  const handleSave = async () => {
    if (!editableData?.Id) {
      console.error("Missing Container ID. Cannot save!");
      return;
    }
    try {
      await addOrUpdateContainer({
        Id: editableData.Id,
        Size: editableData.Size || "",
        SmallUnit: editableData.SmallUnit,
        ChallanUnit: editableData.ChallanUnit || undefined,
      });
      setOpenDropdown(null);
      setSortBy("modified");
      setSortOrder("desc");
      setEditingIndex(null);
      setEditableData(undefined);
    } catch (error) {
      console.error("Failed to save container:", error);
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
  };
  const { mutateAsync: deleteContainer } = useDeleteContainer();
  const handleDelete = async (containerId: string) => {
    toast(({ closeToast }) => (
      <div>
        <p className="text-white">Are you sure you want to delete this item?</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={async () => {
              deleteContainer({ Id: containerId, AuthKey: authKey });
            }}
            className="px-3 py-1.5 bg-error text-white rounded-md hover:bg-error"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };
  const handleSelectClient = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedClientId(selectedValue);

    setIsClientSelected(selectedValue !== "");
  };
  return (
    <>
      <div className="w-full px-8 mt-4">
        <div className="flex items-center gap-4 mt-[-58.5px] pl-52">
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
          <div className="w-40 mt-1">
            <Dropdown
              label="Category"
              options={
                categories.map((category) => ({
                  id: category.Id,
                  name: category.Name,
                })) ?? []
              }
              isOpen={openDropdown === "category"}
              setIsOpen={() => handleSetOpenDropdown("category")}
              onSelect={handleSelectCategory}
              placeholder="Categories"
              required
              search
              value={categoryName ? categoryName : "Categories"}
            />
          </div>
          <div className="w-40 mt-1">
            <Dropdown
              label="Container"
              options={
                containerList?.data
                  .filter(
                    (value, index, self) =>
                      index === self.findIndex((t) => t.Type === value.Type)
                  )
                  .map((container: any) => ({
                    id: container.Type,
                    name: container.Type,
                  })) ?? []
              }
              required
              isOpen={openDropdown === "container"}
              setIsOpen={() => handleSetOpenDropdown("container")}
              onSelect={handleSelectContainer}
              value={selectedContainer?.name || "Type"}
              placeholder="Type"
              error={
                formError?.includes("Container") && !selectedContainer?.name
              }
            />
            {formError?.includes("Container") && !selectedContainer?.name && (
              <p className="text-xs text-error">Please select a container</p>
            )}
          </div>
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        <div className="flex justify-end mb-4">
          {accessDetails && accessDetails[0]?.CanCreate === "1" && (
            <button
              className="flex items-center px-4 py-2 bg-success text-white rounded-xl hover:opacity-80"
              onClick={() => setAddButton(true)}
            >
              <AddRounded className="mr-2" /> Add
            </button>
          )}
        </div>
        <div className="relative w-full overflow-x-auto border-2 rounded-lg">
          <table className="w-full border-collapse table-auto">
            <thead>
              <tr className="bg-tablehead border-b-2 text-left">
                <th
                  className="p-1 cursor-pointer"
                  onClick={() => handleSort("type")}
                >
                  Type {sortBy === "type" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                {roleCode === "USERROLE_SYSTEMADMIN" && (
                  <th
                    className="cursor-pointer p-1"
                    onClick={() => handleSort("client")}
                  >
                    Client
                    {sortBy === "client" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                )}
                <th
                  className="cursor-pointer p-1"
                  onClick={() => handleSort("numberofunits")}
                >
                  Number of Units{" "}
                  {sortBy === "numberofunits" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="cursor-pointer p-1"
                  onClick={() => handleSort("size")}
                >
                  Size {sortBy === "size" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="cursor-pointer p-1"
                  onClick={() => handleSort("smallunit")}
                >
                  Small Unit{" "}
                  {sortBy === "smallunit" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="cursor-pointer p-1"
                  onClick={() => handleSort("description")}
                >
                  Description
                  {sortBy === "description" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="cursor-pointer p-1"
                  onClick={() => handleSort("challanunit")}
                >
                  Challan Unit{" "}
                  {sortBy === "challanunit" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="cursor-pointer p-1"
                  onClick={() => handleSort("created")}
                >
                  Created{" "}
                  {sortBy === "created" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="cursor-pointer p-1"
                  onClick={() => handleSort("modified")}
                >
                  Modified{" "}
                  {sortBy === "modified" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="cursor-pointer p-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(containerList?.data.length ? containerList?.data.length : 0) >
              0 ? (
                containerList?.data.map((pack) => (
                  <tr key={pack.Id}>
                    <td className="border-b p-1">{pack.Type || "N/A"}</td>
                    {roleCode === "USERROLE_SYSTEMADMIN" && (
                      <td className="border-b p-1">
                        {pack.ClientName || "N/A"}
                      </td>
                    )}
                    <td className="border-b p-1">
                      {pack.NumberOfUnits || "N/A"}
                    </td>
                    <td className="border-b p-1">
                      {editingIndex === pack.Id ? (
                        <input
                          type="text"
                          value={editableData?.Size || ""}
                          onChange={(e) =>
                            setEditableData({
                              Id: pack.Id,
                              Size: e.target.value.toUpperCase(),
                              SmallUnit: editableData?.SmallUnit || "",
                              ChallanUnit:
                                editableData?.ChallanUnit || undefined,
                            })
                          }
                          className="w-32 border rounded p-1"
                        />
                      ) : (
                        pack.Size
                      )}
                    </td>
                    <td className="border-b p-1">
                      {editingIndex === pack.Id ? (
                        <input
                          type="text"
                          value={editableData?.SmallUnit || ""}
                          onChange={(e) =>
                            setEditableData({
                              Id: pack.Id,
                              Size: editableData?.Size || "",
                              SmallUnit: e.target.value.toUpperCase(),
                              ChallanUnit:
                                editableData?.ChallanUnit || undefined,
                            })
                          }
                          className="w-32 border rounded p-1"
                        />
                      ) : (
                        pack.SmallUnit
                      )}
                    </td>
                    <td className="border-b p-1">
                      {pack.Description || "N/A"}
                    </td>

                    <td className="border-b p-1">
                      {editingIndex === pack.Id ? (
                        <input
                          type="text"
                          value={editableData?.ChallanUnit || ""}
                          onChange={(e) =>
                            setEditableData({
                              Size: editableData?.Size || "",
                              Id: pack.Id,
                              ChallanUnit: e.target.value.toUpperCase(),
                              SmallUnit: editableData?.SmallUnit || "",
                            })
                          }
                          className="w-32 border rounded p-1"
                        />
                      ) : (
                        pack.ChallanUnit
                      )}
                    </td>
                    <td className="border-b p-1">{pack.Created || "N/A"}</td>
                    <td className="border-b p-1">{pack.Modified || "N/A"}</td>
                    <td className="border-b p-1">
                      {editingIndex === pack.Id ? (
                        <>
                          <button
                            onClick={handleSave}
                            className="mr-2 text-success"
                          >
                            <SaveRounded />
                          </button>
                          <button
                            onClick={handleCancel}
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
                                onClick={() => handleEditClick(pack)}
                                className="text-success"
                              >
                                <EditRounded />
                              </button>
                            )}

                          {accessDetails &&
                            accessDetails[0]?.CanDelete === "1" && (
                              <button
                                className="text-error"
                                onClick={() => handleDelete(pack.Id)}
                              >
                                <DeleteRounded />
                              </button>
                            )}
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-error ">
                    No containers available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {(containerList?.data.length ? containerList?.data.length : 0) > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(
            (containerList?.totalCount || 0) / itemsPerPage
          )}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
      {addButton && accessDetails && accessDetails[0]?.CanCreate === "1" && (
        <ContainerAddOverlay
          onOverlayClose={handleOverlayClose}
          onSuccess={handelSuccess}
        />
      )}
    </>
  );
}
