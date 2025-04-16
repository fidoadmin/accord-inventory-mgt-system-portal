import { toast } from "react-toastify";
import { SaveRounded, CancelRounded } from "@mui/icons-material";
import { useState, FormEvent } from "react";
import { AddOrUpdateRolePayloadInterface } from "@/types/RolesInterface";
import { useAddOrUpdateRoleMaintenance } from "@/app/hooks/role/useRoleAddOrUpdate";
import Dropdown from "@/components/Dropdown";
import { useDropdownList } from "@/app/hooks/globaldropdown/useGlobalDropdown";
import { ClientDetailInterface } from "@/types/ClientInterface";

const RoleAddOverlay = ({
  onOverlayClose,
  onSuccess,
}: {
  onOverlayClose: () => void;
  onSuccess: (newRole: any) => void;
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [authKey, setAuthKey] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [search, setSearch] = useState("");
  const [roleCode, setRoleCode] = useState<string | null>(null);
  const [selectedClient, setSelectedClientId] = useState<any>(null);

  const { mutateAsync: addOrUpdateRole } = useAddOrUpdateRoleMaintenance();
  const { data: clientList } = useDropdownList("clients", search, filters);
  const initialRoleData: AddOrUpdateRolePayloadInterface = {
    Id: "",
    Name: "",
  };

  const [descAddData, setDescAddData] = useState(initialRoleData);

  useState(() => {
    const key = localStorage.getItem("authKey") as string;
    setAuthKey(key);
    const RoleCode = localStorage.getItem("RoleCode");
    setRoleCode(RoleCode);
  });

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
      await addOrUpdateRole(descAddData);
      onSuccess(descAddData);
      onOverlayClose();
    } catch (error) {}
  };
  const handleSetOpenDropdown = (dropdownId: string) => {
    setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
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
        className="fixed w-1/2 min-h-96 top-10 right-1/2 translate-x-2/3 p-6 bg-white border border-primary text-text rounded-3xl z-40 max-h-screen scrollbar-thin overflow-y-auto"
        onClick={handleOverlayClick}
      >
        <div className="titleDiv">
          <h1 className="text-lg text-primary text-center font-bold">
            Add Role
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
        <div></div>
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

        <div className="flex gap-4 justify-center mt-10">
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

export default RoleAddOverlay;
