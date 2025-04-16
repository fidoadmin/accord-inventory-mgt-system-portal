import { toast } from "react-toastify";
import { FormEvent, useState } from "react";

import { AddOrUpdateInventoryDescriptionPayloadInterface } from "@/types/InventoryInterface";
import Dropdown from "@/components/Dropdown";
import { useAddOrUpdateInventoryDescription } from "@/app/hooks/inventorydescriptions/useInventoryDescriptionAddOrUpdate";
import { CancelRounded, SaveRounded } from "@mui/icons-material";
import { useDropdownList } from "@/app/hooks/globaldropdown/useGlobalDropdown";
import { useCompanyTypeList } from "@/app/hooks/companies/useCompanyTypeList";
import { ClientDetailInterface } from "@/types/ClientInterface";
import { useCategoryList } from "@/app/hooks/categories/useCategoryList";

const InvDescAddOverlay = ({
  onOverlayClose,
  onSuccess,
}: {
  onOverlayClose: () => void;
  onSuccess: (newInventory: any) => void;
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [authKey, setAuthKey] = useState<string | null>(null);
  const [hasModelName, setHasModelName] = useState<boolean>(false);
  const [hasPartNumber, setHasPartNumber] = useState<boolean>(false);
  const [hasExpiryDate, setHasExpiryDate] = useState<boolean>(false);
  const [hasBatchNumber, setHasBatchNumber] = useState<boolean>(false);
  const [divideQuantity, setDivideQuantity] = useState<boolean>(false);
  const [selectedClient, setSelectedClientId] = useState<any>(null);
  const [roleCode, setRoleCode] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [search, setSearch] = useState("");

  const { data: clientList } = useDropdownList("clients", search, filters);
  const { mutateAsync: addOrUpdateInventoryDescription } =
    useAddOrUpdateInventoryDescription();

  const initialInventoryData = {
    Id: "",
    Description: "",
    CategoryName: "",
    CategoryId: "",
    ShortName: "",
    ManufacturerName: "",
    ManufacturerId: "",
    ModelName: "",
    PartNumber: "",
    HasExpiryDate: false,
    HasBatchNumber: false,
    DivideQuantity: false,
  };

  const [descAddData, setDescAddData] =
    useState<AddOrUpdateInventoryDescriptionPayloadInterface>(
      initialInventoryData
    );

  useState(() => {
    const key = localStorage.getItem("authKey") as "";
    setAuthKey(key);
    const RoleCode = localStorage.getItem("RoleCode");
    setRoleCode(RoleCode);
  });

  const { data: CompanyTypeList } = useCompanyTypeList(authKey || "", {});
  const { data: Manufacturer } = useDropdownList("companies", search, {
    CompanyTypeId:
      CompanyTypeList?.data
        ?.filter(
          (companyType) => companyType.Code === "COMPANYTYPE-MANUFACTURER"
        )
        .map((internal) => internal.Id) ?? [],
  });

  const { data: categoryList } = useCategoryList(authKey || "", {
    clientid: selectedClient?.id,
  });

  const handleSetOpenDropdown = (dropdownId: string) => {
    setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  };

  const handleChange = (e: any) => {
    setDescAddData({ ...descAddData, [e.target.name]: e.target.value });
  };

  const handleSelectCategory = (option: {
    id: string;
    name: string;
    hasModelName?: boolean;
    hasPartNumber?: boolean;
  }) => {
    setDescAddData({
      ...descAddData,
      CategoryId: option.id,
      CategoryName: option.name,
    });
    setHasModelName(option.hasModelName!);
    setHasPartNumber(option.hasPartNumber!);
  };

  const handleSelectManufacturer = (option: { id: string; name: string }) => {
    setDescAddData({
      ...descAddData,
      ManufacturerId: option.id,
      ManufacturerName: option.name,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!descAddData.ManufacturerId) {
      toast.error("Manufacturer is required.", { position: "top-right" });
      return;
    }
    if (!descAddData.CategoryId) {
      toast.error("Category is required.", { position: "top-right" });
      return;
    }

    if (!descAddData.Description) {
      toast.error("Description is required.", { position: "top-right" });
      return;
    }
    if (roleCode === "USERROLE_SYSTEMADMIN" && !descAddData.ClientId) {
      toast.error("Client is required.", { position: "top-right" });
      return;
    }

    try {
      await addOrUpdateInventoryDescription({
        ...descAddData,
        HasExpiryDate: hasExpiryDate,
        DivideQuantity: divideQuantity,
      });
      onSuccess(descAddData);
      onOverlayClose();
    } catch (error) {
      toast.error("Failed to save Inventory Description.", {
        position: "top-right",
      });
    }
  };

  const handleSelectClient = (option: { id: string; name: string }) => {
    setDescAddData((prevData) => ({
      ...prevData,
      ClientId: option.id,
    }));
    setSelectedClientId(option);
  };
  return (
    <>
      <div className="fixed inset-0 h-screen flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-md z-20" />
      <div className="fixed w-1/2 min-h-96 top-10 right-1/2 translate-x-2/3 p-6  bg-white border border-primary text-text rounded-3xl z-40 max-h-screen scrollbar-thin overflow-y-auto">
        <div className="titleDiv">
          <h1 className="text-lg text-primary text-center font-bold">
            Add an Inventory Description
          </h1>
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
        <div className="h-full w-full">
          <Dropdown
            placeholder="Select a Category"
            label="Category"
            showLabel
            options={
              categoryList?.data.map((category) => ({
                id: category.Id,
                name: category.Name,
              })) ?? []
            }
            isOpen={openDropdown === "category"}
            setIsOpen={() => handleSetOpenDropdown("category")}
            onSelect={handleSelectCategory}
            search={true}
            required
            disabled={!selectedClient && roleCode === "USERROLE_SYSTEMADMIN"}
          />
        </div>

        <div className="flex-1 form-div h-full w-full">
          <p className="text-text text-sm">
            Manufacture: <span className="text-error">*</span>
          </p>
          <Dropdown
            showLabel
            placeholder="Select a Manufacturer"
            options={
              Manufacturer?.map((manufacturer) => ({
                id: manufacturer.Id,
                name: manufacturer.Name,
              })) ?? []
            }
            onSelect={handleSelectManufacturer}
            isOpen={openDropdown === "manufacturer"}
            setIsOpen={() => handleSetOpenDropdown("manufacturer")}
            search={true}
          />

          <div>
            <p className="text-text text-sm">
              Description: <span className="text-error">*</span>
            </p>
            <input
              name="Description"
              value={descAddData.Description || ""}
              className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
              onChange={handleChange}
            />
          </div>
          <div>
            <p className="text-text text-sm"> Short Name:</p>
            <input
              name="ShortName"
              value={descAddData.ShortName || ""}
              className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
              onChange={handleChange}
            />
          </div>

          {hasModelName && (
            <div className="w-full">
              <p className="text-text text-sm">Model Name:</p>
              <input
                name="ModelName"
                value={descAddData.ModelName || ""}
                className="inner-border-2 inner-border-primary rounded-xl w-full p-2"
                onChange={handleChange}
              />
            </div>
          )}
          {hasPartNumber && (
            <div className="w-full">
              <p className="text-text text-sm">Part Number:</p>
              <input
                name="PartNumber"
                value={descAddData.PartNumber || ""}
                className="inner-border-2 inner-border-primary rounded-xl w-full p-2"
                onChange={handleChange}
              />
            </div>
          )}

          <div className="flex items-center space-x-4 border-2 border-primary rounded-xl w-fit px-4 py-2 mt-2 bg-white text-black">
            <label className="flex items-center">
              <p className="text-sm">Divide Quantity </p>
              <input
                type="checkbox"
                checked={divideQuantity}
                onChange={() => setDivideQuantity(!divideQuantity)}
                className="toggle-checkbox hidden"
              />
              <span
                className={`toggle-switch w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                  divideQuantity ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`toggle-dot w-4 h-4 bg-white rounded-full shadow-md transform ${
                    divideQuantity ? "translate-x-5" : "translate-x-0"
                  }`}
                ></span>
              </span>
            </label>
            <span>{divideQuantity ? "Yes" : "No"}</span>
          </div>

          <div className="flex items-center space-x-4 border-2 border-primary rounded-xl w-fit px-4 py-2 mt-2 bg-white text-black">
            <label className="flex items-center">
              <p className="text-sm">Expiry Date: </p>
              <input
                type="checkbox"
                checked={hasExpiryDate}
                onChange={() => setHasExpiryDate(!hasExpiryDate)}
                className="toggle-checkbox hidden"
              />
              <span
                className={`toggle-switch w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                  hasExpiryDate ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`toggle-dot w-4 h-4 bg-white rounded-full shadow-md transform ${
                    hasExpiryDate ? "translate-x-5" : "translate-x-0"
                  }`}
                ></span>
              </span>
            </label>
            <span>{hasExpiryDate ? "Yes" : "No"}</span>
          </div>

          <div className="flex items-center space-x-4 border-2 border-primary rounded-xl w-fit px-4 py-2 mt-2 bg-white text-black">
            <label className="flex items-center">
              <p className="text-sm">Batch Number: </p>
              <input
                type="checkbox"
                checked={hasBatchNumber}
                onChange={() => setHasBatchNumber(!hasBatchNumber)}
                className="toggle-checkbox hidden"
              />
              <span
                className={`toggle-switch w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                  hasBatchNumber ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`toggle-dot w-4 h-4 bg-white rounded-full shadow-md transform ${
                    hasBatchNumber ? "translate-x-5" : "translate-x-0"
                  }`}
                ></span>
              </span>
            </label>
            <span>{hasBatchNumber ? "Yes" : "No"}</span>
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
    </>
  );
};

export default InvDescAddOverlay;
