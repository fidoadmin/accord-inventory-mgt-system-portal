import { toast } from "react-toastify";
import { FormEvent, useEffect, useState } from "react";

import { AddOrUpdateInventoryDescriptionPayloadInterface } from "@/types/InventoryInterface";
import Dropdown from "@/components/Dropdown";
import { useAddOrUpdateInventoryDescription } from "@/app/hooks/inventorydescriptions/useInventoryDescriptionAddOrUpdate";
import { CancelRounded, SaveRounded } from "@mui/icons-material";
import { useDropdownList } from "@/app/hooks/globaldropdown/useGlobalDropdown";
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
    ModelName: "",
    ReOrderQuantityPerShipper: 0,
    ExpiryThresholdDays: 0,
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

  const { data: categoryList } = useCategoryList(authKey || "", {
    page: 1,
  });

  const category = categoryList?.data || [];
  const medicineCategory = category.find(
    (cat) => cat.Name.toLowerCase() === "medicine"
  );

  useEffect(() => {
    if (medicineCategory && !descAddData.CategoryId) {
      handleSelectCategory({
        id: medicineCategory.Id,
        name: medicineCategory.Name,
      });
    }
  }, [categoryList]);

  const handleSetOpenDropdown = (dropdownId: string) => {
    setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  };

  const handleChange = (e: any) => {
    setDescAddData({ ...descAddData, [e.target.name]: e.target.value });
  };

  const handleSelectCategory = (option: { id: string; name: string }) => {
    setDescAddData({
      ...descAddData,
      CategoryId: option.id,
      CategoryName: option.name,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

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
        <div className="h-full w-full text-sm">
          Category <span className="text-error">*</span>
          <select
            id="category-select"
            value={descAddData.CategoryId || ""}
            onChange={(e) =>
              handleSelectCategory({
                id: e.target.value,
                name: e.target.options[e.target.selectedIndex].text,
              })
            }
            className="w-full inner-border-2 inner-border-primary rounded-xl p-3"
          >
            {medicineCategory ? (
              <option value={medicineCategory.Id}>
                {medicineCategory.Name}
              </option>
            ) : (
              <option value="">Select a Category</option>
            )}
          </select>
        </div>
        <div className="flex-1 form-div h-full w-full">
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

          <div className="w-full">
            <p className="text-text text-sm">Model Name:</p>
            <input
              name="ModelName"
              value={descAddData.ModelName || ""}
              className="inner-border-2 inner-border-primary rounded-xl w-full p-2"
              onChange={handleChange}
            />
          </div>
          <div>
            <p className="text-text text-sm">Reorder Quantity PerShipper:</p>
            <input
              name="ReOrderQuantityPerShipper"
              value={descAddData.ReOrderQuantityPerShipper || ""}
              className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
              onChange={handleChange}
            />
          </div>
          <div>
            <p className="text-text text-sm">Expiry Threshold Days:</p>
            <input
              name="ExpiryThresholdDays"
              value={descAddData.ExpiryThresholdDays || ""}
              className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
              onChange={handleChange}
            />
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
