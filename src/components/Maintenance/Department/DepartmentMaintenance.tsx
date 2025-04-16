"use client";
import React, { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import Pagination from "@/components/Pagination";
import SearchInput from "@/components/SearchBox";
import {
  AddRounded,
  CancelRounded,
  DeleteRounded,
  EditRounded,
  SaveRounded,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { useDepartmentList } from "@/app/hooks/department/useDepartmentList";
import {
  AddOrUpdateDepartmentPayloadInterface,
  DepartmentDetailInterface,
} from "@/types/Department";
import { useDeleteDepartmentMaintenance } from "@/app/hooks/department/useDepartmentDelete";
import { useAddOrUpdateDepartmentMaintenance } from "@/app/hooks/department/useDepartmentAddOrUpdate";
import DepartmentAddOverlay from "./DepartmentMaintenanceAddOverlay";
import { SidebarSectionInterface } from "@/types/ComponentInterface";
import { useDropdownList } from "@/app/hooks/globaldropdown/useGlobalDropdown";

function DepartmentMaintenance() {
  const authKey = getCookie("authKey") as string;
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [addbutton, setAddButton] = useState(false);
  const [sortBy, setSortBy] = useState<string>("modified");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [roles, setRoles] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<SidebarSectionInterface[] | null>(
    null
  );
  const [isClientSelected, setIsClientSelected] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [roleCode, setRoleCode] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [search, setSearch] = useState("");
  const [editableRole, setEditableRole] =
    useState<DepartmentDetailInterface | null>(null);
  const { mutate: deleteDepartment } = useDeleteDepartmentMaintenance();
  const { mutate: addOrUpdateDepartment } =
    useAddOrUpdateDepartmentMaintenance();

  const {
    data: departmentList,
    error: departmentError,
    isLoading: departmentLoading,
  } = useDepartmentList(authKey || "", {
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    sortBy,
    sortOrder,
    clientId: selectedClientId || undefined,
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
  }, [selectedClientId, searchTerm, sortBy, sortOrder]);

  const accessDetails = menuItems?.flatMap((menu) => {
    if (menu.Name === "Maintenance") {
      return menu.SideBarDropdowns?.flatMap((child) => {
        if (child.Name === "Organization" && child.PageDropdowns) {
          return child.PageDropdowns.filter(
            (dropdown) => dropdown.Name === "Department"
          );
        }
        return [];
      });
    }
    return [];
  });
  const handleSortChange = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };
  const handleOverlayClose = () => {
    setAddButton(false);
  };
  const handleSaveRole = async () => {
    if (editableRole) {
      const payload: AddOrUpdateDepartmentPayloadInterface = {
        Id: editingRoleId || "",
        Name: editableRole?.Name,
        ParentId: editableRole?.ParentId,
      };

      try {
        await addOrUpdateDepartment(payload);
        setEditingRoleId(null);
        setEditableRole(null);
        setSortBy("modified");
        setSortOrder("desc");
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(`Error updating role: ${error.message}`);
        } else {
          toast.error("Unknown error updating role.");
        }
      }
    }
  };
  const handleEditRole = (roleId: string, role: any) => {
    setEditingRoleId(roleId);
    setEditableRole({ ...role });
  };
  const handleCancelRole = () => {
    setEditingRoleId(null);
    setEditableRole(null);
  };
  const handleDeleteRole = (id: string) => {
    toast(({ closeToast }) => (
      <div>
        <p className="text-white">
          Are you sure you want to delete this Department?
        </p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={async () => {
              try {
                await deleteDepartment({
                  Id: id,
                  AuthKey: authKey || "",
                });

                setRoles((prevRole) =>
                  prevRole.filter((role) => role.Id !== id)
                );

                closeToast();
              } catch (error: any) {
                toast.error("Failed to delete department", {
                  position: "top-right",
                });
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
  const handelSuccess = async (newRole: any) => {
    if (newRole) {
      setRoles((prevRoles) => [newRole, ...prevRoles]);
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
        <div className="flex items-center gap-4 mt-[-56px] pl-48">
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
        <div className="relative w-full">
          <div className="py-1 flex justify-end mb-2">
            {accessDetails && accessDetails[0]?.CanCreate === "1" && (
              <button
                className="btn bg-success rounded-xl px-4 py-2 text-white flex items-center"
                onClick={() => setAddButton(!addbutton)}
              >
                Add
                <AddRounded />
              </button>
            )}
          </div>
          <div className="overflow-x-auto border-2 rounded-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-tablehead border-b-2 text-left">
                  <th
                    className="cursor-pointer p-2"
                    onClick={() => handleSortChange("name")}
                  >
                    Sub Department
                    {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
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
                    className="cursor-pointer p-2"
                    onClick={() => handleSortChange("maindepartment")}
                  >
                    Main Department{" "}
                    {sortBy === "maindepartment" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer p-2"
                    onClick={() => handleSortChange("created")}
                  >
                    Created{" "}
                    {sortBy === "created" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer p-2"
                    onClick={() => handleSortChange("modified")}
                  >
                    Modified{" "}
                    {sortBy === "modified" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {departmentLoading ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-error">
                      Loading department...
                    </td>
                  </tr>
                ) : departmentError ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-error">
                      Error loading department: {departmentError.message}
                    </td>
                  </tr>
                ) : !Array.isArray(departmentList?.data) ||
                  departmentList.data.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-error">
                      No department found.
                    </td>
                  </tr>
                ) : (
                  departmentList?.data.map((role) => (
                    <tr
                      className={`border-b hover:bg-gray-100 ${
                        role.Id === selectedRoleId ? "bg-blue-100" : ""
                      }`}
                      key={role.Id}
                    >
                      <td className="p-1">
                        {editingRoleId === role.Id ? (
                          <input
                            type="text"
                            value={editableRole?.Name || ""}
                            onChange={(e) =>
                              setEditableRole((prev) => ({
                                ...prev!,
                                Name: e.target.value,
                              }))
                            }
                            className="border p-2 rounded"
                          />
                        ) : (
                          role.Name
                        )}
                      </td>
                      {roleCode === "USERROLE_SYSTEMADMIN" && (
                        <td className="p-1">{role.ClientName}</td>
                      )}
                      <td className="p-1">{role.ParentName}</td>
                      <td className="p-1">{role.Created}</td>
                      <td className="p-1">{role.Modified}</td>
                      <td className="p-1 flex gap-2">
                        {editingRoleId === role.Id ? (
                          <>
                            <button
                              onClick={handleSaveRole}
                              className="mr-2 text-success"
                            >
                              <SaveRounded />
                            </button>
                            <button
                              onClick={handleCancelRole}
                              className="mr-2 text-error"
                            >
                              <CancelRounded />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() =>
                                handleEditRole(role.Id || "", role)
                              }
                              className="mr-2 text-success"
                            >
                              <EditRounded />
                            </button>
                            <button
                              onClick={() => handleDeleteRole(role.Id)}
                              className="mr-2 text-error"
                            >
                              <DeleteRounded />
                            </button>
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
      </div>
      {(departmentList?.data.length ? departmentList?.data.length : 0) > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(
            (departmentList?.totalCount || 0) / itemsPerPage
          )}
          onPageChange={setCurrentPage}
        />
      )}
      {addbutton && accessDetails && accessDetails[0]?.CanCreate === "1" && (
        <DepartmentAddOverlay
          onOverlayClose={handleOverlayClose}
          onSuccess={handelSuccess}
        />
      )}
    </>
  );
}

export default DepartmentMaintenance;
