import React, { useEffect, useState } from "react";
import {
  AddRounded,
  CancelRounded,
  DeleteRounded,
  SaveRounded,
} from "@mui/icons-material";

import { useCompanyList } from "@/app/hooks/companies/useCompanyList";
import CompanyAddOverlay from "./CompaniesMaintenanceAddOverlay";
import Pagination from "@/components/Pagination";
import {
  AddOrUpdateCompanyPayloadInterface,
  CompanyDetailInterface,
} from "@/types/CompanyInterface";
import EditRounded from "@mui/icons-material/EditRounded";
import { toast } from "react-toastify";
import SearchInput from "@/components/SearchBox";
import { useDeleteCompanyMaintenance } from "@/app/hooks/company/useCompanyDelete";
import { useAddOrUpdateCompaniesMaintenance } from "@/app/hooks/company/useCompanyAddOrUpdate";
import { SidebarSectionInterface } from "@/types/ComponentInterface";
import { getCookie } from "cookies-next";
import { useDropdownList } from "@/app/hooks/globaldropdown/useGlobalDropdown";

const CompaniesMaintenanceContainer = () => {
  const authKey = getCookie("authKey") as string;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("created");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const itemsPerPage = 10;
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [editableCompany, setEditableCompany] =
    useState<CompanyDetailInterface | null>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [addButton, setAddButton] = useState<boolean>(false);
  const [menuItems, setMenuItems] = useState<SidebarSectionInterface[] | null>(
    null
  );
  const [isClientSelected, setIsClientSelected] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [search, setSearch] = useState("");
  const [roleCode, setRoleCode] = useState<string | null>(null);

  const { mutate: deleteCompany } = useDeleteCompanyMaintenance();
  const { mutate: addOrUpdateCompany } = useAddOrUpdateCompaniesMaintenance();
  const {
    data: CompanyData,
    error: CompanyError,
    isLoading: CompanyLoading,
  } = useCompanyList(authKey || "", {
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    sortBy: sortBy,
    sortOrder: sortOrder,
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
            (dropdown) => dropdown.Name === "Company"
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
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };
  const handleDeleteCompany = (id: string) => {
    toast(({ closeToast }) => (
      <div>
        <p className="text-white">
          Are you sure you want to delete this Company?
        </p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={async () => {
              try {
                await deleteCompany({
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

    const emailAddresses = editableCompany?.EmailAddress
      ? editableCompany.EmailAddress.split(",")
          .map((e) => e.trim())
          .join(",")
      : "";
    const phoneNumbers = editableCompany?.MobileNumber
      ? editableCompany.MobileNumber.split(",")
          .map((p) => p.trim())
          .join(",")
      : "";

    const payload: AddOrUpdateCompanyPayloadInterface = {
      Id: editingCompanyId,
      Name: editableCompany?.Name ?? "",
      EmailAddress: emailAddresses,
      MobileNumber: phoneNumbers,
      LandlineNumber: editableCompany?.LandlineNumber ?? "",
      PanNumber: editableCompany?.PanNumber ?? "",
      BranchId: Array.isArray(editableCompany?.BranchId)
        ? editableCompany.BranchId
        : editableCompany?.BranchId
        ? [editableCompany.BranchId]
        : [],
      DistrictId: editableCompany?.DistrictId ?? "",
      ProvinceId: editableCompany?.ProvinceId ?? "",
      WardNumber: editableCompany?.WardNumber ?? 0,
      Address: editableCompany?.Address ?? "",
    };

    try {
      await addOrUpdateCompany(payload);
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

  const handelSuccess = async (newCompany: any) => {
    if (newCompany) {
      setCompanies((prevCompany) => [newCompany, ...prevCompany]);
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

        <div className="flex justify-end mb-4">
          {accessDetails && accessDetails[0]?.CanCreate === "1" && (
            <button
              className="flex items-center px-4 py-2 border-2 bg-success rounded-xl text-white hover:opacity-80"
              onClick={() => setAddButton(!addButton)}
            >
              <AddRounded style={{ color: "white" }} className="mr-2" />
              Add
            </button>
          )}
        </div>

        <div className="relative w-full">
          <div className="overflow-x-auto border-2 rounded-lg">
            <table className="w-full border-collapse table-auto">
              <thead>
                <tr className="bg-tablehead border-b-2 text-left">
                  <th
                    className="cursor-pointer text-left border-b p-2"
                    onClick={() => handleSortChange("name")}
                  >
                    Name
                    {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer text-left border-b p-2"
                    onClick={() => handleSortChange("address")}
                  >
                    Address
                    {sortBy === "cursor-pointer text-left border-b p-2" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer text-left border-b p-2 "
                    onClick={() => handleSortChange("emailaddress")}
                  >
                    Email Address
                    {sortBy === "emailaddress" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  {roleCode === "USERROLE_SYSTEMADMIN" && (
                    <th
                      className="cursor-pointer text-left border-b p-2"
                      onClick={() => handleSortChange("clientname")}
                    >
                      Client
                      {sortBy === "clientname" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                  )}
                  <th
                    className="cursor-pointer text-left border-b p-2"
                    onClick={() => handleSortChange("mobilenumber")}
                  >
                    Mobile No
                    {sortBy === "mobilenumber" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer text-left border-b p-2"
                    onClick={() => handleSortChange("landlinenumber")}
                  >
                    Landline No
                    {sortBy === "landlinenumber" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer text-left border-b p-2"
                    onClick={() => handleSortChange("pannumber")}
                  >
                    Pan Number
                    {sortBy === "pannumber" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>

                  <th
                    className="cursor-pointer text-left border-b p-2"
                    onClick={() => handleSortChange("branchname")}
                  >
                    Branch
                    {sortBy === "branchname" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>

                  <th
                    className="cursor-pointer text-left border-b p-2"
                    onClick={() => handleSortChange("created")}
                  >
                    Created
                    {sortBy === "created" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer text-left border-b p-2"
                    onClick={() => handleSortChange("modified")}
                  >
                    Modified
                    {sortBy === "modified" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="cursor-pointer text-left border-b p-2">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {CompanyLoading ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-error">
                      Loading companies...
                    </td>
                  </tr>
                ) : CompanyError ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-error">
                      Error loading companies:
                    </td>
                  </tr>
                ) : !Array.isArray(CompanyData?.data) ||
                  CompanyData.data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-error">
                      No companies found.
                    </td>
                  </tr>
                ) : (
                  CompanyData?.data.map((company: any) => (
                    <tr
                      className={`border-b hover:bg-gray-50 cursor-pointer ${
                        company.Id === selectedCompanyId ? "bg-blue-100" : ""
                      }`}
                      key={company.Id}
                    >
                      <td className="p-1 w-96">
                        {editingCompanyId === company.Id ? (
                          <input
                            type="text"
                            value={editableCompany?.Name || ""}
                            onChange={(e) =>
                              setEditableCompany((prev) => ({
                                ...prev!,
                                Name: e.target.value,
                              }))
                            }
                            className="border p-2 rounded"
                          />
                        ) : (
                          company.Name
                        )}
                      </td>
                      <td className="p-1 text-left">{company.Address}</td>
                      <td className="p-1 text-left">
                        {editingCompanyId === company.Id ? (
                          <input
                            type="text"
                            value={editableCompany?.EmailAddress || ""}
                            onChange={(e) =>
                              setEditableCompany((prev) => ({
                                ...prev!,
                                EmailAddress: e.target.value,
                              }))
                            }
                            className="border p-2 rounded"
                          />
                        ) : (
                          company.EmailAddress
                        )}
                      </td>
                      {roleCode === "USERROLE_SYSTEMADMIN" && (
                        <td className="p-2 text-center">
                          {company.ClientName}
                        </td>
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
                                setEditableCompany((prev) => ({
                                  ...prev!,
                                  MobileNumber: numericValue,
                                }));
                              }
                            }}
                            className="border p-2 rounded"
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
                                setEditableCompany((prev) => ({
                                  ...prev!,
                                  LandlineNumber: numericValue,
                                }));
                              }
                            }}
                            className="border p-2 rounded"
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
                                setEditableCompany((prev) => ({
                                  ...prev!,
                                  PanNumber: numericValue,
                                }));
                              }
                            }}
                            className="border p-2 rounded"
                          />
                        ) : (
                          company.PanNumber
                        )}
                      </td>

                      <td className="p-1 text-left">{company.BranchName}</td>
                      <td className="p-1 text-left">{company.Created}</td>
                      <td className="p-1 text-left">{company.Modified}</td>
                      <td className="p-1 text-left flex gap-2">
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
        <CompanyAddOverlay
          onOverlayClose={handleOverlayClose}
          onSuccess={handelSuccess}
        />
      )}
    </>
  );
};

export default CompaniesMaintenanceContainer;
