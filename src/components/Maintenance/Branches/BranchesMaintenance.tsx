import React, { useEffect, useState } from "react";
import {
  AddRounded,
  CancelRounded,
  DeleteRounded,
  EditRounded,
  SaveRounded,
} from "@mui/icons-material";

import SearchInput from "@/components/SearchBox";
import { AddOrUpdateBranchPayloadInterface } from "@/types/BranchInterface";
import Pagination from "@/components/Pagination";
import BranchesMaintenanceAddOverlay from "./BranchesMaintenanceAddOverlay";
import { toast } from "react-toastify";
import { useBranchGetList } from "@/app/hooks/branches/useBranchGetList";
import { SidebarSectionInterface } from "@/types/ComponentInterface";
import { getCookie } from "cookies-next";
import { useDeleteBranchDetail } from "@/app/hooks/branches/branch/useBranchDelete";
import { useAddOrUpdateBranch } from "@/app/hooks/branches/branch/useBranchAddOrUpdate";
import { useDropdownList } from "@/app/hooks/globaldropdown/useGlobalDropdown";
function BranchesMaintenanceContainer() {
  const authKey = getCookie("authKey") as string;

  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [addButton, setAddButton] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("modified");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [editableBranch, setEditableBranch] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [branches, setBranches] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [menuItems, setMenuItems] = useState<SidebarSectionInterface[] | null>(
    null
  );
  const [roleCode, setRoleCode] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const itemsPerPage = 10;
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [search, setSearch] = useState("");
  const [isClientSelected, setIsClientSelected] = useState(false);
  const { mutate: deleteBranchDetails } = useDeleteBranchDetail();
  const { mutate: addOrUpdateBranch } = useAddOrUpdateBranch();
  const {
    data: branchData,
    error: branchError,
    isLoading: branchLoading,
  } = useBranchGetList(authKey || "", {
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    varsortby: sortBy,
    varsortorder: sortOrder,
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
            (dropdown) => dropdown.Name === "Branch"
          );
        }
        return [];
      });
    }
    return [];
  });

  const totalCount = branchData?.totalCount || 0;
  const data = branchData?.data || [];

  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil(totalCount / itemsPerPage)
  );

  const handleSortChange = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleSelectBranch = (id: string) => {
    setSelectedBranchId(id);
  };

  const clearSelectedBranch = () => {
    setSelectedBranchId(null);
  };

  const handleEditBranch = (id: string, branch: any) => {
    setEditingBranchId(id);
    setEditableBranch({ ...branch });
  };

  const handleSaveBranch = async () => {
    if (
      editableBranch?.MobileNumber &&
      editableBranch.MobileNumber.length !== 10
    ) {
      toast.error("Mobile Number should be exactly 10 digits.", {
        position: "top-right",
      });
      return;
    }
    if (
      editableBranch?.PanNumber &&
      editableBranch.PanNumber.length !== 9 &&
      editableBranch.PanNumber.length !== 10
    ) {
      toast.error("Pan Number should be exactly 9 or 10 digits.", {
        position: "top-right",
      });
      return;
    }
    if (
      editableBranch?.LandlineNumber &&
      editableBranch.LandlineNumber.length !== 9 &&
      editableBranch.LandlineNumber.length !== 10
    ) {
      toast.error("Landline Number should be exactly 9 or 10 digits.", {
        position: "top-right",
      });
      return;
    }
    const payload: AddOrUpdateBranchPayloadInterface = {
      Id: editingBranchId || "",
      Name: editableBranch?.Name,
      Address: editableBranch?.Address,
      EmailAddress: editableBranch?.EmailAddress,
      MobileNumber: editableBranch?.MobileNumber,
      LandlineNumber: editableBranch?.LandlineNumber,
      IsEntryPoint: editableBranch?.IsEntryPoint,
    };
    try {
      await addOrUpdateBranch(payload);

      setEditingBranchId(null);
      setEditableBranch(null);
      setSortBy("modified");
      setSortOrder("desc");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Error updating branch: ${error.message}`);
      } else {
        toast.error("Unknown error updating branch");
      }
    }
  };
  const handleDeleteBranch = (id: string) => {
    toast(({ closeToast }) => (
      <div>
        <p className="text-white">
          Are you sure you want to delete this branch?
        </p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={async () => {
              try {
                await deleteBranchDetails({
                  Id: id,
                  AuthKey: authKey || "",
                });

                setBranches((prevBranch) =>
                  prevBranch.filter((branch) => branch.Id !== id)
                );

                closeToast();
              } catch (error: any) {
                toast.error("Failed to delete branch", {
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
  const handleCancelBranch = () => {
    setEditingBranchId(null);
    setEditableBranch(null);
  };

  const handleOverlayClose = () => {
    setAddButton(false);
  };

  const handelSuccess = async (newBranch: any) => {
    if (newBranch) {
      setBranches((prevBranches) => [newBranch, ...prevBranches]);
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
                onClick={() => setAddButton(!addButton)}
              >
                Add
                <AddRounded />
              </button>
            )}
          </div>

          <div className="overflow-x-auto overflow-y-auto border-2 rounded-lg relative top-[-5px]">
            <table className="w-full border-collapse table-auto">
              <thead>
                <tr className="bg-tablehead border-b-2 text-left">
                  <th
                    className="cursor-pointer text-left border-b p-2"
                    onClick={() => handleSortChange("name")}
                  >
                    Name{" "}
                    {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  {roleCode === "USERROLE_SYSTEMADMIN" && (
                    <th
                      className="cursor-pointer text-left border-b p-2"
                      onClick={() => handleSortChange("client")}
                    >
                      Client{" "}
                      {sortBy === "client" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                  )}
                  <th
                    className="cursor-pointer text-left border-b p-2"
                    onClick={() => handleSortChange("address")}
                  >
                    Address{" "}
                    {sortBy === "address" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer text-left border-b p-2 "
                    onClick={() => handleSortChange("emailaddress")}
                  >
                    EmailAddress{" "}
                    {sortBy === "emailaddress" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer text-left border-b p-2 "
                    onClick={() => handleSortChange("mobilenumber")}
                  >
                    Mobile No{" "}
                    {sortBy === "mobilenumber" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer text-left border-b p-2 "
                    onClick={() => handleSortChange("landlinenumber")}
                  >
                    Landline No{" "}
                    {sortBy === "landlinenumber" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer text-left border-b p-2"
                    onClick={() => handleSortChange("entrypoint")}
                  >
                    Entry Point
                    {sortBy === "entrypoint" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer text-left border-b p-2 "
                    onClick={() => handleSortChange("created")}
                  >
                    Created{" "}
                    {sortBy === "created" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer text-left border-b p-2 "
                    onClick={() => handleSortChange("modified")}
                  >
                    Modified{" "}
                    {sortBy === "modified" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>

              {branchLoading ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-error">
                    Loading branches...
                  </td>
                </tr>
              ) : branchError ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-error">
                    Error loading branches:
                  </td>
                </tr>
              ) : !Array.isArray(branchData?.data) ||
                branchData.data.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-error">
                    No branches found.
                  </td>
                </tr>
              ) : (
                branchData?.data?.map((branch) => (
                  <tr
                    className={`border-b hover:bg-gray-100 ${
                      branch.Id === selectedBranchId ? "bg-blue-100" : ""
                    }`}
                    key={branch.Id}
                  >
                    <td className="p-1 text-left">
                      {editingBranchId === branch.Id ? (
                        <input
                          type="text"
                          value={editableBranch?.Name || ""}
                          onChange={(e) =>
                            setEditableBranch((prev: any) => ({
                              ...prev!,
                              Name: e.target.value,
                            }))
                          }
                          className="border p-2 rounded"
                        />
                      ) : (
                        branch.Name
                      )}
                    </td>
                    {roleCode === "USERROLE_SYSTEMADMIN" && (
                      <td className="p-1 text-left">{branch.ClientName} </td>
                    )}
                    <td className="p-1 text-left">
                      {editingBranchId === branch.Id ? (
                        <input
                          type="text"
                          value={editableBranch?.Address || ""}
                          onChange={(e) =>
                            setEditableBranch((prev: any) => ({
                              ...prev!,
                              Address: e.target.value,
                            }))
                          }
                          className="border p-2 rounded"
                        />
                      ) : (
                        branch.Address
                      )}
                    </td>
                    <td className="p-1 text-left">
                      {editingBranchId === branch.Id ? (
                        <input
                          type="text"
                          value={editableBranch?.EmailAddress || ""}
                          onChange={(e) =>
                            setEditableBranch((prev: any) => ({
                              ...prev!,
                              EmailAddress: e.target.value,
                            }))
                          }
                          className="border p-2 rounded"
                        />
                      ) : (
                        branch.EmailAddress
                      )}
                    </td>
                    <td className="p-1 text-left">
                      {editingBranchId === branch.Id ? (
                        <input
                          type="text"
                          value={editableBranch?.MobileNumber || ""}
                          maxLength={10}
                          onChange={(e) => {
                            const value = e.target.value;
                            const numericValue = value.replace(/\D/g, "");
                            if (numericValue.length <= 10) {
                              setEditableBranch((prev: any) => ({
                                ...prev!,
                                MobileNumber: numericValue,
                              }));
                            }
                          }}
                          className="border p-2 rounded"
                        />
                      ) : (
                        branch.MobileNumber
                      )}
                    </td>
                    <td className="p-1 text-left">
                      {editingBranchId === branch.Id ? (
                        <input
                          type="text"
                          value={editableBranch?.LandlineNumber || ""}
                          maxLength={10}
                          onChange={(e) => {
                            const value = e.target.value;
                            const numericValue = value.replace(/\D/g, "");
                            if (numericValue.length <= 10) {
                              setEditableBranch((prev: any) => ({
                                ...prev!,
                                LandlineNumber: numericValue,
                              }));
                            }
                          }}
                          className="border p-2 rounded"
                        />
                      ) : (
                        branch.LandlineNumber
                      )}
                    </td>
                    <td className="p-1 text-left">
                      {editingBranchId === branch.Id ? (
                        <div className="flex justify-left items-left space-x-4">
                          <label
                            className="flex items-left cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={editableBranch?.IsEntryPoint}
                              onChange={(e) =>
                                setEditableBranch({
                                  ...editableBranch,
                                  IsEntryPoint: e.target.checked,
                                })
                              }
                              className="toggle-checkbox hidden"
                            />
                            <span
                              className={`toggle-switch w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                                editableBranch?.IsEntryPoint
                                  ? "bg-success"
                                  : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`toggle-dot w-4 h-4 bg-white rounded-full shadow-md transform ${
                                  editableBranch?.IsEntryPoint
                                    ? "translate-x-5"
                                    : "translate-x-0"
                                }`}
                              ></span>
                            </span>
                          </label>
                          <span>
                            {editableBranch?.IsEntryPoint ? "Yes" : "No"}
                          </span>
                        </div>
                      ) : branch.IsEntryPoint ? (
                        "Yes"
                      ) : (
                        "No"
                      )}
                    </td>

                    <td className="p-1 text-left">{branch.Created}</td>
                    <td className="p-1 text-left">{branch.Modified}</td>
                    <td className="p-1 flex gap-2 text-left">
                      {editingBranchId === branch.Id ? (
                        <>
                          <button
                            onClick={handleSaveBranch}
                            className="mr-2 text-success"
                          >
                            <SaveRounded />
                          </button>
                          <button
                            onClick={handleCancelBranch}
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
                                  handleEditBranch(branch.Id || "", branch)
                                }
                                className="mr-2 text-success"
                              >
                                <EditRounded />
                              </button>
                            )}
                          {accessDetails &&
                            accessDetails[0]?.CanDelete === "1" && (
                              <button
                                onClick={() =>
                                  handleDeleteBranch(branch.Id || "")
                                }
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
            </table>
          </div>
        </div>
      </div>
      {(branchData?.data.length ? branchData?.data.length : 0) > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil((branchData?.totalCount || 0) / itemsPerPage)}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
      {addButton && accessDetails && accessDetails[0]?.CanCreate === "1" && (
        <BranchesMaintenanceAddOverlay
          onOverlayClose={handleOverlayClose}
          onSuccess={handelSuccess}
        />
      )}
    </>
  );
}

export default BranchesMaintenanceContainer;
