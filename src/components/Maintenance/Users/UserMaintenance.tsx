import React, { useState, useEffect } from "react";
import {
  AddRounded,
  EditRounded,
  DeleteRounded,
  SaveRounded,
  CancelRounded,
} from "@mui/icons-material";
import { useUserList } from "@/app/hooks/users/useUserList";
import { toast } from "react-toastify";

import SearchInput from "@/components/SearchBox";
import UserAddOverlay from "./UserMaintenanceAddOverlay";
import { useDeleteUserMaintenance } from "@/app/hooks/user/useUserDelete";
import { useAddOrUpdateUserMaintenance } from "@/app/hooks/user/useUserAddOrUpdate";
import { AddOrUpdateUserPayloadInterface } from "@/types/UserInterface";
import Pagination from "@/components/Pagination";
import TableHeader from "@/components/TableHeader";
import { SidebarSectionInterface } from "@/types/ComponentInterface";
import { getCookie } from "cookies-next";
import { useDropdownList } from "@/app/hooks/globaldropdown/useGlobalDropdown";

function UserMaintenanceContainer() {
  const authKey = getCookie("authKey") as string;

  const [addbutton, setAddButton] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editableUser, setEditableUser] = useState<any | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<SidebarSectionInterface[] | null>(
    null
  );
  const itemsPerPage = 10;
  const [roleCode, setRoleCode] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("created");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { mutate: deleteUsers } = useDeleteUserMaintenance();
  const { mutate: addOrUpdateUser } = useAddOrUpdateUserMaintenance();
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [search, setSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [isClientSelected, setIsClientSelected] = useState(false);

  const {
    data: userList,
    error: userError,
    isLoading: userLoading,
  } = useUserList(authKey || "", {
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    varsortby: sortBy,
    varsortorder: sortOrder,
    departmentCode: "",
    clientid: selectedClientId || undefined,
  });
  const { data: client } = useDropdownList("clients", search, filters);

  useEffect(() => {
    if (userList) {
      setUsers(userList.data);
    }
    const RoleCode = localStorage.getItem("RoleCode");
    setRoleCode(RoleCode);
  }, [userList]);

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
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedClientId, searchTerm, sortBy, sortOrder]);

  const accessDetails = menuItems?.flatMap((menu) => {
    if (menu.Name === "Maintenance") {
      return menu.SideBarDropdowns?.flatMap((child) => {
        if (child.Name === "User" && child.PageDropdowns) {
          return child.PageDropdowns.filter(
            (dropdown) => dropdown.Name === "Employee"
          );
        }
        return [];
      });
    }
    return [];
  });

  const totalCount = userList?.totalCount || 0;
  const data = userList?.data || [];

  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil(totalCount / itemsPerPage)
  );

  const handleEditUser = (userId: string, user: any) => {
    setEditingUserId(userId);
    setEditableUser({ ...user });
  };

  const handleSaveUser = async () => {
    if (editableUser?.MobileNumber && editableUser.MobileNumber.length !== 10) {
      toast.error("Mobile Number should be exactly 10 digits.", {
        position: "top-right",
      });
      return;
    }
    if (
      editableUser?.LandlineNumber &&
      editableUser.LandlineNumber.length !== 9 &&
      editableUser.LandlineNumber.length !== 10
    ) {
      toast.error("Landline Number should be exactly 9 or 10 digits.", {
        position: "top-right",
      });
      return;
    }
    const payload: AddOrUpdateUserPayloadInterface = {
      Id: editingUserId || "",
      FirstName: editableUser?.FirstName,
      LastName: editableUser?.LastName,
      Address: editableUser?.Address,
      EmailAddress: editableUser?.EmailAddress,
      MobileNumber: editableUser?.MobileNumber,
      LandlineNumber: editableUser?.LandlineNumber,
      Password: editableUser?.Password,
    };

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.Id === editingUserId ? { ...user, ...editableUser } : user
      )
    );

    try {
      await addOrUpdateUser(payload);

      setEditingUserId(null);
      setEditableUser(null);
      setSortBy("modified");
      setSortOrder("desc");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Error updating user: ${error.message}`);
      } else {
        toast.error("Unknown error updating user.");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditableUser(null);
  };

  const handleOverlayClose = () => {
    setAddButton(false);
  };

  const handleDelete = (id: string) => {
    toast(({ closeToast }) => (
      <div>
        <p className="text-white">Are you sure you want to delete this user?</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={async () => {
              try {
                await deleteUsers({
                  Id: id,
                  AuthKey: authKey || "",
                });

                setUsers((prevUsers) =>
                  prevUsers.filter((user) => user.Id !== id)
                );

                toast.success("User deleted successfully!");
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
  const handleSortChange = (column: string) => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortBy(column);
    setSortOrder(newSortOrder);
  };

  const handelSuccess = async (newUser: any) => {
    if (newUser) {
      setUsers((prevUsers) => [newUser, ...prevUsers]);
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
      <TableHeader
        tableTitle="User Maintenance"
        dataTitle="Users"
        button={true}
        handleSortChange={() => {}}
        sortby="username"
        sortorder="asc"
      />

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
                className="btn bg-success rounded-xl px-4 py-2 text-white flex items-center md:justify-around mb-6"
                type="button"
                onClick={() => setAddButton(!addbutton)}
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
                    className="cursor-pointer text-left border-b p-2 text-sm"
                    onClick={() => handleSortChange("staffnumber")}
                  >
                    Staff Number
                    {sortBy === "staffnumber" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer text-left border-b p-2 text-sm"
                    onClick={() => handleSortChange("firstname")}
                  >
                    First Name
                    {sortBy === "firstname" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer text-left border-b p-2 text-sm"
                    onClick={() => handleSortChange("lastname")}
                  >
                    Last Name
                    {sortBy === "lastname" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer text-left border-b p-2 text-sm"
                    onClick={() => handleSortChange("department")}
                  >
                    Department
                    {sortBy === "department" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer text-left border-b p-2 text-sm"
                    onClick={() => handleSortChange("address")}
                  >
                    Address
                    {sortBy === "address" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer text-left border-b p-2 text-sm"
                    onClick={() => handleSortChange("mobilenumber")}
                  >
                    Mobile No
                    {sortBy === "mobilenumber" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer text-left border-b p-2 text-sm"
                    onClick={() => handleSortChange("landlinenumber")}
                  >
                    Landline No
                    {sortBy === "landlinenumber" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>

                  <th
                    className="cursor-pointer text-left border-b p-2 text-sm"
                    onClick={() => handleSortChange("emailaddress")}
                  >
                    Email Address
                    {sortBy === "emailaddress" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>

                  {roleCode === "USERROLE_SYSTEMADMIN" && (
                    <th
                      className="cursor-pointer text-center border-b p-2 text-sm"
                      onClick={() => handleSortChange("clientname")}
                    >
                      Client
                      {sortBy === "clientname" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                  )}
                  {roleCode === "USERROLE_SYSTEMADMIN" && (
                    <th
                      className="cursor-pointer text-center border-b p-2 text-sm"
                      onClick={() => handleSortChange("rolename")}
                    >
                      Role
                      {sortBy === "rolename" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                  )}

                  <th className="cursor-pointer text-left border-b p-2 text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {userLoading ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-error">
                      Loading users...
                    </td>
                  </tr>
                ) : userError ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-error">
                      Error loading users: {userError.message}
                    </td>
                  </tr>
                ) : !Array.isArray(userList?.data) ||
                  userList.data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-error">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      className={`border-b hover:bg-gray-50 ${
                        user.Id === selectedUserId ? "bg-blue-100" : ""
                      }`}
                      key={user.Id}
                    >
                      <td className="text-left">{user.StaffNumber || "NA"}</td>
                      <td className="p-1 text-left">
                        {editingUserId === user.Id ? (
                          <input
                            type="text"
                            value={editableUser?.FirstName || ""}
                            onChange={(e) =>
                              setEditableUser({
                                ...editableUser,
                                FirstName: e.target.value,
                              })
                            }
                            className="border p-2 rounded"
                          />
                        ) : (
                          user.FirstName
                        )}
                      </td>
                      <td className="p-1 text-left">
                        {editingUserId === user.Id ? (
                          <input
                            type="text"
                            value={editableUser?.LastName || ""}
                            onChange={(e) =>
                              setEditableUser({
                                ...editableUser,
                                LastName: e.target.value,
                              })
                            }
                            className="border p-2 rounded"
                          />
                        ) : (
                          user.LastName
                        )}
                      </td>
                      <td className="p-1 text-left">
                        {" "}
                        {user.DepartmentName || "NA"}
                      </td>
                      <td className="p-1 text-left">
                        {editingUserId === user.Id ? (
                          <input
                            type="text"
                            value={editableUser?.Address || ""}
                            onChange={(e) =>
                              setEditableUser({
                                ...editableUser,
                                Address: e.target.value,
                              })
                            }
                            className="border p-2 rounded"
                          />
                        ) : (
                          user.Address
                        )}
                      </td>

                      <td className="p-1 text-left">
                        {editingUserId === user.Id ? (
                          <input
                            type="text"
                            value={editableUser?.MobileNumber || ""}
                            maxLength={10}
                            onChange={(e) => {
                              const value = e.target.value;
                              const numericValue = value.replace(/\D/g, "");
                              if (numericValue.length <= 10) {
                                setEditableUser((prev: any) => ({
                                  ...prev!,
                                  MobileNumber: numericValue,
                                }));
                              }
                            }}
                            className="border p-2 rounded"
                          />
                        ) : (
                          user.MobileNumber
                        )}
                      </td>
                      <td className="p-1 text-left">
                        {editingUserId === user.Id ? (
                          <input
                            type="text"
                            value={editableUser?.LandlineNumber || ""}
                            maxLength={10}
                            onChange={(e) => {
                              const value = e.target.value;
                              const numericValue = value.replace(/\D/g, "");
                              if (numericValue.length <= 10) {
                                setEditableUser((prev: any) => ({
                                  ...prev!,
                                  LandlineNumber: numericValue,
                                }));
                              }
                            }}
                            className="border p-2 rounded"
                          />
                        ) : (
                          user.LandlineNumber
                        )}
                      </td>
                      <td className="text-left">{user.EmailAddress || "NA"}</td>
                      {roleCode === "USERROLE_SYSTEMADMIN" && (
                        <td className="text-center">
                          {user.ClientName || "NA"}
                        </td>
                      )}
                      {roleCode === "USERROLE_SYSTEMADMIN" && (
                        <td className="text-center">{user.RoleName || "NA"}</td>
                      )}

                      <td className="p-1 text-left flex gap-2">
                        {editingUserId === user.Id ? (
                          <>
                            <button
                              onClick={handleSaveUser}
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
                                  onClick={() => handleEditUser(user.Id, user)}
                                  className="mr-2 text-success"
                                >
                                  <EditRounded />
                                </button>
                              )}
                            {accessDetails &&
                              accessDetails[0]?.CanDelete === "1" && (
                                <button
                                  onClick={() => handleDelete(user.Id)}
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
          {(userList?.data.length ? userList?.data.length : 0) > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil((userList?.totalCount || 0) / itemsPerPage)}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
          {addbutton &&
            accessDetails &&
            accessDetails[0]?.CanCreate === "1" && (
              <UserAddOverlay
                onOverlayClose={handleOverlayClose}
                onSuccess={handelSuccess}
              />
            )}
        </div>
      </div>
    </>
  );
}

export default UserMaintenanceContainer;
