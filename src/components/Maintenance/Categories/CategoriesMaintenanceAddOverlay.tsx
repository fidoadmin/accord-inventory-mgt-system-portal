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
      HasExpirationDate: false,
      HasManufactureDate: false,
      HasModelName: false,
      HasPartNumber: false,
      ShowSize: false,
      AllowExpiredInventory: false,
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
        className="fixed w-1/2 min-h-96 top-10 right-1/2 translate-x-2/3 p-6 bg-white border border-primary text-text rounded-3xl z-40 max-h-screen scrollbar-thin overflow-y-auto"
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

        <div className="flex items-center space-x-4 border-2 border-primary rounded-xl w-full px-4 py-2 mt-2 bg-white text-black">
          <label className="flex items-center">
            <p className="text-sm">Expiration Date: </p>
            <input
              type="checkbox"
              name="HasExpirationDate"
              checked={formData.HasExpirationDate}
              onChange={handleCheckboxChange}
              className="toggle-checkbox hidden"
            />
            <span
              className={`toggle-switch w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                formData.HasExpirationDate ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`toggle-dot w-4 h-4 bg-white rounded-full shadow-md transform ${
                  formData.HasExpirationDate ? "translate-x-5" : "translate-x-0"
                }`}
              ></span>
            </span>
          </label>
          <span>{formData.HasExpirationDate ? "Yes" : "No"}</span>
        </div>

        <div className="flex items-center space-x-4 border-2 border-primary rounded-xl w-full px-4 py-2 mt-2 bg-white text-black">
          <label className="flex items-center">
            <p className="text-sm">Manufacturer Date: </p>
            <input
              type="checkbox"
              name="HasManufactureDate"
              checked={formData.HasManufactureDate}
              onChange={handleCheckboxChange}
              className="toggle-checkbox hidden"
            />
            <span
              className={`toggle-switch w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                formData.HasManufactureDate ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`toggle-dot w-4 h-4 bg-white rounded-full shadow-md transform ${
                  formData.HasManufactureDate
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              ></span>
            </span>
          </label>
          <span>{formData.HasManufactureDate ? "Yes" : "No"}</span>
        </div>

        <div className="flex items-center space-x-4 border-2 border-primary rounded-xl w-full px-4 py-2 mt-2 bg-white text-black">
          <label className="flex items-center">
            <p className="text-sm">Show Size: </p>
            <input
              type="checkbox"
              name="ShowSize"
              checked={formData.ShowSize}
              onChange={handleCheckboxChange}
              className="toggle-checkbox hidden"
            />
            <span
              className={`toggle-switch w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                formData.ShowSize ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`toggle-dot w-4 h-4 bg-white rounded-full shadow-md transform ${
                  formData.ShowSize ? "translate-x-5" : "translate-x-0"
                }`}
              ></span>
            </span>
          </label>
          <span>{formData.ShowSize ? "Yes" : "No"}</span>
        </div>

        <div className="flex items-center space-x-4 border-2 border-primary rounded-xl w-full px-4 py-2 mt-2 bg-white text-black">
          <label className="flex items-center">
            <p className="text-sm">Allowed Expired: </p>
            <input
              type="checkbox"
              name="AllowExpiredInventory"
              checked={formData.AllowExpiredInventory}
              onChange={handleCheckboxChange}
              className="toggle-checkbox hidden"
            />
            <span
              className={`toggle-switch w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                formData.AllowExpiredInventory ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`toggle-dot w-4 h-4 bg-white rounded-full shadow-md transform ${
                  formData.AllowExpiredInventory
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              ></span>
            </span>
          </label>
          <span>{formData.AllowExpiredInventory ? "Yes" : "No"}</span>
        </div>

        <div className="flex items-center space-x-4 border-2 border-primary rounded-xl w-full px-4 py-2 mt-2 bg-white text-black">
          <label className="flex items-center">
            <p className="text-sm">Part Number: </p>
            <input
              type="checkbox"
              name="HasPartNumber"
              checked={formData.HasPartNumber}
              onChange={handleCheckboxChange}
              className="toggle-checkbox hidden"
            />
            <span
              className={`toggle-switch w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                formData.HasPartNumber ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`toggle-dot w-4 h-4 bg-white rounded-full shadow-md transform ${
                  formData.HasPartNumber ? "translate-x-5" : "translate-x-0"
                }`}
              ></span>
            </span>
          </label>
          <span>{formData.HasPartNumber ? "Yes" : "No"}</span>
        </div>

        <div className="flex items-center space-x-4 border-2 border-primary rounded-xl w-full px-4 py-2 mt-2 bg-white text-black">
          <label className="flex items-center">
            <p className="text-sm">Model Name: </p>
            <input
              type="checkbox"
              name="HasModelName"
              checked={formData.HasModelName}
              onChange={handleCheckboxChange}
              className="toggle-checkbox hidden"
            />
            <span
              className={`toggle-switch w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                formData.HasModelName ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`toggle-dot w-4 h-4 bg-white rounded-full shadow-md transform ${
                  formData.HasModelName ? "translate-x-5" : "translate-x-0"
                }`}
              ></span>
            </span>
          </label>
          <span>{formData.HasModelName ? "Yes" : "No"}</span>
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

export default CategoriesMaintenanceAddOverlay;
