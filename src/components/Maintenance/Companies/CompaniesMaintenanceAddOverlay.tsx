import { toast } from "react-toastify";
import { SaveRounded, CancelRounded } from "@mui/icons-material";
import { useState, FormEvent, useEffect } from "react";
import { AddOrUpdateCompanyPayloadInterface } from "@/types/CompanyInterface";
import { useAddOrUpdateCompaniesMaintenance } from "@/app/hooks/company/useCompanyAddOrUpdate";
import Dropdown from "@/components/Dropdown";
import { useDropdownList } from "@/app/hooks/globaldropdown/useGlobalDropdown";
import { getCookie } from "cookies-next";
import { ClientDetailInterface } from "@/types/ClientInterface";

const CompanyAddOverlay = ({
  onOverlayClose,
  onSuccess,
}: {
  onOverlayClose: () => void;
  onSuccess: (newCompany: any) => void;
}) => {
  const [formData, setFormData] = useState<AddOrUpdateCompanyPayloadInterface>({
    Id: "",
    Name: "",
    EmailAddress: "",
    MobileNumber: "",
    LandlineNumber: "",
    PanNumber: "",
    BranchId: [],
    WardNumber: undefined,
    DistrictId: "",
    ProvinceId: "",
    Address: "",
  });
  const [authKey, setAuthKey] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [search, setSearch] = useState("");
  const [isProvinceClicked, setIsProvinceClicked] = useState(false);
  const [isDistrictClicked, setIsDistrictClicked] = useState(false);
  const [isMunicipalityClicked, setIsMunicipalityClicked] = useState(false);
  const { mutateAsync: addOrUpdateCompany } =
    useAddOrUpdateCompaniesMaintenance();
  const [roleCode, setRoleCode] = useState<any>(null);
  const { data: provinceList } = useDropdownList("provinces", search, filters);
  const { data: district } = useDropdownList(
    formData.ProvinceId ? "districts" : "",
    search,
    filters
  );

  const { data: municipality } = useDropdownList(
    formData.DistrictId ? "municipalities" : "",
    search,
    filters
  );

  const {
    data: branchData,
    error: branchError,
    isLoading: branchLoading,
  } = useDropdownList("branches", search);

  const { data: clientList } = useDropdownList("clients", search, filters);

  useEffect(() => {
    const key = getCookie("authKey") as string;
    setAuthKey(key);
    const RoleCode = localStorage.getItem("RoleCode");
    setRoleCode(RoleCode);
  }, []);

  useEffect(() => {
    if (formData.ProvinceId) {
      setFilters({ ProvinceId: formData.ProvinceId });
      setIsProvinceClicked(true);
    } else {
      setIsProvinceClicked(false);
    }
  }, [formData.ProvinceId]);

  useEffect(() => {
    if (formData.DistrictId) {
      setFilters({ DistrictId: formData.DistrictId });
      setIsDistrictClicked(true);
    } else {
      setIsDistrictClicked(false);
    }
  }, [formData.DistrictId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (
      ["MobileNumber", "PanNumber", "LandlineNumber", "WardNumber"].includes(
        name
      )
    ) {
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

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSetOpenDropdown = (dropdownId: string) => {
    setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  };

  const handleSelectBranch = (option: { id: string }) => {
    setFormData((prevData) => ({
      ...prevData,
      BranchId: [...prevData.BranchId, option.id],
    }));
  };

  const handleSelectProvince = (option: { id: string }) => {
    setFormData((prevData) => ({
      ...prevData,
      ProvinceId: option.id,
      DistrictId: "",
      MunicipalityId: "",
    }));
    setFilters({ ProvinceId: option.id });
    setIsProvinceClicked(true);
    setIsDistrictClicked(false);
    setIsMunicipalityClicked(false);
  };

  const handleSelectDistrict = (option: { id: string }) => {
    setFormData((prevData) => ({
      ...prevData,
      DistrictId: option.id,
      MunicipalityId: "",
    }));
    setFilters({ DistrictId: option.id });
    setIsDistrictClicked(true);
    setIsMunicipalityClicked(false);
  };

  const handleSelectMunicipality = (option: { id: string }) => {
    setFormData((prevData) => ({
      ...prevData,
      MunicipalityId: option.id,
    }));
    setIsMunicipalityClicked(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.Name) {
      toast.error("Name is required.", { position: "top-right" });
      return;
    }
    if (formData.MobileNumber && formData.MobileNumber.length !== 10) {
      toast.error("Mobile Number should be exactly 10 digits.", {
        position: "top-right",
      });
      return;
    }
    if (
      formData.PanNumber &&
      formData.PanNumber.length !== 9 &&
      formData.PanNumber.length !== 10
    ) {
      toast.error("Pan Number should be exactly 9 or 10 digits.", {
        position: "top-right",
      });
      return;
    }
    if (
      formData.LandlineNumber &&
      formData.LandlineNumber.length !== 9 &&
      formData.LandlineNumber.length !== 10
    ) {
      toast.error("Landline Number should be exactly 9 or 10 digits.", {
        position: "top-right",
      });
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
    if (!formData.ProvinceId) {
      toast.error("Province is required.", { position: "top-right" });
      return;
    }
    if (!formData.DistrictId) {
      toast.error("District is required.", { position: "top-right" });
      return;
    }
    if (!formData.MunicipalityId) {
      toast.error("Municipality is required.", { position: "top-right" });
      return;
    }
    if (!formData.WardNumber) {
      toast.error("WardNumber is required.", { position: "top-right" });
      return;
    }

    if (formData.BranchId.length === 0) {
      toast.error("At least one Branch must be selected.", {
        position: "top-right",
      });
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
      await addOrUpdateCompany(payload);
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

  return (
    <div
      className="  overflow-x-auto  border-4 border-black rounded-lg"
      style={{ maxHeight: "160px" }}
    >
      <div className="fixed inset-0 h-screen flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-md z-20">
        <div
          className="fixed w-1/2 min-h-96 top-1 right-1/2 translate-x-2/3 p-6 bg-white border border-primary text-text rounded-3xl z-40 max-h-screen scrollbar-thin overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <h1 className="text-lg text-primary text-center font-bold">
            Add Company
          </h1>

          <div className="mb-2">
            <label className="text-sm text-text">
              Name: <span className="text-error">*</span>
            </label>
            <input
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              className="w-full border border-primary  focus:outline-primary rounded-xl p-2"
              required
            />
          </div>

          <div className="mb-2">
            <label className="text-sm text-text">Email Address:</label>
            <input
              name="EmailAddress"
              value={formData.EmailAddress}
              onChange={handleChange}
              className="w-full border border-primary  focus:outline-primary rounded-xl p-2"
            />
          </div>

          <div className="mb-2">
            <label className="text-sm text-text">Mobile No:</label>
            <input
              type="text"
              name="MobileNumber"
              value={formData.MobileNumber}
              onChange={handleChange}
              className="w-full border border-primary  focus:outline-primary rounded-xl p-2"
            />
          </div>
          <div className="mb-2">
            <label className="text-sm text-text">Landline No:</label>
            <input
              type="text"
              name="LandlineNumber"
              value={formData.LandlineNumber}
              onChange={handleChange}
              className="w-full border border-primary  focus:outline-primary rounded-xl p-2"
            />
          </div>
          <div className="mb-4">
            <label className="text-sm text-text">Pan Number:</label>
            <input
              type="text"
              name="PanNumber"
              value={formData.PanNumber}
              onChange={handleChange}
              className="w-full border border-primary  focus:outline-primary rounded-xl p-2"
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

          <Dropdown
            label="Province"
            showLabel
            options={
              provinceList?.map((province) => ({
                id: province.Id!,
                name: province.Name!,
              })) ?? []
            }
            isOpen={openDropdown === "province"}
            setIsOpen={() => handleSetOpenDropdown("province")}
            onSelect={handleSelectProvince}
            placeholder="Select a Province"
            required
            search={true}
          />

          <div className=" disabled:opacity-50">
            <Dropdown
              label="District"
              showLabel
              options={
                district?.map((district) => ({
                  id: district.Id!,
                  name: district.Name!,
                })) ?? []
              }
              isOpen={openDropdown === "district"}
              setIsOpen={() => handleSetOpenDropdown("district")}
              onSelect={handleSelectDistrict}
              placeholder="Select a District"
              required
              disabled={!isProvinceClicked}
              search={true}
            />
          </div>

          <Dropdown
            label="Municipality"
            showLabel
            options={
              municipality?.map((municipality) => ({
                id: municipality.Id!,
                name: municipality.Name!,
              })) ?? []
            }
            isOpen={openDropdown === "municipality"}
            setIsOpen={() => handleSetOpenDropdown("municipality")}
            onSelect={handleSelectMunicipality}
            placeholder="Select a Municipality"
            required
            disabled={!isDistrictClicked}
            search={true}
          />

          <div className="mb-2">
            <label className="text-sm text-text">Ward Number:</label>
            <input
              type="text"
              name="WardNumber"
              value={formData.WardNumber}
              onChange={handleChange}
              disabled={!isMunicipalityClicked}
              className="w-full border border-primary focus:outline-primary rounded-xl p-2 disabled:opacity-50"
            />
          </div>

          <div className="mb-4">
            <label className="text-sm text-text">
              Branch: <span className="text-error">*</span>
            </label>
            <div className="w-full border border-primary focus:outline-primary rounded-xl p-2">
              <div className="flex flex-wrap space-x-4">
                {branchData?.map((branch) => (
                  <div key={branch.Id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`branch-${branch.Id}`}
                      value={branch.Id}
                      checked={formData.BranchId.includes(branch.Id)}
                      onChange={(e) => {
                        let newBranchIds = [...formData.BranchId];

                        if (
                          e.target.checked &&
                          !newBranchIds.includes(branch.Id)
                        ) {
                          newBranchIds.push(branch.Id);
                        } else if (!e.target.checked) {
                          const index = newBranchIds.indexOf(branch.Id);
                          if (index > -1) newBranchIds.splice(index, 1);
                        }

                        newBranchIds = Array.from(new Set(newBranchIds));

                        setFormData((prevData) => ({
                          ...prevData,
                          BranchId: newBranchIds,
                        }));
                      }}
                    />
                    <label htmlFor={`branch-${branch.Id}`} className="ml-2">
                      {branch.Name}
                    </label>
                  </div>
                ))}
              </div>
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
    </div>
  );
};

export default CompanyAddOverlay;
