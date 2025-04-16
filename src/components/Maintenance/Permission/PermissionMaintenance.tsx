"use client";
import {
  AddOrUpdatePermissionPayloadInterface,
  RolePermission,
} from "@/types/Permission";
import React, { useEffect, useState } from "react";
import { useFetchPermission } from "@/app/hooks/permission/usePermissionList";
import { SaveRounded } from "@mui/icons-material";
import Pagination from "../../Pagination";
import { useAddOrUpdatePermission } from "@/app/hooks/permission/usePermissionAddOrUpdate";
import { toast } from "react-toastify";
import SearchInput from "../../SearchBox";
import { getCookie } from "cookies-next";
import { useDropdownList } from "@/app/hooks/globaldropdown/useGlobalDropdown";
import { useRoleList } from "@/app/hooks/role/useRoleList";

function Permission() {
  const authKey = getCookie("authKey") as string;

  const [permissions, setPermissions] = useState<RolePermission[]>([]);
  const [editedRows, setEditedRows] = useState<{
    [key: string]: AddOrUpdatePermissionPayloadInterface;
  }>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const itemsPerPage = 10;
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [selectedAccesslabelId, setSelectedAccesslabelId] =
    useState<string>("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [search, setSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [isAccesslabelSelected, setIsAccesslabel] = useState(false);
  const [isClientSelected, setIsClientSelected] = useState(false);
  const [isRoleSelected, setIsRoleSelected] = useState(false);

  const [systemAdminId, setSystemAdminId] = useState<string>("");

  const [roleCode, setRoleCode] = useState<string | null>(null);

  const { mutate: addOrUpdatePermission } = useAddOrUpdatePermission();

  const { data: roleList } = useRoleList(authKey || "", {
    limit: 0,
    clientId: selectedClientId || undefined,
  });

  const {
    data: permissionList,
    error: permissionError,
    isLoading: permissionLoading,
  } = useFetchPermission(authKey || "", {
    page: currentPage,
    limit: itemsPerPage,
    varsearch: searchTerm,
    roleid: selectedRoleId || systemAdminId,
    clientid: selectedClientId || undefined,
    accesslabelid: selectedAccesslabelId || undefined,
  });

  const { data: client } = useDropdownList("clients", search, filters);
  const { data: accesslabel } = useDropdownList(
    "accesslabeltypes",
    search,
    filters
  );
  useEffect(() => {
    if (permissionList?.data) {
      const formattedData = permissionList.data.map((item) => ({
        ...item,
        CanCreate: item.CanCreate === "1" ? "1" : "0",
        CanRead: item.CanRead === "1" ? "1" : "0",
        CanUpdate: item.CanUpdate === "1" ? "1" : "0",
        CanDelete: item.CanDelete === "1" ? "1" : "0",
      }));
      setPermissions(formattedData);
    }
    const RoleCode = localStorage.getItem("RoleCode");
    setRoleCode(RoleCode);
  }, [permissionList]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedClientId, selectedRoleId, searchTerm]);

  const togglePermission = (
    Id: string,
    permissionType: keyof Pick<
      AddOrUpdatePermissionPayloadInterface,
      "CanCreate" | "CanRead" | "CanUpdate" | "CanDelete"
    >
  ) => {
    const newValue =
      permissions.find((item) => item.Id === Id)?.[permissionType] === "1"
        ? "0"
        : "1";

    setPermissions((prevState) =>
      prevState.map((item) =>
        item.Id === Id ? { ...item, [permissionType]: newValue } : item
      )
    );

    setEditedRows((prev: any) => {
      const updatedRow = {
        ...permissions.find((item) => item.Id === Id),
        [permissionType]: newValue,
      };

      if (permissionType === "CanCreate") {
        updatedRow.CanRead =
          updatedRow.CanRead === "1" ? updatedRow.CanRead : "0";
        updatedRow.CanUpdate =
          updatedRow.CanUpdate === "1" ? updatedRow.CanUpdate : "0";
        updatedRow.CanDelete =
          updatedRow.CanDelete === "1" ? updatedRow.CanDelete : "0";
      }

      return {
        ...prev,
        [Id]: updatedRow,
      };
    });
  };

  useEffect(() => {
    if (roleList?.data) {
      const systemAdminDetails = roleList.data.filter(
        (role) => role.Code === "USERROLE_SYSTEMADMIN"
      );

      if (systemAdminDetails.length > 0) {
        setSystemAdminId(systemAdminDetails[0].Id);
      }
    }
  }, [roleList]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedClientId, selectedRoleId, searchTerm]);

  const handleSaveRow = (Id: string) => {
    const updatedRow = editedRows[Id];
    if (updatedRow) {
      const payload: AddOrUpdatePermissionPayloadInterface = {
        Id: Id,
        CanCreate: updatedRow.CanCreate,
        CanRead: updatedRow.CanRead,
        CanUpdate: updatedRow.CanUpdate,
        CanDelete: updatedRow.CanDelete,
      };

      addOrUpdatePermission(payload, {
        onSuccess: () => {
          toast.success(`Updated Successfully.`);
          setEditedRows((prev) => {
            const updatedEditedRows = { ...prev };
            delete updatedEditedRows[Id];
            return updatedEditedRows;
          });
        },
        onError: (error) => {
          if (error instanceof Error) {
            toast.error(`Error saving changes`);
          } else {
            toast.error(`Unknown error saving changes`);
          }
        },
      });
    }
  };

  const isRowEdited = (id: string) => {
    const currentRow = permissions.find((item) => item.Id === id);
    const originalRow = permissionList?.data.find(
      (item: RolePermission) => item.Id === id
    );
    return JSON.stringify(currentRow) !== JSON.stringify(originalRow);
  };

  const renderToggle = (
    Id: string,
    permissionType: keyof Pick<
      AddOrUpdatePermissionPayloadInterface,
      "CanCreate" | "CanRead" | "CanUpdate" | "CanDelete"
    >,
    value: string
  ) => (
    <div className="flex justify-center items-center space-x-2">
      <label
        className="flex items-center cursor-pointer"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="checkbox"
          checked={value === "1"}
          onChange={() => togglePermission(Id, permissionType)}
          className="hidden"
        />
        <span
          className={`toggle-switch w-10 h-5 flex items-center rounded-full p-1 cursor-pointer ${
            value === "1" ? "bg-success" : "bg-gray-300"
          }`}
        >
          <span
            className={`toggle-dot w-4 h-4 bg-white rounded-full shadow-md transform ${
              value === "1" ? "translate-x-5" : "translate-x-0"
            }`}
          ></span>
        </span>
      </label>
      <span>{value === "1" ? "Yes" : "No"}</span>
    </div>
  );

  const handleSelectRole = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedRoleId(selectedValue);

    setIsRoleSelected(selectedValue !== "");
  };

  const handleSelectClient = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedClientId(selectedValue);
    setSystemAdminId("");

    setIsClientSelected(selectedValue !== "");
  };

  const handleSelectAccessLabel = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    setSelectedAccesslabelId(selectedValue);
    setSystemAdminId("");

    setIsAccesslabel(selectedValue !== "");
  };

  return (
    <>
      <div className="w-full px-2 mt-4">
        <div className="flex items-center gap-4 mt-[-56px] pl-52 mb-10">
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
          {/* {isClientSelected && ( */}
          <select
            className="border border-gray-300 px-4 py-2 rounded-xl w-64"
            onChange={handleSelectRole}
            value={selectedRoleId}
            required
            disabled={!isClientSelected && roleCode === "USERROLE_SYSTEMADMIN"}
          >
            <option value="" disabled={selectedRoleId !== ""}>
              Select a Role
            </option>
            {isRoleSelected && <option value="">All</option>}
            {roleList?.data.map((role: any) => (
              <option key={role.Id} value={role.Id}>
                {role.Name}
              </option>
            ))}
          </select>
          {/* )} */}
          <select
            className="border border-gray-300 px-4 py-2 rounded-xl w-64"
            onChange={handleSelectAccessLabel}
            value={selectedAccesslabelId}
            required
          >
            <option value="" disabled={selectedAccesslabelId !== ""}>
              Select a Types
            </option>
            {isAccesslabelSelected && <option value="">All</option>}
            {accesslabel?.map((accesslabel: any) => (
              <option key={accesslabel.Id} value={accesslabel.Id}>
                {accesslabel.Name}
              </option>
            ))}
          </select>
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-tablehead">
                <th className="border px-4 py-2">SNo</th>
                <th className="border px-4 py-2 text-left">
                  Access Label Name
                </th>
                <th className="border px-4 py-2 text-left">Role Name</th>
                {roleCode === "USERROLE_SYSTEMADMIN" && selectedClientId && (
                  <th className="border px-4 py-2 text-center">Client Name</th>
                )}
                <th className="border px-4 py-2 text-left">
                  Access Label Type
                </th>
                <th className="border px-4 py-2 text-center">Create</th>
                <th className="border px-4 py-2 text-center">Read</th>
                <th className="border px-4 py-2 text-center">Update</th>
                <th className="border px-4 py-2 text-center">Delete</th>
                <th className="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {permissionLoading ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-error">
                    Loading permission...
                  </td>
                </tr>
              ) : permissionError ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-error">
                    Error loading permission: {permissionError.message}
                  </td>
                </tr>
              ) : !Array.isArray(permissionList?.data) ||
                permissionList.data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-error">
                    No permission found.
                  </td>
                </tr>
              ) : (
                permissions.map((item, index) => (
                  <tr key={item.Id}>
                    <td className="border px-4 py-2 text-center">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="border px-4 py-2">{item.AccesslabelName}</td>
                    <td className="border px-4 py-2">{item.RoleName}</td>
                    {roleCode === "USERROLE_SYSTEMADMIN" &&
                      selectedClientId && (
                        <td className="border px-4 py-2 text-center">
                          {item.ClientName}
                        </td>
                      )}
                    <td className="border px-4 py-2">{item.AccessLabelType}</td>

                    <td className="border px-4 py-2 text-center">
                      {renderToggle(item.Id, "CanCreate", item.CanCreate)}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {renderToggle(item.Id, "CanRead", item.CanRead)}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {renderToggle(item.Id, "CanUpdate", item.CanUpdate)}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {renderToggle(item.Id, "CanDelete", item.CanDelete)}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        className={`mr-2 text-success ${
                          isRowEdited(item.Id)
                            ? ""
                            : "opacity-50 cursor-not-allowed"
                        }`}
                        onClick={() => handleSaveRow(item.Id)}
                        disabled={!isRowEdited(item.Id)}
                      >
                        <SaveRounded />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {(permissionList?.data.length ? permissionList?.data.length : 0) > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(
            (permissionList?.totalCount || 0) / itemsPerPage
          )}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </>
  );
}

export default Permission;
