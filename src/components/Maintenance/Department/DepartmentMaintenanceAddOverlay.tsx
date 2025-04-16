import { toast } from "react-toastify";
import { SaveRounded, CancelRounded } from "@mui/icons-material";
import { getCookie } from "cookies-next";
import { useState, FormEvent, useEffect } from "react";
import {
  AddOrUpdateDepartmentPayloadInterface,
  DepartmentDetailInterface,
} from "@/types/Department";
import { useAddOrUpdateDepartmentMaintenance } from "@/app/hooks/department/useDepartmentAddOrUpdate";
import { useDepartmentList } from "@/app/hooks/department/useDepartmentList";
import { ClientDetailInterface } from "@/types/ClientInterface";
import Dropdown from "@/components/Dropdown";
import { useDropdownList } from "@/app/hooks/globaldropdown/useGlobalDropdown";

const DepartmentAddOverlay = ({
  onOverlayClose,
  onSuccess,
}: {
  onOverlayClose: () => void;
  onSuccess: (newRole: any) => void;
}) => {
  const [authKey, setAuthKey] = useState<string | null>(null);

  const { mutateAsync: addOrUpdateDepartment } =
    useAddOrUpdateDepartmentMaintenance();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [search, setSearch] = useState("");
  const [roleCode, setRoleCode] = useState<string | null>(null);
  const [selectedClient, setSelectedClientId] = useState<any>(null);

  const { data: clientList } = useDropdownList("clients", search, filters);

  const initialDepartmentData: AddOrUpdateDepartmentPayloadInterface = {
    Id: "",
    Name: "",
    ParentId: "",
    ClientId: "",
  };
  const { data: departmentList } = useDepartmentList(authKey || "", {
    page: currentPage,
    search: searchTerm,
    clientId: selectedClient?.id,
  });

  const [descAddData, setDescAddData] = useState(initialDepartmentData);

  useEffect(() => {
    const key = getCookie("authKey") as string;
    setAuthKey(key);
    const RoleCode = localStorage.getItem("RoleCode");
    setRoleCode(RoleCode);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDescAddData({ ...descAddData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!descAddData.Name) {
      toast.error("Name is required.", { position: "top-right" });
      return;
    }
    if (roleCode === "USERROLE_SYSTEMADMIN" && !descAddData.ClientId) {
      toast.error("Client is required.", { position: "top-right" });
      return;
    }

    try {
      await addOrUpdateDepartment(descAddData);
      onSuccess(descAddData);
      onOverlayClose();
    } catch (error) {}
  };
  const handleSetOpenDropdown = (dropdownId: string) => {
    setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  };
  const handleSelectDepartment = (option: {
    id: string;
    name: string;
    isExpiry?: boolean;
    hasChildren: boolean;
    hasClient: boolean;
  }) => {
    setDescAddData((prevData) => ({
      ...prevData,
      Id: option.id,
      name: option.name,
    }));
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  const handleSelectClient = (option: { id: string }) => {
    setDescAddData((prevData) => ({
      ...prevData,
      ClientId: option.id,
    }));
    setSelectedClientId(option);
  };
  return (
    <div className="fixed inset-0 h-screen flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-md z-20">
      <div
        className={`fixed w-1/2 ${
          openDropdown === "departments" ? "min-h-[600px]" : "min-h-96"
        } top-10 right-1/2 translate-x-2/3 p-6 bg-white border border-primary text-text rounded-3xl z-40 max-h-screen scrollbar-thin overflow-y-auto`}
        onClick={handleOverlayClick}
      >
        <div className="titleDiv">
          <h1 className="text-lg text-primary text-center font-bold">
            Add Department
          </h1>
        </div>

        <div>
          <p className="text-text text-sm">
            Name: <span className="text-error">*</span>
          </p>
          <input
            name="Name"
            value={descAddData.Name || ""}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          {roleCode === "USERROLE_SYSTEMADMIN" && (
            <Dropdown
              label="Client"
              showLabel
              options={
                clientList?.map((client: ClientDetailInterface) => ({
                  id: client.Id!,
                  name: client.Name!,
                })) ?? []
              }
              isOpen={openDropdown === "clients"}
              setIsOpen={() => handleSetOpenDropdown("clients")}
              onSelect={handleSelectClient}
              placeholder="Select a Client"
              search={true}
              required
            />
          )}

          <Dropdown
            label="Main Department"
            showLabel
            options={
              departmentList?.data.map(
                (department: DepartmentDetailInterface) => ({
                  id: department.Id!,
                  name: department.Name!,
                })
              ) ?? []
            }
            isOpen={openDropdown === "departments"}
            setIsOpen={() => handleSetOpenDropdown("departments")}
            onSelect={handleSelectDepartment}
            placeholder="Select a Main Department"
            search={true}
          />
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

export default DepartmentAddOverlay;
