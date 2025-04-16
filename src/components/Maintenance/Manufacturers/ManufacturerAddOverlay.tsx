import { toast } from "react-toastify";
import { SaveRounded, CancelRounded } from "@mui/icons-material";

import { useState, FormEvent, useEffect } from "react";
import { getCookie } from "cookies-next";
import { useAddOrUpdateManufacturer } from "@/app/hooks/manufacturer/useManufacturerAddOrUpdate";
import { AddOrUpdateManufacturerPayloadInterface } from "@/types/ManufacturerInterface";
import { useDropdownList } from "@/app/hooks/globaldropdown/useGlobalDropdown";
import Dropdown from "@/components/Dropdown";
import { ClientDetailInterface } from "@/types/ClientInterface";

const ManufacturerAddOverlay = ({
  onOverlayClose,
  onSuccess,
}: {
  onOverlayClose: () => void;
  onSuccess: (newCompany: any) => void;
}) => {
  const [formData, setFormData] =
    useState<AddOrUpdateManufacturerPayloadInterface>({
      Id: "",
      Name: "",
      Address: "",
      EmailAddress: "",
      MobileNumber: "",
      LandlineNumber: "",
      SameAsSupplier: false,
    });
  const [authKey, setAuthKey] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [search, setSearch] = useState("");
  const { data: clientList } = useDropdownList("clients", search, filters);
  const { mutateAsync: addOrUpdateManufacturer } = useAddOrUpdateManufacturer();
  const [roleCode, setRoleCode] = useState<string | null>(null);

  useEffect(() => {
    const key = getCookie("authKey") as string;
    setAuthKey(key);
    const RoleCode = localStorage.getItem("RoleCode");
    setRoleCode(RoleCode);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (["MobileNumber", "PanNumber", "LandlineNumber"].includes(name)) {
      if (!/^\d*$/.test(value)) {
        return;
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.Name) {
      toast.error(" Name is required.", { position: "top-right" });
      return;
    }

    if (formData.EmailAddress && !formData.EmailAddress.includes("@")) {
      toast.error("Invalid Email Address Format!");
      return;
    }

    if (roleCode === "USERROLE_SYSTEMADMIN" && !formData.ClientId) {
      toast.error("Client is required.", { position: "top-right" });
      return;
    }

    const emailAddresses = formData.EmailAddress.split(",")
      .map((e) => e.trim())
      .join(",");
    const phoneNumbers = formData.MobileNumber.split(",")
      .map((p) => p.trim())
      .join(",");

    const payload = {
      ...formData,
      EmailAddress: emailAddresses,
      MobileNumber: phoneNumbers,
    };

    try {
      await addOrUpdateManufacturer(payload);
      onSuccess(formData);
      onOverlayClose();
    } catch (error) {}
  };

  const handleSelectClient = (option: { id: string }) => {
    setFormData((prevData) => ({
      ...prevData,
      ClientId: option.id,
    }));
  };

  const handleSetOpenDropdown = (dropdownId: string) => {
    setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  };
  const handleCheckboxChange = () => {
    setFormData({
      ...formData,
      SameAsSupplier: !formData.SameAsSupplier,
    });
  };
  return (
    <div className="fixed inset-0 h-screen flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-md z-20">
      <div
        className="fixed w-1/2 min-h-96 top-10 right-1/2 translate-x-2/3 p-6 bg-white border border-primary text-text rounded-3xl z-40 max-h-screen scrollbar-thin overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-lg text-primary text-center font-bold">
          Add Manufacturer
        </h1>

        <div className="mb-4">
          <label className="text-sm text-text">
            Name: <span className="text-error">*</span>
          </label>
          <input
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-sm text-text">Address:</label>
          <input
            name="Address"
            value={formData.Address}
            onChange={handleChange}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
          />
        </div>

        <div className="mb-4">
          <label className="text-sm text-text">Email Address:</label>
          <input
            name="EmailAddress"
            value={formData.EmailAddress}
            onChange={handleChange}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
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
            placeholder="Select a client"
            required
          />
        )}
        <div className="mb-4">
          <label className="text-sm text-text">Mobile No:</label>
          <input
            name="MobileNumber"
            value={formData.MobileNumber}
            onChange={handleChange}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
          />
        </div>
        <div className="mb-4">
          <label className="text-sm text-text">Landline No:</label>
          <input
            name="LandlineNumber"
            value={formData.LandlineNumber}
            onChange={handleChange}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
          />
        </div>
        <div className="flex items-center space-x-4 border-2 border-primary rounded-xl w-full px-4 py-2 mt-2 bg-white text-black">
          <label className="flex items-center">
            <p className="text-sm">SameAsSupplier: </p>
            <input
              type="checkbox"
              checked={formData.SameAsSupplier}
              onChange={handleCheckboxChange}
              className="toggle-checkbox hidden"
            />
            <span
              className={`toggle-switch w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                formData.SameAsSupplier ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`toggle-dot w-4 h-4 bg-white rounded-full shadow-md transform ${
                  formData.SameAsSupplier ? "translate-x-5" : "translate-x-0"
                }`}
              ></span>
            </span>
          </label>
          <span>{formData.SameAsSupplier ? "Yes" : "No"}</span>
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

export default ManufacturerAddOverlay;
