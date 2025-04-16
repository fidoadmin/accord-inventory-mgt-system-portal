"use client";
import React, { useState } from "react";
import { useBarcode } from "../hooks/barcodes/useBarcode";
import Dropdown from "@/components/Dropdown";
import { useCategoryList } from "../hooks/categories/useCategoryList";
import { useInventoryDescriptionForMaintenance } from "../hooks/inventorydescriptions/useInventoryDescriptionForMaintenance";
import { useContainers } from "../hooks/containers/useContainerList";
import Loading from "../loading";

import { BarcodeResponseInterface } from "@/types/BarcodeInterface";
import Barcode from "react-barcode";
import { toast } from "react-toastify";
import { useDropdownList } from "../hooks/globaldropdown/useGlobalDropdown";
import { getCookie } from "cookies-next";

const GenerateBarcode = () => {
  const barcodeMutation = useBarcode();
  const authKey = getCookie("authKey") as string;

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [formError, setFormError] = useState<string[] | null>(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(0);
  const [categoryId, setCategoryId] = useState<string>("");
  const [descriptionId, setDescriptionId] = useState<string>("");
  const [containerId, setContainerId] = useState<string>("");
  const [barcodeCount, setBarcodeCount] = useState<number>(0);
  const [selectedContainer, setSelectedContainer] = useState<{
    id?: string;
    name?: string;
  }>({});
  const [barcodeList, setBarcodeList] = useState<BarcodeResponseInterface>();
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [search, setSearch] = useState("");

  const handleSetOpenDropdown = (dropdownId: string) => {
    setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  };

  const handleSubmit = async () => {
    const barcodePayload = {
      InventoryDescriptionId: descriptionId,
      ContainerId: containerId,
      CategoryId: categoryId,
      NumberOfBarcodes: barcodeCount,
    };

    try {
      const response = await barcodeMutation.mutateAsync(barcodePayload);
      setBarcodeList(response);
    } catch (error) {
      console.error(error);
    }
  };

  const {
    data: categoryData,
    error: categoryError,
    isLoading: categoryLoading,
  } = useDropdownList("categories", search, filters);

  const { data: inventoryDescriptionList } =
    useInventoryDescriptionForMaintenance(authKey || "", {
      categoryId: categoryId,
    });
  const {
    data: containerList,
    error: containerError,
    isLoading: containerLoading,
  } = useContainers(authKey || "", { categoryId: categoryId });

  const handleSelectCategory = (option: { id: string; name: string }) => {
    setCategoryId(option.id);
    setDescriptionId("");
  };

  const handleSelectDescription = (option: { id: string; name: string }) => {
    setDescriptionId(option.id);
  };

  const handleSelectContainer = (option: { id: string; name: string }) => {
    setSelectedContainer(option);
  };

  const handleSelectPackSize = (option: { id: string; name: string }) => {
    setContainerId(option.id);
  };

  const handleCopyToClipboard = (value: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(value)
        .then(() => {
          toast.success("Barcode copied to clipboard");
        })
        .catch((err) => {
          console.error("Failed to Copy: ", err);
        });
    } else {
      console.error("Clipboard API not supported");
    }
  };

  if (categoryLoading || !categoryData) {
    return <Loading />;
  }

  if (categoryError || containerError)
    return (
      <div className="text-error font-bold text-center">
        Error loading check-in form:{" "}
        {categoryError?.message || containerError?.message}
      </div>
    );

  return (
    <>
      <div className="title mb-6">
        <h1 className=" text-left text-2xl font-bold"> GENERATE BARCODE </h1>
      </div>
      <div className="space-y-2">
        <div className="flex gap-2">
          <Dropdown
            label="Category"
            options={
              categoryData?.map((category) => ({
                id: category.Id,
                name: category.Name,
              })) ?? []
            }
            isOpen={openDropdown === "category"}
            setIsOpen={() => handleSetOpenDropdown("category")}
            onSelect={handleSelectCategory}
            placeholder="Categories"
            required
            search={true}
          />

          <Dropdown
            label="Description"
            options={
              inventoryDescriptionList?.data.map((description) => ({
                id: description.Id,
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
            disabled={!categoryId}
          />
        </div>

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
                formError?.includes("Container") && !selectedContainer.name
              }
              disabled={!descriptionId}
            />
            {formError?.includes("Container") && !selectedContainer.name && (
              <p className="text-xs text-error">Please select a container</p>
            )}
          </div>
          <div className="w-full">
            <Dropdown
              label="Pack Size"
              options={
                containerList?.data
                  .filter(
                    (container) => container.Type === selectedContainer.name
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
              error={formError?.includes("PackSize") && !containerId}
              disabled={!selectedContainer.name?.length}
              search={true}
            />
            {formError?.includes("Container") && !containerId && (
              <p className="text-xs text-error">Please select a pack size</p>
            )}
          </div>
        </div>
        <div className="">
          <div className="w-full">
            <label className="block text-xs text-text">
              Number of Barcodes
            </label>
            <input
              type="number"
              autoComplete="off"
              name="BarcodeCount"
              onChange={(e) => setBarcodeCount(e.target.valueAsNumber)}
              className="input w-full rounded-xl px-4 py-2 bg-transparent text-sm text-text placeholder:text-text border border-primary  focus:outline-primary focus:ring-0 focus:outline-none"
              placeholder="Enter number of barcodes to generate"
              required
            />
          </div>
        </div>
        <div>
          <button
            onClick={handleSubmit}
            className="btn w-fit h-fit bg-success rounded-xl text-white p-2 hover:opacity-80 disabled:opacity-40"
            disabled={
              !categoryId || !descriptionId || !containerId || !barcodeCount
            }
          >
            {" "}
            Generate Barcode{" "}
          </button>
        </div>
      </div>
      {!!barcodeList && (
        <div className="barcodeView grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 2xl:grid-cols-4 justify-items-center gap-4 mt-2">
          {barcodeList?.map((barcode, index) => (
            <div
              key={index}
              onClick={() => handleCopyToClipboard(barcode)}
              className="cursor-pointer w-fit"
            >
              <Barcode
                value={barcode}
                background="transparent"
                // lineColor="#2279dd"
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default GenerateBarcode;
