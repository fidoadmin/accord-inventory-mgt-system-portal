import React, { useEffect, useState } from "react";
import {
  AddRounded,
  CancelRounded,
  DeleteRounded,
  SaveRounded,
} from "@mui/icons-material";

import Pagination from "@/components/Pagination";
import EditRounded from "@mui/icons-material/EditRounded";
import { toast } from "react-toastify";
import { useDeleteCustomerMaintenance } from "@/app/hooks/customer/useCustomerDelete";
import { useAddOrUpdateCustomersMaintenance } from "@/app/hooks/customer/useCustomerAddOrUpdate";
import SearchInput from "@/components/SearchBox";
import { useCustomer } from "@/app/hooks/customer/useCustomerList";
import { AddOrUpdateCustomerPayloadInterface } from "@/types/CustomerInterface";
import { SidebarSectionInterface } from "@/types/ComponentInterface";
import { getCookie } from "cookies-next";
import { useDropdownList } from "@/app/hooks/globaldropdown/useGlobalDropdown";
import CustomerAddOverlay from "./CustomerMaintenanceAddOverlay";

const CustomerMaintenanceContainer = () => {
  const authKey = getCookie("authKey") as string;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("created");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const itemsPerPage = 15;
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [editableCompany, setEditableCompany] = useState<any | null>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<SidebarSectionInterface[] | null>(
    null
  );
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [isClientSelected, setIsClientSelected] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [search, setSearch] = useState("");
  const [roleCode, setRoleCode] = useState<string | null>(null);
  const [addButton, setAddButton] = useState<boolean>(false);
  const { mutate: deleteCustomer } = useDeleteCustomerMaintenance();
  const { mutate: addOrUpdateCustomer } = useAddOrUpdateCustomersMaintenance();
  const {
    data: CompanyData,
    error: CompanyError,
    isLoading: CompanyLoading,
  } = useCustomer(authKey || "", {
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    varsortby: sortBy,
    varsortorder: sortOrder,
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
  }, [selectedClientId, searchTerm, sortBy, sortOrder]);

  const accessDetails = menuItems?.flatMap((menu) => {
    if (menu.Name === "Maintenance") {
      return menu.SideBarDropdowns?.flatMap((child) => {
        if (child.Name === "User" && child.PageDropdowns) {
          return child.PageDropdowns.filter(
            (dropdown) => dropdown.Name === "Customer"
          );
        }
        return [];
      });
    }
    return [];
  });

  const totalCount = CompanyData?.totalCount || 0;
  const data = CompanyData?.data || [];

  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil(totalCount / itemsPerPage)
  );

  const handleEditCompany = (companyId: string, company: any) => {
    setEditingCompanyId(companyId);
    setEditableCompany({ ...company });
  };

  const handleSelectCompany = (companyId: string) => {
    setSelectedCompanyId(companyId);
  };

  const handleOverlayClose = () => {
    setAddButton(false);
  };
  const handleSortChange = (column: string) => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortBy(column);
    setSortOrder(newSortOrder);
  };
  const handleDeleteCompany = (id: string) => {
    toast(({ closeToast }) => (
      <div>
        <p className="text-white">
          Are you sure you want to delete this Customer?
        </p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={async () => {
              try {
                await deleteCustomer({
                  Id: id,
                  AuthKey: authKey || "",
                });

                setCompanies((prevCompany) =>
                  prevCompany.filter((company) => company.Id !== id)
                );

                closeToast();
              } catch (error: any) {
                toast.error("Failed to delete company", {
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

  const handleSaveCompany = async () => {
    if (
      editableCompany?.MobileNumber &&
      editableCompany.MobileNumber.length !== 10
    ) {
      toast.error("Mobile Number should be exactly 10 digits.", {
        position: "top-right",
      });
      return;
    }
    if (
      editableCompany?.PanNumber &&
      editableCompany.PanNumber.length !== 9 &&
      editableCompany.PanNumber.length !== 10
    ) {
      toast.error("Pan Number should be exactly 9 or 10 digits.", {
        position: "top-right",
      });
      return;
    }
    if (
      editableCompany?.LandlineNumber &&
      editableCompany.LandlineNumber.length !== 9 &&
      editableCompany.LandlineNumber.length !== 10
    ) {
      toast.error("Landline Number should be exactly 9 or 10 digits.", {
        position: "top-right",
      });
      return;
    }

    const payload: AddOrUpdateCustomerPayloadInterface = {
      Id: editingCompanyId,
      Name: editableCompany?.Name,
      Address: editableCompany?.Address,
      EmailAddress: editableCompany?.EmailAddress,
      MobileNumber: editableCompany?.MobileNumber,
      LandlineNumber: editableCompany?.LandlineNumber,
      PanNumber: editableCompany?.PanNumber,
      ClientId: editableCompany?.ClientId,
      BranchId: editableCompany?.BranchId,
      CompanyTypeId: editableCompany?.CompanyTypeId,
      IsBlackList: editableCompany?.IsBlackList,
    };

    try {
      if (!editableCompany.Name) {
        toast.error("Name cannot be empty.");
        return;
      }
      await addOrUpdateCustomer(payload);
      setEditingCompanyId(null);
      setEditableCompany(null);
      setSortBy("modified");
      setSortOrder("desc");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Error updating company: ${error.message}`);
      } else {
        toast.error("Unknown error updating company");
      }
    }
  };

  const handleCancelCompany = () => {
    setEditingCompanyId(null);
    setEditableCompany(null);
  };

  const handelSuccess = async (newCustomer: any) => {
    if (newCustomer) {
      setCompanies((prevCompany) => [newCustomer, ...prevCompany]);
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
                className="btn bg-success rounded-xl px-4 py-2 text-white flex items-center md:justify-around mb-6"
                type="button"
                onClick={() => setAddButton(!addButton)}
              >
                Add
                <AddRounded />
              </button>
            )}
          </div>

          <div className="overflow-x-auto border-2 rounded-lg  relative top-[-5px]">
            <table className="w-full border-collapse table-auto">
              <thead>
                <tr className="bg-tablehead border-b-2 text-left">
                  <th
                    className="cursor-pointer text-left border-b p-2 text-sm"
                    onClick={() => handleSortChange("name")}
                  >
                    Name
                    {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
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
                    onClick={() => handleSortChange("emailaddress")}
                  >
                    Email Address
                    {sortBy === "emailaddress" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  {roleCode === "USERROLE_SYSTEMADMIN" && (
                    <th
                      className="cursor-pointer text-left border-b p-2 text-sm"
                      onClick={() => handleSortChange("clientname")}
                    >
                      Client
                      {sortBy === "clientname" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                  )}
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
                    onClick={() => handleSortChange("pannumber")}
                  >
                    Pan Number
                    {sortBy === "pannumber" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer text-left border-b p-2 text-sm"
                    onClick={() => handleSortChange("isblacklist")}
                  >
                    Black List
                    {sortBy === "isblacklist" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>

                  <th
                    className="cursor-pointer text-left border-b p-2 text-sm"
                    onClick={() => handleSortChange("created")}
                  >
                    Created
                    {sortBy === "created" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer text-left border-b p-2 text-sm"
                    onClick={() => handleSortChange("modified")}
                  >
                    Modified
                    {sortBy === "modified" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="cursor-pointer text-left border-b p-2 text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {CompanyLoading ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-error">
                      Loading customers...
                    </td>
                  </tr>
                ) : CompanyError ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-error">
                      Error loading customers:
                    </td>
                  </tr>
                ) : !Array.isArray(CompanyData?.data) ||
                  CompanyData.data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-error ">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  CompanyData?.data.map((company) => (
                    <tr
                      className={`border-b hover:bg-gray-50 cursor-pointer ${
                        company.Id === selectedCompanyId ? "bg-blue-100" : ""
                      }`}
                      key={company.Id}
                    >
                      <td className="p-1 text-left truncate max-w-xs">
                        {editingCompanyId === company.Id ? (
                          <input
                            type="text"
                            value={editableCompany?.Name || ""}
                            onChange={(e) =>
                              setEditableCompany((prev: any) => ({
                                ...prev!,
                                Name: e.target.value,
                              }))
                            }
                            className="border p-1 rounded"
                          />
                        ) : (
                          company.Name
                        )}
                      </td>
                      <td className="p-1  text-left">
                        {editingCompanyId === company.Id ? (
                          <input
                            type="text"
                            value={editableCompany?.Address || ""}
                            onChange={(e) =>
                              setEditableCompany((prev: any) => ({
                                ...prev!,
                                Address: e.target.value,
                              }))
                            }
                            className="border p-1 rounded"
                          />
                        ) : (
                          company.Address
                        )}
                      </td>
                      <td className="p-1 text-left">
                        {editingCompanyId === company.Id ? (
                          <input
                            type="text"
                            value={editableCompany?.EmailAddress || ""}
                            onChange={(e) =>
                              setEditableCompany((prev: any) => ({
                                ...prev!,
                                EmailAddress: e.target.value,
                              }))
                            }
                            className="border p-1 rounded"
                          />
                        ) : (
                          company.EmailAddress
                        )}
                      </td>
                      {roleCode === "USERROLE_SYSTEMADMIN" && (
                        <td className="p-1 text-left">{company.ClientName}</td>
                      )}
                      <td className="p-1 text-left">
                        {editingCompanyId === company.Id ? (
                          <input
                            type="text"
                            value={editableCompany?.MobileNumber || ""}
                            maxLength={10}
                            onChange={(e) => {
                              const value = e.target.value;
                              const numericValue = value.replace(/\D/g, "");
                              if (numericValue.length <= 10) {
                                setEditableCompany((prev: any) => ({
                                  ...prev!,
                                  MobileNumber: numericValue,
                                }));
                              }
                            }}
                            className="border p-1 rounded"
                          />
                        ) : (
                          company.MobileNumber
                        )}
                      </td>
                      <td className="p-1 text-left">
                        {editingCompanyId === company.Id ? (
                          <input
                            type="text"
                            value={editableCompany?.LandlineNumber || ""}
                            maxLength={10}
                            onChange={(e) => {
                              const value = e.target.value;
                              const numericValue = value.replace(/\D/g, "");
                              if (numericValue.length <= 10) {
                                setEditableCompany((prev: any) => ({
                                  ...prev!,
                                  LandlineNumber: numericValue,
                                }));
                              }
                            }}
                            className="border p-1 rounded"
                          />
                        ) : (
                          company.LandlineNumber
                        )}
                      </td>
                      <td className="p-1 text-left">
                        {editingCompanyId === company.Id ? (
                          <input
                            type="text"
                            value={editableCompany?.PanNumber || ""}
                            maxLength={10}
                            onChange={(e) => {
                              const value = e.target.value;
                              const numericValue = value.replace(/\D/g, "");
                              if (numericValue.length <= 10) {
                                setEditableCompany((prev: any) => ({
                                  ...prev!,
                                  PanNumber: numericValue,
                                }));
                              }
                            }}
                            className="border p-1 rounded"
                          />
                        ) : (
                          company.PanNumber
                        )}
                      </td>
                      <td className="p-1 text-left">
                        {editingCompanyId === company.Id ? (
                          <div className="flex justify-left items-left space-x-4">
                            <label
                              className="flex items-left cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={editableCompany?.IsBlackList ?? false}
                                onChange={(e) =>
                                  setEditableCompany({
                                    ...editableCompany,
                                    IsBlackList: e.target.checked,
                                  })
                                }
                                className="toggle-checkbox hidden"
                              />
                              <span
                                className={`toggle-switch w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                                  editableCompany?.IsBlackList
                                    ? "bg-success"
                                    : "bg-gray-300"
                                }`}
                              >
                                <span
                                  className={`toggle-dot w-4 h-4 bg-white rounded-full shadow-md transform ${
                                    editableCompany?.IsBlackList
                                      ? "translate-x-5"
                                      : "translate-x-0"
                                  }`}
                                ></span>
                              </span>
                            </label>
                            <span>
                              {editableCompany?.IsBlackList ? "Yes" : "No"}
                            </span>
                          </div>
                        ) : company.IsBlackList ? (
                          "Yes"
                        ) : (
                          "No"
                        )}
                      </td>
                      <td className="p-1 text-left">{company.Created}</td>
                      <td className="p-1 text-left">{company.Modified}</td>
                      <td className="p-1 text-left">
                        {editingCompanyId === company.Id ? (
                          <>
                            <button
                              onClick={handleSaveCompany}
                              className="mr-2 text-success"
                            >
                              <SaveRounded />
                            </button>
                            <button
                              onClick={handleCancelCompany}
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
                                    handleEditCompany(company.Id || "", company)
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
                                    handleDeleteCompany(company.Id)
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
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {(CompanyData?.data.length ? CompanyData?.data.length : 0) > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil((CompanyData?.totalCount || 0) / itemsPerPage)}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}

      {addButton && accessDetails && accessDetails[0]?.CanCreate === "1" && (
        <CustomerAddOverlay
          onOverlayClose={handleOverlayClose}
          onSuccess={handelSuccess}
        />
      )}
    </>
  );
};

export default CustomerMaintenanceContainer;
