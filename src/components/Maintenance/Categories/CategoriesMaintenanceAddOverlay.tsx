import { toast } from "react-toastify";
import { SaveRounded, CancelRounded } from "@mui/icons-material";
import { useState, FormEvent, useEffect } from "react";
import { getCookie } from "cookies-next";
import { useAddOrUpdateCategory } from "@/app/hooks/category/useCategoryAddOrUpdate";
import { AddOrUpdateCategoryPayloadInterface } from "@/types/CategoryInterface";
import { ClientDetailInterface } from "@/types/ClientInterface";
import { useDropdownList } from "@/app/hooks/globaldropdown/useGlobalDropdown";
import Dropdown from "@/components/Dropdown";

const CategoriesMaintenanceAddOverlay = ({
  onOverlayClose,
  onSuccess,
}: {
  onOverlayClose: () => void;
  onSuccess: (newCompany: any) => void;
}) => {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [search, setSearch] = useState("");
  const [roleCode, setRoleCode] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [formData, setFormData] = useState<AddOrUpdateCategoryPayloadInterface>(
    {
      Id: "",
      Name: "",
    }
  );
  const [authKey, setAuthKey] = useState<string | null>(null);
  const { data: clientList } = useDropdownList("clients", search, filters);
  const { mutateAsync: addOrUpdateCategory } = useAddOrUpdateCategory();

  useEffect(() => {
    const key = getCookie("authKey") as string;
    setAuthKey(key);
    const RoleCode = localStorage.getItem("RoleCode");
    setRoleCode(RoleCode);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.Name) {
      toast.error("Category Name is required.", { position: "top-right" });
      return;
    }
    if (roleCode === "USERROLE_SYSTEMADMIN" && !formData.ClientId) {
      toast.error("Client is required.", { position: "top-right" });
      return;
    }

    const payload = {
      ...formData,
    };

    try {
      await addOrUpdateCategory(payload);
      onSuccess(formData);
      onOverlayClose();
    } catch (error) {}
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };
  const handleSetOpenDropdown = (dropdownId: string) => {
    setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  };
  const handleSelectClient = (option: { id: string }) => {
    setFormData((prevData) => ({
      ...prevData,
      ClientId: option.id,
    }));
  };
  return (
    <div className="fixed inset-0 h-screen flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-md z-20">
      <div
        className={`fixed w-1/2 min-h-52 top-10 right-1/2 translate-x-2/3 p-6 bg-white border border-primary text-text rounded-3xl z-40 max-h-screen scrollbar-thin overflow-y-auto ${
          roleCode === "USERROLE_SYSTEMADMIN" ? "h-96" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-lg text-primary text-center font-bold">
          Add Categories
        </h1>

        <div className="mb-4">
          <label className="text-sm text-text">
            Category Name: <span className="text-error">*</span>
          </label>
          <input
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
            required
          />
        </div>
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

export default CategoriesMaintenanceAddOverlay;
