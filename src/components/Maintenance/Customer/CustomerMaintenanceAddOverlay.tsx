import { toast } from "react-toastify";
import { SaveRounded, CancelRounded } from "@mui/icons-material";

import { useState, FormEvent, useEffect } from "react";
import { AddOrUpdateCustomerPayloadInterface } from "@/types/CompanyInterface";
import { useAddOrUpdateCustomersMaintenance } from "@/app/hooks/customer/useCustomerAddOrUpdate";
import { useDropdownList } from "@/app/hooks/globaldropdown/useGlobalDropdown";
import { ClientDetailInterface } from "@/types/ClientInterface";
import Dropdown from "@/components/Dropdown";
import { getCookie } from "cookies-next";

const CustomerAddOverlay = ({
  onOverlayClose,
  onSuccess,
}: {
  onOverlayClose: () => void;
  onSuccess: (newCompany: any) => void;
}) => {
  const initialCustomerData: AddOrUpdateCustomerPayloadInterface = {
    Id: "",
    Name: "",
    Address: "",
    EmailAddress: "",
    MobileNumber: "",
    LandlineNumber: "",
    PanNumber: "",
  };

  const [customerAddData, setCustomerData] = useState(initialCustomerData);
  const [authKey, setAuthKey] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [roleCode, setRoleCode] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { mutateAsync: addOrUpdateCustomer } =
    useAddOrUpdateCustomersMaintenance();
  useEffect(() => {
    const key = getCookie("authKey") as "";
    setAuthKey(key);
    const RoleCode = localStorage.getItem("RoleCode");
    setRoleCode(RoleCode);
  }, []);
  const { data: clientList } = useDropdownList("clients", search, filters);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (["MobileNumber", "PanNumber", "LandlineNumber"].includes(name)) {
      if (!/^\d*$/.test(value)) {
        return;
      }
      if (name === "MobileNumber" && value.length > 10) {
        toast.error("Mobile Number cannot be more than 10 digits.", {
          position: "top-right",
        });
        return;
      }
      if (name === "PanNumber" && value.length > 10) {
        toast.error("Pan Number cannot be more than 10 digits.", {
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

    setCustomerData({ ...customerAddData, [name]: value });
    setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!customerAddData.Name) {
      toast.error("Name is required.", { position: "top-right" });
      return;
    }
    if (
      customerAddData.MobileNumber &&
      customerAddData.MobileNumber.length !== 10
    ) {
      toast.error("Mobile Number should be exactly 10 digits.", {
        position: "top-right",
      });
      return;
    }
    if (
      customerAddData.PanNumber &&
      customerAddData.PanNumber.length !== 9 &&
      customerAddData.PanNumber.length !== 10
    ) {
      toast.error("Pan Number should be exactly 9 or 10 digits.", {
        position: "top-right",
      });
      return;
    }
    if (
      customerAddData.LandlineNumber &&
      customerAddData.LandlineNumber.length !== 9 &&
      customerAddData.LandlineNumber.length !== 10
    ) {
      toast.error("Landline Number should be exactly 9 or 10 digits.", {
        position: "top-right",
      });
      return;
    }
    if (
      customerAddData.EmailAddress &&
      !customerAddData.EmailAddress.includes("@")
    ) {
      toast.error("Invalid Email Address Format!");
      return;
    }
    if (roleCode === "USERROLE_SYSTEMADMIN" && !customerAddData.ClientId) {
      toast.error("Client is required.", { position: "top-right" });
      return;
    }

    try {
      await addOrUpdateCustomer(customerAddData);
      onSuccess(customerAddData);
      onOverlayClose();
    } catch (error) {}
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  const handleSetOpenDropdown = (dropdownId: string) => {
    setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  };
  const handleSelectClient = (option: { id: string }) => {
    setCustomerData((prevData) => ({
      ...prevData,
      ClientId: option.id,
    }));
  };
  return (
    <div className="fixed inset-0 h-screen flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-md z-20">
      <div
        className="fixed w-1/2 min-h-96 top-10 right-1/2 translate-x-2/3 p-6 bg-white border border-primary text-text rounded-3xl z-40 max-h-screen scrollbar-thin overflow-y-auto"
        onClick={handleOverlayClick}
      >
        <h1 className="text-lg text-primary text-center font-bold">
          Add Customer
        </h1>

        <div className="mb-4">
          <label className="text-sm text-text">Name:</label>
          <input
            name="Name"
            value={customerAddData.Name}
            onChange={handleChange}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-sm text-text">Address:</label>
          <input
            name="Address"
            value={customerAddData.Address}
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
            placeholder="Select a client"
            required
          />
        )}

        <div className="mb-4">
          <label className="text-sm text-text">Email Address:</label>
          <input
            name="EmailAddress"
            value={customerAddData.EmailAddress}
            onChange={handleChange}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="text-sm text-text">Mobile No:</label>
          <input
            type="text"
            name="MobileNumber"
            value={customerAddData.MobileNumber}
            onChange={handleChange}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
          />
        </div>
        <div className="mb-4">
          <label className="text-sm text-text">Landline No:</label>
          <input
            type="text"
            name="LandlineNumber"
            value={customerAddData.LandlineNumber}
            onChange={handleChange}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
          />
        </div>
        <div className="mb-4">
          <label className="text-sm text-text">Pan Number:</label>
          <input
            type="text"
            name="PanNumber"
            value={customerAddData.PanNumber}
            onChange={handleChange}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
          />
        </div>

        <div className="flex gap-4 justify-center mt-5">
          <button
            className={`bg-success rounded-xl p-2 w-40 flex items-center justify-center gap-4 text-white $`}
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

export default CustomerAddOverlay;
