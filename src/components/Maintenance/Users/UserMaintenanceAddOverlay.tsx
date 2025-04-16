import { useCompanyTypeList } from "@/app/hooks/companies/useCompanyTypeList";
import { useDepartmentList } from "@/app/hooks/department/useDepartmentList";
import { useSubDepartmentList } from "@/app/hooks/department/useSubDepartmentList";
import { useDropdownList } from "@/app/hooks/globaldropdown/useGlobalDropdown";
import { useRoleList } from "@/app/hooks/role/useRoleList";
import { useAddOrUpdateUserMaintenance } from "@/app/hooks/user/useUserAddOrUpdate";
import Dropdown from "@/components/Dropdown";
import { ClientDetailInterface } from "@/types/ClientInterface";
import { AddOrUpdateUserPayloadInterface } from "@/types/UserInterface";
import {
  SaveRounded,
  CancelRounded,
  VisibilityOffRounded,
  VisibilityRounded,
} from "@mui/icons-material";
import { getCookie } from "cookies-next";

import { useState, FormEvent, useEffect } from "react";
import { toast } from "react-toastify";

const UserAddOverlay = ({
  onOverlayClose,
  onSuccess,
}: {
  onOverlayClose: () => void;
  onSuccess: (newUser: any) => void;
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [authKey, setAuthKey] = useState<string | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [reVisible, setReVisible] = useState<boolean>(false);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [search, setSearch] = useState("");
  const [roleCode, setRoleCode] = useState<any>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [selectedClient, setSelectedClientId] = useState<any>(null);
  const itemsPerPage = 0;
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { mutateAsync: addOrUpdateUser } = useAddOrUpdateUserMaintenance();
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
  const [subdepartmentList, setSubdepartmentList] = useState<any>(null);

  const initialInventoryData: AddOrUpdateUserPayloadInterface = {
    Id: "",
    FirstName: "",
    LastName: "",
    Address: "",
    EmailAddress: "",
    MobileNumber: "",
    LandlineNumber: "",
    Password: "",
    DepartmentId: "",
  };

  const { data: clientList } = useDropdownList("clients", search, filters);
  const clientOptions = [
    { id: "", name: "All" },
    ...(clientList?.map((client: ClientDetailInterface) => ({
      id: client.Id!,
      name: client.Name!,
    })) ?? []),
  ];

  const { data: departmentList } = useDepartmentList(authKey || "", {
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    clientId: selectedClient?.id,
    hasClient: selectedClient?.hasClient,
  });

  const { data: subDepartmentData } = useSubDepartmentList(authKey || "", {
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    hasChildren: selectedDepartment?.hasChildren,
    parentId: selectedDepartment?.id,
  });

  useEffect(() => {
    if (subDepartmentData) {
      setSubdepartmentList(subDepartmentData);
    }
  }, [subDepartmentData]);

  const { data: roleList } = useRoleList(authKey || "", {
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    clientId: selectedClient?.id || null,
  });
  const filteredRoles = roleList?.data?.filter((role: any) => {
    if (selectedClient === null) {
      return role.Name === "System Admin";
    }
    return true;
  });

  const { data: CompanyTypeList } = useCompanyTypeList(authKey || "", {
    search,
  });

  const { data: InternalCompany } = useDropdownList("companies", search, {
    CompanyTypeId:
      CompanyTypeList?.data
        ?.filter((companyType) => companyType.Code === "COMPANYTYPE-INTERNAL")
        .map((internal) => internal.Id) ?? [],
  });

  const [descAddData, setDescAddData] = useState(initialInventoryData);

  useState(() => {
    const key = getCookie("authKey") as "";
    setAuthKey(key);
    const RoleCode = localStorage.getItem("RoleCode");
    setRoleCode(RoleCode);
  });

  const handleSetOpenDropdown = (dropdownId: string) => {
    setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  };
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (["MobileNumber", "LandlineNumber"].includes(name)) {
      if (!/^\d*$/.test(value)) {
        return;
      }
      if (name === "MobileNumber" && value.length > 10) {
        toast.error("Mobile Number cannot be more than 10 digits.", {
          position: "top-right",
        });
        return;
      }
      if (name === "LandlineNumber" && value.length > 10) {
        toast.error("Landline Number cannot be more than 10 digits.", {
          position: "top-right",
        });
        return;
      }
    }
    setDescAddData({ ...descAddData, [name]: value });
  };

  const handleSelectClient = (option: { id: string; name: string }) => {
    if (option.name === "All") {
      setDescAddData((prevData) => ({
        ...prevData,
        ClientId: undefined,
      }));
      setSelectedClientId(null);
    } else {
      setDescAddData((prevData) => ({
        ...prevData,
        ClientId: option.id,
      }));
      setSelectedClientId(option);
    }
  };

  const handleSelectRole = (option: {
    id: string;
    name: string;
    hasClient: boolean;
  }) => {
    setDescAddData((prevData) => ({
      ...prevData,
      RoleId: option.id,
    }));
    setSelectedRoleId(option.name);
    if (option.hasClient) {
      setSelectedDepartment(null);
      setSearchTerm("");
    } else {
      setSelectedDepartment([]);
    }
  };

  const handleSelectCompany = (option: { id: string }) => {
    setDescAddData((prevData) => ({
      ...prevData,
      CompanyId: option.id,
    }));
  };
  const handleSelectDepartment = (option: {
    id: string;
    name: string;
    hasChildren: boolean;
  }) => {
    setDescAddData((prevData) => ({
      ...prevData,
      DepartmentId: option.id,
    }));
    setSelectedDepartment(option);

    if (option.hasChildren) {
      setSubdepartmentList(null);
      setSearchTerm("");
    } else {
      setSubdepartmentList([]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!descAddData.FirstName) {
      toast.error("First Name is required.", { position: "top-right" });
      return;
    }
    if (!descAddData.RoleId) {
      toast.error("Role is required.", { position: "top-right" });
      return;
    }
    if (!descAddData.EmailAddress) {
      toast.error("EmailAddress is required.", { position: "top-right" });
      return;
    }

    if (
      roleCode === "USERROLE_SYSTEMADMIN" &&
      selectedRoleId !== "System Admin" &&
      !descAddData.ClientId
    ) {
      toast.error("Client is required.", { position: "top-right" });
      return;
    }
    if (!descAddData.DepartmentId) {
      toast.error("Department is required.", { position: "top-right" });
      return;
    }

    if (descAddData.EmailAddress && !descAddData.EmailAddress.includes("@")) {
      toast.error("Invalid Email Address Format!");
      return;
    }

    if (descAddData.Password !== descAddData.RePassword) {
      toast.error("Passwords do not match.", { position: "top-right" });
      return;
    }
    if (descAddData.MobileNumber && descAddData.MobileNumber.length !== 10) {
      toast.error("Mobile Number should be exactly 10 digits.", {
        position: "top-right",
      });
      return;
    }
    if (
      descAddData.LandlineNumber &&
      descAddData.LandlineNumber.length !== 9 &&
      descAddData.LandlineNumber.length !== 10
    ) {
      toast.error("Landline Number should be exactly 9 or 10 digits.", {
        position: "top-right",
      });
      return;
    }

    try {
      await addOrUpdateUser(descAddData, {
        onSuccess: (data) => {
          if (data?.error) {
            toast.error(data.error, { position: "top-right" });
            return;
          }
          onSuccess(descAddData);
          onOverlayClose();
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message);
        },
      });
    } catch (error) {}
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 h-screen flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-md z-20">
      <div
        className="fixed w-1/2 min-h-96 top-10 right-1/2 translate-x-2/3 p-6 bg-white border border-primary text-text rounded-3xl z-40 max-h-screen scrollbar-thin overflow-y-auto"
        onClick={handleOverlayClick}
      >
        <div className="titleDiv">
          <h1 className="text-lg text-primary text-center font-bold">
            Add Employee
          </h1>
        </div>

        <div>
          <p className="text-text text-sm">
            First Name: <span className="text-error">*</span>
          </p>
          <input
            name="FirstName"
            value={descAddData.FirstName || ""}
            className="w-full border-2 border-tablehead rounded-xl p-2"
            onChange={handleChange}
          />
        </div>
        <div>
          <p className="text-text text-sm">
            Last Name:
            <span className="text-error">*</span>
          </p>
          <input
            name="LastName"
            value={descAddData.LastName || ""}
            className="w-full border-2 border-tablehead rounded-xl p-2"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <p className="text-text text-sm">
            Email Address:<span className="text-error">*</span>
          </p>
          <input
            name="EmailAddress"
            value={descAddData.EmailAddress || ""}
            className="w-full border-2 border-tablehead rounded-xl p-2"
            onChange={handleChange}
          />
        </div>
        <div>
          <p className="text-text text-sm">Mobile No:</p>
          <input
            type="text"
            name="MobileNumber"
            value={descAddData.MobileNumber || ""}
            className="w-full border-2 border-tablehead rounded-xl p-2"
            onChange={handleChange}
          />
        </div>
        <div>
          <p className="text-text text-sm">Landline No:</p>
          <input
            type="text"
            name="LandlineNumber"
            value={descAddData.LandlineNumber || ""}
            className="w-full border-2 border-tablehead rounded-xl p-2"
            onChange={handleChange}
          />
        </div>
        <div>
          <p className="text-text text-sm">Address:</p>
          <input
            name="Address"
            value={descAddData.Address || ""}
            className="w-full border-2 border-tablehead rounded-xl p-2"
            onChange={handleChange}
          />
        </div>
        {selectedRoleId !== "System Admin" &&
          roleCode === "USERROLE_SYSTEMADMIN" && (
            <Dropdown
              label="Client"
              showLabel
              options={clientOptions}
              isOpen={openDropdown === "clients"}
              setIsOpen={() => handleSetOpenDropdown("clients")}
              onSelect={handleSelectClient}
              placeholder="Select a Client"
              search={true}
              required
            />
          )}
        <Dropdown
          label="Role"
          showLabel
          options={
            roleCode === "USERROLE_SYSTEMADMIN"
              ? filteredRoles?.map((role: any) => ({
                  id: role.Id!,
                  name: role.Name!,
                })) ?? []
              : roleList?.data?.map((role: any) => ({
                  id: role.Id!,
                  name: role.Name!,
                })) ?? []
          }
          isOpen={openDropdown === "roles"}
          setIsOpen={() => handleSetOpenDropdown("roles")}
          onSelect={handleSelectRole}
          placeholder="Select a Role"
          search={true}
          required
        />
        {selectedRoleId !== "System Admin" &&
          selectedRoleId !== "Client Admin" && (
            <Dropdown
              label="Company"
              showLabel
              options={
                InternalCompany?.map((company: any) => ({
                  id: company.Id!,
                  name: company.Name!,
                })) ?? []
              }
              isOpen={openDropdown === "companies"}
              setIsOpen={() => handleSetOpenDropdown("companies")}
              onSelect={handleSelectCompany}
              placeholder="Select a Company"
              search={true}
              required
            />
          )}
        <Dropdown
          label="Department"
          showLabel
          options={
            departmentList?.data.map((department: any) => ({
              id: department.Id!,
              name: department.Name!,
              hasChildren: department.HasChildren,
            })) ?? []
          }
          isOpen={openDropdown === "departments"}
          setIsOpen={() => handleSetOpenDropdown("departments")}
          onSelect={handleSelectDepartment}
          placeholder="Select a Main Department"
          search={true}
          required
        />
        {selectedDepartment?.hasChildren && subdepartmentList && (
          <Dropdown
            label="Sub-Department"
            showLabel
            options={
              subdepartmentList?.data.map((subdepartment: any) => ({
                id: subdepartment.Id!,
                name: subdepartment.Name!,
              })) ?? []
            }
            isOpen={openDropdown === "subdepartments"}
            setIsOpen={() => handleSetOpenDropdown("subdepartments")}
            onSelect={(option: any) => {
              setDescAddData((prevData) => ({
                ...prevData,
                SubDepartmentId: option.id,
              }));
            }}
            placeholder="Select a Sub Department"
            search={true}
            required
          />
        )}

        <div className="relative w-full">
          <p className="text-text text-sm">
            Password:
            <span className="text-error">*</span>
          </p>
          <div className="relative">
            <input
              id="Password"
              name="Password"
              type={visible ? "text" : "password"}
              value={descAddData.Password || ""}
              className="w-full border-2 border-tablehead rounded-xl p-2 pr-10"
              onChange={handleChange}
              required
            />
            <span
              className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
              onClick={() => {
                setVisible(!visible);
              }}
            >
              {visible ? <VisibilityRounded /> : <VisibilityOffRounded />}
            </span>
          </div>
        </div>

        <div className="relative w-full">
          <p className="text-text text-sm">
            Re-Password:
            <span className="text-error">*</span>
          </p>
          <div className="relative">
            <input
              id="Repassword"
              name="RePassword"
              type={reVisible ? "text" : "password"}
              value={descAddData.RePassword || ""}
              className="w-full border-2 border-tablehead rounded-xl p-2 pr-10"
              onChange={handleChange}
              required
            />
            <span
              className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
              onClick={() => {
                setReVisible(!reVisible);
              }}
            >
              {reVisible ? <VisibilityRounded /> : <VisibilityOffRounded />}
            </span>
          </div>
        </div>

        <div className="flex gap-4 justify-center mt-5">
          <button
            className="bg-success rounded-xl p-2 w-40 flex items-center justify-center gap-4 text-white"
            onClick={handleSubmit}
          >
            <SaveRounded /> Save
          </button>
          <button
            className="bg-error rounded-xl p-2 w-40 flex items-center justify-center gap-4 text-white"
            onClick={onOverlayClose}
          >
            <CancelRounded /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAddOverlay;
