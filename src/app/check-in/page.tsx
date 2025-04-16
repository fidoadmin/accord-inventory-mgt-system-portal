"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useAddOrUpdateInventory } from "@/app/hooks/inventories/useInventoryAddOrUpdate";
import { useRouter } from "next/navigation";
import BarcodeInputForm from "@/components/BarcodeInputForm";
import ConfirmationModal from "@/components/CancelConfirmationModal";
import "react-datepicker/dist/react-datepicker.css";
import { useContainers } from "../hooks/containers/useContainerList";
import { useInventoryDescriptionForMaintenance } from "../hooks/inventorydescriptions/useInventoryDescriptionForMaintenance";
import { toast } from "react-toastify";
import Loading from "../loading";
import React from "react";
import Dropdown from "@/components/Dropdown";
import { useDropdownList } from "../hooks/globaldropdown/useGlobalDropdown";
import { useCompanyTypeList } from "../hooks/companies/useCompanyTypeList";

export default function CheckInPage() {
  const [isExpiry, setIsExpiry] = useState<boolean>(true);

  const [selectedContainer, setSelectedContainer] = useState<{
    name?: string;
    id?: string;
  }>({});
  const [manufactureDate, setManufactureDate] = useState<Date | null>(
    new Date()
  );
  const [startExpiryDate, setStartExpiryDate] = useState<Date | null>(
    manufactureDate
  );
  const [authKey, setAuthKey] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(0);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [descriptionDetails, setDescriptionDetails] = useState<{
    manufacturerName?: string;
    shortName?: string;
  }>({});

  const initialInventoryData = {
    BarCode: "",
    BatchNumber: "",
    Tender: false,
    OtherReferenceNumber: "",
    TTNumber: "",
    LCNumber: "",
    BranchId: "",
    CategoryId: "",
    CompanyId: "",
    ContainerId: "",
    ContainerType: "",
    ExpirationDate: "",
    HSCode: "",
    InventoryDescriptionId: "",
    ManufactureDate: "",
    ModelNumber: "",
    PartNumber: "",
    PurchaseOrderNumber: "",
    ProformaInvoiceNumber: "",
    InvoiceNumber: "",
    Remarks: "",
    Shelf: "",
    SerialNumber: "",
    Quantity: 0,
    SupplierId: "",
    ChallanContainerUnit: "",
  };
  const [inventoryData, setInventoryData] = useState(initialInventoryData);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [smallUnit, setSmallUnit] = useState<string | undefined>(undefined);

  const [formError, setFormError] = useState<string[] | null>(null);
  const [formCancelled, setFormCancelled] = useState<boolean>(false);
  const [category, setCategory] = useState<{ name?: string; id?: string }>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showSerialNumberField, setShowSerialNumberField] =
    useState<boolean>(false);
  const [showTenderField, setShowTenderField] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [search, setSearch] = useState("");

  const handleSetOpenDropdown = (dropdownId: string) => {
    setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  };

  const handleToggleSerialNumber = () => {
    setShowSerialNumberField((prevState) => !prevState);
  };
  const handleToggleTenderField = () => {
    setInventoryData((prev) => ({
      ...prev,
      Tender: !prev.Tender,
    }));
  };

  const {
    data: inventoryDescriptionData,
    error: inventoryDescriptionError,
    isLoading: inventoryDescriptionLoading,
  } = useInventoryDescriptionForMaintenance(authKey || "", {
    categoryId: inventoryData.CategoryId,
  });

  useEffect(() => {
    if (inventoryData.InventoryDescriptionId && inventoryDescriptionData) {
      var inventoryDescriptionDetails = inventoryDescriptionData.data.find(
        (item) => item.Id === inventoryData.InventoryDescriptionId
      );
      setDescriptionDetails({
        manufacturerName: inventoryDescriptionDetails?.ManufacturerName,
        shortName: inventoryDescriptionDetails?.ShortName,
      });
      setInventoryData((prevData) => ({
        ...prevData,
        ManufacturerName:
          inventoryDescriptionDetails?.ManufacturerName as string,
        ShortName: inventoryDescriptionDetails?.ShortName as string,
      }));
    }
  }, [inventoryData.InventoryDescriptionId]);

  const {
    data: containerList,
    error: containerError,
    isLoading: containerLoading,
  } = useContainers(authKey || "", {
    categoryId: inventoryData.CategoryId,
  });

  const {
    data: categoryList,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useDropdownList("categories", search, filters);

  const {
    data: branchData,
    error: branchError,
    isLoading: branchLoading,
  } = useDropdownList("branches", search, { IsEntryPoint: "true" });

  const { data: CompanyTypeList } = useCompanyTypeList(authKey || "", {
    page,
    limit,
  });

  const { data: InternalCompany } = useDropdownList("companies", search, {
    CompanyTypeId:
      CompanyTypeList?.data
        ?.filter((companyType) => companyType.Code === "COMPANYTYPE-INTERNAL")
        .map((internal) => internal.Id) ?? [],
  });

  const { data: SupplierData } = useDropdownList("companies", search, {
    CompanyTypeId:
      CompanyTypeList?.data
        ?.filter((companyType) => companyType.Code === "COMPANYTYPE-SUPPLIER")
        .map((supplier) => supplier.Id) ?? [],
  });

  const addOrUpdateInventory = useAddOrUpdateInventory();
  const router = useRouter();

  const handleSelectCategory = (option: {
    id: string;
    name: string;
    isExpiry?: boolean;
  }) => {
    setInventoryData({
      ...inventoryData,
      CategoryId: option.id,
    });
  };

  const handleValidation = () => {
    let missingFields: string[] = [];

    if (!inventoryData.ContainerId) missingFields.push("PackSize");
    if (!selectedContainer.name) missingFields.push("Container");
    if (!inventoryData.SupplierId) missingFields.push("Supplier");
    if (!inventoryData.BranchId) missingFields.push("Branch");
    if (!inventoryData.CompanyId) missingFields.push("Company");

    setFormError(missingFields);

    if (missingFields.length > 0) {
      toast.error(`Incomplete form. Please fill all required fields!`);
    }

    return missingFields;
  };

  const handleSelectDescription = (option: {
    id: string;
    name: string;
    isExpiry?: boolean;
  }) => {
    setInventoryData({
      ...inventoryData,
      InventoryDescriptionId: option.id,
      ContainerId: "",
    });
    setSelectedContainer({});
    setIsExpiry(option.isExpiry ? option.isExpiry : false);
  };

  const handleSelectContainer = (option: { id: string; name: string }) => {
    const companyId = inventoryData.CompanyId;
    const categoryId = inventoryData.CategoryId;
    const descriptionId = inventoryData.InventoryDescriptionId;

    setSelectedContainer({ name: option.name, id: option.id });
    setInventoryData({
      ...initialInventoryData,
      ContainerType: option.name,
      CompanyId: companyId,
      CategoryId: categoryId,
      InventoryDescriptionId: descriptionId,
    });
  };

  const handleSelectPackSize = (option: { id: string; name: string }) => {
    setInventoryData({
      ...inventoryData,
      ContainerId: option.id,
    });
    console.log(containerList?.data);
    const containerDetails = containerList?.data.find(
      (item) => (item.Id = option.id)
    );
    const packSizeDetails = containerDetails?.PackSize.find(
      (item) => (item.ContainerId = option.id)
    );
    setSmallUnit(packSizeDetails?.SmallUnit);
  };

  const handleChallanUnit = (option: { id: string; name: string }) => {
    setInventoryData({
      ...inventoryData,
      ChallanContainerUnit: option.id,
    });
  };

  const handleSelectBranch = (option: { id: string; name: string }) => {
    setInventoryData({
      ...inventoryData,
      BranchId: option.id,
    });
  };

  const handleSelectCompany = (option: { id: string; name: string }) => {
    setInventoryData({
      ...initialInventoryData,
      CompanyId: option.id,
    });
  };

  const handleSelectSupplier = (option: { id: string; name: string }) => {
    setInventoryData({
      ...inventoryData,
      SupplierId: option.id,
    });
  };

  const handleManufactureDateSelect = (value: string) => {
    let formattedValue = value.replace(/[^\d-]/g, "");
    if (/^\d{4}-\d{2}-\d{2}$/.test(formattedValue)) {
      setInventoryData((prevData) => ({
        ...prevData,
        ManufactureDate: formattedValue,
      }));
    } else {
      if (formattedValue.length > 4 && formattedValue[4] !== "-") {
        formattedValue =
          formattedValue.slice(0, 4) + "-" + formattedValue.slice(4);
      }
      if (formattedValue.length > 7 && formattedValue[7] !== "-") {
        formattedValue =
          formattedValue.slice(0, 7) + "-" + formattedValue.slice(7);
      }
      if (formattedValue.length > 10) {
        formattedValue = formattedValue.slice(0, 10);
      }

      setInventoryData((prevData) => ({
        ...prevData,
        ManufactureDate: formattedValue,
      }));
    }
  };

  const handleExpiryDateSelect = (value: string) => {
    let formattedValue = value.replace(/[^\d-]/g, "");

    if (/^\d{4}-\d{2}-\d{2}$/.test(formattedValue)) {
      const selectedDate = new Date(formattedValue);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        toast.warn(
          <div className="">
            <p className="text-xl font-semibold">
              The expiry date has passed. Do you want to continue?
            </p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  setInventoryData((prevData) => ({
                    ...prevData,
                    ExpirationDate: formattedValue,
                  }));
                  toast.dismiss();
                }}
                className="no-button bg-success hover:opacity-60 py-2 px-4 text-white rounded-xl"
              >
                Yes
              </button>
              <button
                onClick={() => toast.dismiss()}
                className="no-button bg-error hover:opacity-60 py-2 px-4 text-white rounded-xl"
              >
                No
              </button>
            </div>
          </div>,
          { autoClose: false, closeOnClick: false }
        );
      } else {
        setInventoryData((prevData) => ({
          ...prevData,
          ExpirationDate: formattedValue,
        }));
      }
    } else {
      if (formattedValue.length > 4 && formattedValue[4] !== "-") {
        formattedValue =
          formattedValue.slice(0, 4) + "-" + formattedValue.slice(4);
      }
      if (formattedValue.length > 7 && formattedValue[7] !== "-") {
        formattedValue =
          formattedValue.slice(0, 7) + "-" + formattedValue.slice(7);
      }
      if (formattedValue.length > 10) {
        formattedValue = formattedValue.slice(0, 10);
      }

      setInventoryData((prevData) => ({
        ...prevData,
        ExpirationDate: formattedValue,
      }));
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setInventoryData({
      ...inventoryData,
      [name]: name === "Shelf" ? value.toUpperCase() : value,
    });
  };

  const handleBarcodeSubmit = (barcode: string) => {
    setInventoryData({
      ...inventoryData,
      BarCode: barcode.toUpperCase(),
    });
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (handleValidation().length) {
      setIsSubmitting(false);
      return;
    }
    try {
      const result = await addOrUpdateInventory.mutateAsync({
        ...inventoryData,
      });
      router.push(
        `/inventory/details/${inventoryData.InventoryDescriptionId}/${result.id}?isCheckin=true`
      );
    } catch (error: any) {
      if (error?.response?.status === 409) {
        toast.error("Barcode Duplicate! Please try again.");
        setIsSubmitting(false);
      } else {
        toast.error(`${error}`);
        setIsSubmitting(false);
      }
    }
  };

  const handleCancel = () => {
    setShowConfirmationModal(true);
  };

  const handleConfirmNavigation = () => {
    setInventoryData(initialInventoryData);
    setFormCancelled(true);
    setShowConfirmationModal(false);
    window.location.reload();
  };

  const handleDismissNavigation = () => {
    setShowConfirmationModal(false);
  };

  useEffect(() => {
    const key = localStorage.getItem("authKey") as "";
    setAuthKey(key);

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!formCancelled) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [formCancelled, showConfirmationModal]);

  if ((categoriesLoading && branchLoading) || (!category && !branchData)) {
    return <Loading />;
  }

  if (categoriesError || branchError || containerError)
    return (
      <div className="text-error font-bold text-center">
        Error loading check-in form:{" "}
        {categoriesError?.message ||
          branchError?.message ||
          containerError?.message}
      </div>
    );

  return (
    <>
      <div className="check-in-page py-2 space-y-4 flex flex-col justify-center items-center w-full sm:w-2/3 lg:w-1/2 mx-auto">
        <div>
          <h1 className="font-bold text-text text-lg">Inventory Check-in</h1>
        </div>
        <div className="container mx-auto md:p-4">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="companySelector">
              <Dropdown
                label="Company"
                showLabel
                options={
                  InternalCompany?.map((buyer) => ({
                    id: buyer.Id,
                    name: buyer.Name,
                  })) ?? []
                }
                isOpen={openDropdown === "buyer"}
                setIsOpen={() => handleSetOpenDropdown("buyer")}
                onSelect={handleSelectCompany}
                placeholder="Company"
                required
                search
                error={
                  formError?.includes("Company") && !inventoryData.CompanyId
                }
              />
              {formError?.includes("Company") && !inventoryData.CompanyId && (
                <p className="text-xs text-error">Please select a company</p>
              )}
            </div>
            {!!inventoryData.CompanyId && (
              <div className="flex gap-2">
                <Dropdown
                  label="Category"
                  options={
                    categoryList?.map((category) => ({
                      id: category.Id,
                      name: category.Name,
                    })) ?? []
                  }
                  isOpen={openDropdown === "category"}
                  setIsOpen={() => handleSetOpenDropdown("category")}
                  onSelect={handleSelectCategory}
                  placeholder="Categories"
                  required
                  search
                />

                <Dropdown
                  label="Description"
                  options={
                    inventoryDescriptionData?.data.map((description) => ({
                      id: description.Id,
                      isExpiry: description.HasExpiryDate,
                      name: `${
                        !!description.ShortName
                          ? `${description.ShortName} (${description.Description} )`
                          : `${description.Description}`
                      }`,
                    })) ?? []
                  }
                  isOpen={openDropdown === "description"}
                  setIsOpen={() => handleSetOpenDropdown("description")}
                  onSelect={handleSelectDescription}
                  placeholder="Description"
                  required
                  search
                  disabled={!inventoryData.CategoryId}
                />
              </div>
            )}

            {!!inventoryData.CategoryId.length &&
              !!inventoryData.InventoryDescriptionId.length && (
                <div className="flex gap-2">
                  <div className="w-full">
                    <Dropdown
                      label="Container"
                      options={
                        containerList?.data.map((container) => ({
                          id: container.Type,
                          name: container.Type,
                        })) ?? []
                      }
                      required
                      isOpen={openDropdown === "container"}
                      setIsOpen={() => handleSetOpenDropdown("container")}
                      onSelect={handleSelectContainer}
                      placeholder="Container"
                      search={true}
                      error={
                        formError?.includes("Container") &&
                        !selectedContainer.name
                      }
                    />
                    {formError?.includes("Container") &&
                      !selectedContainer.name && (
                        <p className="text-xs text-error">
                          Please select a container
                        </p>
                      )}
                  </div>
                  <div className="w-full">
                    <Dropdown
                      label="Pack Size"
                      options={
                        containerList?.data
                          .filter(
                            (container) =>
                              container.Type === selectedContainer.name
                          )
                          .flatMap((filteredContainer) =>
                            filteredContainer.PackSize?.map((pack) => ({
                              id: pack.ContainerId,
                              name: pack.Packsize,
                            }))
                          ) ?? []
                      }
                      required
                      isOpen={openDropdown === "packSize"}
                      setIsOpen={() => handleSetOpenDropdown("packSize")}
                      onSelect={handleSelectPackSize}
                      placeholder="Pack Size"
                      error={
                        formError?.includes("PackSize") &&
                        !inventoryData.ContainerId
                      }
                      disabled={!selectedContainer.id?.length}
                      search={true}
                    />
                    {formError?.includes("Container") &&
                      !inventoryData.ContainerId && (
                        <p className="text-xs text-error">
                          Please select a pack size
                        </p>
                      )}
                  </div>
                  {!!inventoryData.CategoryId.length &&
                    !!inventoryData.InventoryDescriptionId.length &&
                    !!inventoryData.ContainerId.length &&
                    !!selectedContainer && (
                      <div className="flex justify-between mb-1 w-full h-10 border border-gray-300  rounded-xl shadow-sm px-4 py-2 bg-white text-sm font-medium">
                        {smallUnit}
                      </div>
                    )}
                </div>
              )}

            {!!inventoryData.CategoryId.length &&
              !!inventoryData.InventoryDescriptionId.length &&
              !!inventoryData.ContainerId.length &&
              !!selectedContainer && (
                <BarcodeInputForm onChange={handleBarcodeSubmit} />
              )}

            {!!inventoryData.BarCode &&
              !!inventoryData.CategoryId.length &&
              !!inventoryData.InventoryDescriptionId &&
              !!inventoryData.CompanyId && (
                <>
                  <div className="mainForm space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                      <div className="w-full">
                        <label className="block text-xs text-text">
                          HS Code
                        </label>
                        <input
                          type="string"
                          name="HSCode"
                          autoComplete="off"
                          value={inventoryData.HSCode}
                          onChange={handleInputChange}
                          className="input w-full rounded-xl px-4 py-2 bg-transparent text-sm text-text placeholder:text-text border border-primary  focus:outline-primary focus:ring-0 focus:outline-none"
                          placeholder="HS Code"
                        />
                      </div>
                      <div className="w-full">
                        <label className="block text-xs text-text">
                          Serial Number
                          {showSerialNumberField && (
                            <span className="text-red-500">*</span>
                          )}{" "}
                        </label>
                        <div className="flex items-center space-x-2 w-full">
                          <input
                            type="text"
                            name="SerialNumber"
                            autoComplete="off"
                            value={inventoryData.SerialNumber}
                            onChange={handleInputChange}
                            className={`input w-full rounded-xl px-4 py-2 bg-transparent text-sm text-text placeholder:text-text border border-primary focus:outline-primary focus:ring-0 focus:outline-none ${
                              showSerialNumberField ? "" : "hidden"
                            }`}
                            placeholder="Serial Number"
                          />
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={showSerialNumberField}
                              onChange={handleToggleSerialNumber}
                              className="sr-only"
                            />
                            <span
                              className={`w-11 h-6 rounded-full transition-colors ${
                                showSerialNumberField
                                  ? "bg-success"
                                  : "bg-gray-200"
                              }`}
                            ></span>
                            <span
                              className={`${
                                showSerialNumberField
                                  ? "translate-x-5"
                                  : "translate-x-0"
                              } absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform`}
                            ></span>
                          </label>
                        </div>
                      </div>
                      <div className="w-full">
                        <label className="block text-xs text-text">
                          Batch Number
                        </label>
                        <input
                          type="string"
                          autoComplete="off"
                          name="BatchNumber"
                          value={inventoryData.BatchNumber}
                          onChange={handleInputChange}
                          className="input w-full rounded-xl px-4 py-2 bg-transparent text-sm text-text placeholder:text-text border border-primary  focus:outline-primary focus:ring-0 focus:outline-none"
                          placeholder="Batch Number"
                        />
                      </div>
                      <div className="w-full">
                        <label className="block text-xs text-text">
                          Tender
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={inventoryData.Tender}
                            onChange={handleToggleTenderField}
                            className="sr-only"
                          />
                          <span
                            className={`w-11 h-6 rounded-full transition-colors ${
                              inventoryData.Tender
                                ? "bg-success"
                                : "bg-gray-200"
                            }`}
                          ></span>
                          <span
                            className={`${
                              inventoryData.Tender
                                ? "translate-x-5"
                                : "translate-x-0"
                            } absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform`}
                          ></span>
                        </label>
                      </div>
                      <div className="w-full">
                        <label className="block text-xs text-text">
                          TT Number
                        </label>
                        <input
                          type="string"
                          autoComplete="off"
                          name="TTNumber"
                          value={inventoryData.TTNumber}
                          onChange={handleInputChange}
                          className="input w-full rounded-xl px-4 py-2 bg-transparent text-sm text-text placeholder:text-text border border-primary  focus:outline-primary focus:ring-0 focus:outline-none"
                          placeholder="TT Number"
                        />
                      </div>
                      <div className="w-full">
                        <label className="block text-xs text-text">
                          LC Number
                        </label>
                        <input
                          type="string"
                          autoComplete="off"
                          name="LCNumber"
                          value={inventoryData.LCNumber}
                          onChange={handleInputChange}
                          className="input w-full rounded-xl px-4 py-2 bg-transparent text-sm text-text placeholder:text-text border border-primary  focus:outline-primary focus:ring-0 focus:outline-none"
                          placeholder="LC Number"
                        />
                      </div>
                      <div className="w-full">
                        <label className="block text-xs text-text">
                          Other Reference Number
                        </label>
                        <input
                          type="string"
                          autoComplete="off"
                          name="OtherReferenceNumber"
                          value={inventoryData.OtherReferenceNumber}
                          onChange={handleInputChange}
                          className="input w-full rounded-xl px-4 py-2 bg-transparent text-sm text-text placeholder:text-text border border-primary  focus:outline-primary focus:ring-0 focus:outline-none"
                          placeholder="Other Reference Number"
                        />
                      </div>
                      <div className="w-full">
                        <label className="block text-xs text-text">
                          PI Number
                        </label>
                        <input
                          type="string"
                          autoComplete="off"
                          name="ProformaInvoiceNumber"
                          value={inventoryData.ProformaInvoiceNumber}
                          onChange={handleInputChange}
                          className="input w-full rounded-xl px-4 py-2 bg-transparent text-sm text-text placeholder:text-text border border-primary  focus:outline-primary focus:ring-0 focus:outline-none"
                          placeholder="PI Number"
                        />
                      </div>
                      <div className="w-full">
                        <label className="block text-xs text-text">
                          Invoice Number{" "}
                          {!!inventoryData.ProformaInvoiceNumber && (
                            <span className="text-error">*</span>
                          )}
                        </label>
                        <input
                          type="string"
                          autoComplete="off"
                          name="InvoiceNumber"
                          value={inventoryData.InvoiceNumber}
                          onChange={handleInputChange}
                          className="input w-full rounded-xl px-4 py-2 bg-transparent text-sm text-text placeholder:text-text border border-primary  focus:outline-primary focus:ring-0 focus:outline-none"
                          placeholder="Invoice Number"
                          // required={!!inventoryData.ProformaInvoiceNumber}
                        />
                      </div>
                      <div className="w-full">
                        <label className="block text-xs text-text">
                          PO Number
                        </label>
                        <input
                          type="string"
                          autoComplete="off"
                          name="PurchaseOrderNumber"
                          value={inventoryData.PurchaseOrderNumber}
                          onChange={handleInputChange}
                          className="input w-full rounded-xl px-4 py-2 bg-transparent text-sm text-text placeholder:text-text border border-primary  focus:outline-primary focus:ring-0 focus:outline-none"
                          placeholder="PO Number"
                        />
                      </div>

                      <div className="w-full">
                        <label className="block text-xs text-text">
                          Short Name
                        </label>
                        <input
                          type="string"
                          name="ShortName"
                          value={descriptionDetails.shortName}
                          onChange={handleInputChange}
                          disabled
                          className="input w-full rounded-xl px-4 py-2 bg-transparent text-sm border border-primary text-primary opacity-40"
                          placeholder="Short Name"
                        />
                      </div>

                      <div className="">
                        <Dropdown
                          label="Branch"
                          showLabel
                          options={
                            branchData?.map((branch) => ({
                              id: branch.Id,
                              name: branch.Name,
                              // entryPoint: branch.IsEntryPoint,
                            })) ?? []
                          }
                          isOpen={openDropdown === "branch"}
                          setIsOpen={() => handleSetOpenDropdown("branch")}
                          onSelect={handleSelectBranch}
                          placeholder="Branch"
                          required={true}
                          error={
                            formError?.includes("Branch") &&
                            !inventoryData.BranchId
                          }
                        />
                        {formError?.includes("Branch") &&
                          !inventoryData.BranchId && (
                            <p className="text-xs text-error">
                              Please select a branch
                            </p>
                          )}
                      </div>

                      <div className="">
                        <label className="block text-xs text-text">
                          Manufacturer
                        </label>
                        <input
                          type="text"
                          disabled
                          value={descriptionDetails?.manufacturerName}
                          placeholder="Manufacturer"
                          className="input w-full rounded-xl px-4 py-2 bg-transparent text-sm border border-primary text-primary opacity-40"
                        />
                      </div>
                      <div className="">
                        <Dropdown
                          label="Supplier"
                          showLabel
                          options={
                            SupplierData?.map((supplier) => ({
                              id: supplier.Id,
                              name: supplier.Name,
                            })) ?? []
                          }
                          isOpen={openDropdown === "supplier"}
                          required
                          search
                          setIsOpen={() => handleSetOpenDropdown("supplier")}
                          onSelect={handleSelectSupplier}
                          placeholder="Supplier"
                          error={
                            formError?.includes("Supplier") &&
                            !inventoryData.SupplierId
                          }
                        />

                        {formError?.includes("Supplier") &&
                          !inventoryData.SupplierId && (
                            <p className="text-xs text-error">
                              Please select a supplier
                            </p>
                          )}
                      </div>
                      <div className="relative">
                        <label className="block text-xs text-text">
                          Manufacture Date
                        </label>
                        <input
                          type="text"
                          name="ManufactureDate"
                          autoComplete="off"
                          value={inventoryData.ManufactureDate}
                          placeholder="YYYY/MM/DD"
                          onChange={(e) =>
                            handleManufactureDateSelect(e.target.value)
                          }
                          className="input w-full rounded-xl px-4 py-2 bg-transparent text-sm text-text placeholder:text-text border border-primary focus:outline-primary focus:ring-0 focus:outline-none"
                        />
                      </div>

                      <div className={`${isExpiry ? "" : "hidden"}`}>
                        <label className="block text-xs text-text">
                          Expiration Date<span className="text-error">*</span>
                        </label>
                        <input
                          type="text"
                          name="ExpirationDate"
                          autoComplete="off"
                          value={inventoryData.ExpirationDate}
                          placeholder="YYYY/MM/DD"
                          onChange={(e) =>
                            handleExpiryDateSelect(e.target.value)
                          }
                          required={isExpiry}
                          className="input w-full rounded-xl px-4 py-2 bg-transparent text-sm text-text placeholder:text-text border border-primary focus:outline-primary focus:ring-0 focus:outline-none"
                        />
                      </div>
                      <div className="">
                        <label className="block text-xs text-text">
                          Location <span className="text-error">*</span>
                        </label>
                        <input
                          type="text"
                          name="Shelf"
                          value={inventoryData.Shelf}
                          onChange={handleInputChange}
                          className="input w-full rounded-xl px-4 py-2 bg-transparent text-sm text-text placeholder:text-text border border-primary  focus:outline-primary focus:ring-0 focus:outline-none"
                          placeholder="Inventory Location"
                          required
                        />
                      </div>

                      <div className="w-full">
                        <label className="block text-xs text-text">
                          Remarks
                        </label>
                        <input
                          type="text"
                          name="Remarks"
                          value={inventoryData.Remarks}
                          onChange={handleInputChange}
                          className="input w-full rounded-xl px-4 py-2 bg-transparent text-sm text-text placeholder:text-text border border-primary  focus:outline-primary focus:ring-0 focus:outline-none"
                          placeholder="Remarks"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-row-2 gap-2 w-60 mx-auto">
                    <button
                      type="submit"
                      className="submit-button md:border-2 text-text md:text-success max-md:bg-success md:border-success py-2 px-4 md:hover:bg-success md:hover:text-white rounded-xl disabled:bg-success disabled:opacity-55 disabled:text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="cancel-button bg-error hover:opacity-60 py-2 px-4 text-white rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
          </form>
        </div>

        {showConfirmationModal && (
          <ConfirmationModal
            onConfirm={handleConfirmNavigation}
            onCancel={handleDismissNavigation}
          />
        )}
      </div>
    </>
  );
}
