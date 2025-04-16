"use client";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UpdateInventoryForm from "@/components/UpdateInventoryForm";
import { useInventoryDetails } from "@/app/hooks/inventories/useInventoryDetail";
import {
  CheckRounded,
  DeleteRounded,
  EditRounded,
  KeyboardArrowLeftRounded,
  WarningRounded,
} from "@mui/icons-material";
import { useDeleteInventory } from "@/app/hooks/inventories/useInventoryDelete";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { useAddOrUpdateInventory } from "@/app/hooks/inventories/useInventoryAddOrUpdate";
import { InventoryDetailInterface } from "@/types/InventoryInterface";
import ScannerIcon from "@mui/icons-material/Scanner";
import Loading from "@/app/loading";
import React from "react";
import { BulkCheckinInterface } from "@/types/BulkCheckin";
import { useAddOrUpdateBulkCheckin } from "@/app/hooks/bulkcheckin/useBulkCheckinAddOrUpdate";
import BulkCheckin from "@/components/BulkCheckIn";
import { useSearchParams } from "next/navigation";
import { getCookie } from "cookies-next";

const InventoryDetail = (context: any) => {
  const authKey = getCookie("authKey") as string;

  const [isEditing, setIsEditing] = useState(false);
  const [barcodeEdit, setBarcodeEdit] = useState(false);
  const [barcode, setBarcode] = useState<string>("");
  const [currentBarcode, setCurrentBarcode] = useState<string>("");
  const [currentBarcodeIndex, setCurrentBarcodeIndex] = useState<Number>();

  const searchParams = useSearchParams();
  const isCheckin = searchParams.get("isCheckin") === "true";

  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [quantityList, setQuantityList] = useState<number[]>([]);
  const [showBulkInOverlay, setShowBulkCheckInOverlay] =
    useState<boolean>(false);
  const [entriesCount, setEntriesCount] = useState(0);
  const [editableBulkCheckin, setEditableBulkCheckin] =
    useState<BulkCheckinInterface | null>(null);
  const [isExpiry, setIsExpiry] = useState<boolean>(true);

  const [Bulk, setBulk] = useState<any[]>([]);
  const [editingCheckinId, setEditingCheckinId] = useState<string | null>(null);
  const [entries, setEntries] = useState<
    { BarCode: string; SerialNumber: string }[]
  >([]);
  const [editMode, setEditMode] = useState<boolean[]>(
    new Array(quantity).fill(false)
  );
  const [totalEntered, setTotalEntered] = useState<number>(0);

  const handleOverlayToggle = () => {
    setShowBulkCheckInOverlay(!showBulkInOverlay);
  };

  const router = useRouter();
  const deleteMutation = useDeleteInventory();
  const addOrUpdateInventory = useAddOrUpdateInventory();
  const { mutate: addOrUpdateBulkCheckin } = useAddOrUpdateBulkCheckin();
  const { params } = context;
  const { data, error, isLoading, refetch } = useInventoryDetails(
    authKey,
    params.inventoryId
  );

  const [inventoryData, setInventoryData] =
    useState<InventoryDetailInterface | null>(null);

  useEffect(() => {
    if (data) {
      setInventoryData({ ...data });
    }
  }, [data]);

  useEffect(() => {
    if (data?.ExpirationDate) {
      setIsExpiry(true);
    } else {
      setIsExpiry(false);
    }
  }, [data?.ExpirationDate]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleEditBarcode = () => {
    setBarcodeEdit(!barcodeEdit);
  };

  const handleSubmitCurrentBarcode = (barcode: string) => {
    setCurrentBarcode(barcode);
  };

  const handleBulkDelete = (index: number) => {
    const newEntries = [...entries];

    newEntries[index] = { BarCode: "", SerialNumber: "" };

    setEntries(newEntries);

    const validEntries = newEntries.filter(
      (entry) => entry.BarCode && entry.SerialNumber
    );
    setTotalEntered(validEntries.length);
  };

  const handleBarcodeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!barcode) return;

    const updatedInventoryData = {
      ...inventoryData,
      BarCode: barcode,
    } as InventoryDetailInterface;

    try {
      await addOrUpdateInventory.mutateAsync({ ...updatedInventoryData });
      setInventoryData(updatedInventoryData);
      handleEditBarcode();
      toast.success("Barcode added successfully!");
      refetch();
    } catch (error) {
      console.error("Failed to add or update inventory:", error);
      toast.error("Failed to add barcode. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync({
        Id: data?.Id as string,
        AuthKey: authKey,
      });
      toast.error(`Successfully deleted ${data?.Description} ID: ${data?.Id}`);
      router.push(`/inventory/details/${params.descriptionId}`);
    } catch (error) {
      console.error("Failed to delete inventory:", error);
      toast.error("Failed to delete inventory. Please try again.");
    }
  };

  const handleOnSave = (status: boolean) => {
    setIsEditing(status);
  };

  if (isLoading || !data) {
    return <Loading />;
  }
  if (error) return <div>Error: {error.message}</div>;

  const resetState = () => {
    setQuantity(0);
    setEntries([]);
    setIsDetailsVisible(false);
    setIsOverlayVisible(false);
    setTotalEntered(0);
  };
  const handleConfirmQuantity = () => {
    setIsDetailsVisible(true);
  };

  const handelBarcodeDetails = (index: Number) => {
    setCurrentBarcodeIndex(index);
  };
  console.log();
  return (
    <>
      <div className="backBtn flex px-4 mx-auto">
        <button
          type="button"
          onClick={() =>
            router.push(`/inventory/details/${params.descriptionId}`)
          }
        >
          <KeyboardArrowLeftRounded />
        </button>
      </div>

      {data && (
        <>
          {isEditing ? (
            <UpdateInventoryForm
              inventory={data}
              onSave={handleOnSave}
              isCheckin={isCheckin}
            />
          ) : (
            <>
              <div className="mb-4">
                <div className={`container mx-auto p-4`}>
                  <div className="">
                    <h1 className="text-lg md:text-2xl font-black text-primary text-center">
                      {data?.Description}
                    </h1>
                    <h1 className="md:text-lg font-black text-text text-center">
                      {data?.CategoryName}
                    </h1>
                  </div>
                </div>
                <div className="text-center bg-surface p-4 rounded-xl">
                  <p className="text-primary font-semibold">Bar Code</p>
                  {data?.BarCode ? (
                    <p className="text-text">{data?.BarCode}</p>
                  ) : !barcodeEdit ? (
                    <button
                      className="text-error hover:opacity-80"
                      onClick={handleEditBarcode}
                    >
                      <span>
                        <WarningRounded className="text-error" />
                      </span>
                      Add inventory barcode
                    </button>
                  ) : (
                    <div className="flex items-center justify-center">
                      <input
                        className="text-text bg-background rounded-xl text-left pl-2"
                        onChange={(e) => setBarcode(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={handleBarcodeSubmit}
                        className="ml-2"
                      >
                        <CheckRounded className="text-success" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center md:px-8 py-4">
                    <div className="flex text-left gap-4">
                      <p className="text-primary font-semibold">HS Code: </p>
                      <p className="text-text">{data?.HSCode}</p>
                    </div>
                    <div className="flex text-left gap-4">
                      <p className="text-primary font-semibold">
                        Serial Number:{" "}
                      </p>
                      <p className="text-text">{data?.SerialNumber}</p>
                    </div>

                    <div className="flex text-left gap-4">
                      <p className="text-primary font-semibold">PI Number: </p>
                      <p className="text-text">{data?.ProformaInvoiceNumber}</p>
                    </div>
                    <div className="flex text-left gap-4">
                      <p className="text-primary font-semibold">
                        Invoice Number:{" "}
                      </p>
                      <p className="text-text">{data?.InvoiceNumber}</p>
                    </div>
                    <div className="flex text-left gap-4">
                      <p className="text-primary font-semibold">PO Number: </p>
                      <p className="text-text">{data?.PurchaseOrderNumber}</p>
                    </div>
                    <div className="flex text-left gap-4">
                      <p className="text-primary font-semibold">Short Name: </p>
                      <p className="text-text">{data?.ShortName}</p>
                    </div>
                    {data?.ModelNumber && (
                      <div className="flex text-left gap-4">
                        <p className="text-primary font-semibold">Model No: </p>
                        <p className="text-text">{data?.ModelNumber}</p>
                      </div>
                    )}
                    {data?.PartNumber && (
                      <div className="flex text-left gap-4">
                        <p className="text-primary font-semibold">
                          Part Number:{" "}
                        </p>
                        <p className="text-text">{data?.PartNumber}</p>
                      </div>
                    )}
                    <div className="flex text-left gap-4">
                      <p className="text-primary font-semibold">
                        Batch Number:{" "}
                      </p>
                      <p className="text-text">{data?.BatchNumber}</p>
                    </div>
                    <div className="flex text-left gap-4">
                      <p className="text-primary font-semibold">Tender: </p>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={data?.Tender ?? false}
                          disabled
                          className="sr-only"
                        />
                        <span
                          className={`w-11 h-6 rounded-full transition-colors ${
                            data?.Tender ? "bg-success" : "bg-gray-200"
                          }`}
                        ></span>
                        <span
                          className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
                            data?.Tender ? "translate-x-5" : "translate-x-0"
                          }`}
                        ></span>
                      </label>
                    </div>

                    <div className="flex text-left gap-4">
                      <p className="text-primary font-semibold">TT Number: </p>
                      <p className="text-text">{data?.TTNumber}</p>
                    </div>
                    <div className="flex text-left gap-4">
                      <p className="text-primary font-semibold">LC Number: </p>
                      <p className="text-text">{data?.LCNumber}</p>
                    </div>
                    <div className="flex text-left gap-4">
                      <p className="text-primary font-semibold">
                        Other Reference Number:
                      </p>
                      <p className="text-text">{data?.OtherReferenceNumber}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center md:px-8 bg-surface rounded-xl py-4">
                    <div className="flex text-left gap-4">
                      <p className="text-primary font-semibold">Company: </p>
                      <p className="text-text">{data?.CompanyName}</p>
                    </div>
                    <div className="flex text-left gap-4">
                      <p className="text-primary font-semibold">Branch: </p>
                      <p className="text-text">{data?.BranchName}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center md:px-8 py-4">
                    <div className="flex text-left gap-4">
                      <p className="text-primary font-semibold">
                        Manufacturer:{" "}
                      </p>
                      <p className="text-text">{data?.ManufacturerName}</p>
                    </div>
                    <div className="flex text-left gap-4">
                      <p className="text-primary font-semibold">Supplier: </p>
                      <p className="text-text">{data?.SupplierName}</p>
                    </div>
                    <div className="flex text-left gap-4">
                      <p className="text-primary font-semibold">
                        Manufacture Date:{" "}
                      </p>
                      <p className="text-text">{data?.ManufactureDate}</p>
                    </div>
                    <div className={`${isExpiry ? "" : "hidden"}`}>
                      <div className="flex text-left gap-4">
                        <p className="text-primary font-semibold">
                          Expiry Date:{" "}
                        </p>
                        <p className="text-text">{data?.ExpirationDate}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center md:px-8 bg-surface rounded-xl py-4">
                    <div className="flex text-left gap-4">
                      <p className="text-primary font-semibold">Pack Size: </p>
                      <p className="text-text text-left flex gap-2">
                        <span className="w-24">{data?.ContainerType}</span> of{" "}
                        <span className="w-40">{data?.PackSize}</span>
                      </p>
                    </div>
                    <div className="flex text-left gap-4">
                      <p className="text-primary font-semibold">Quantity: </p>
                      <p className="text-text">{data?.Quantity}</p>
                    </div>{" "}
                    <div className="flex text-left gap-4">
                      <p className="text-primary font-semibold">Location: </p>
                      <p className="text-text">{data?.Shelf}</p>
                    </div>
                    <div className="flex text-left gap-4">
                      <p className="text-primary font-semibold">Remarks: </p>
                      <p className="text-text">{data?.Remarks}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 text-center md:px-8 py-4"></div>
                </div>
                <div className="fixed bottom-4 right-4 space-y-2">
                  <div>
                    {isCheckin && (
                      <div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={handleOverlayToggle}
                            className="group bg-secondary text-white px-4 py-2 rounded-xl shadow-lg hover:opacity-80 transition"
                            title="Bulk Scan"
                          >
                            <span className="hidden group-hover:inline pr-2">
                              Bulk Scan
                            </span>
                            <ScannerIcon />
                          </button>
                        </div>
                      </div>
                    )}

                    {showBulkInOverlay && (
                      <BulkCheckin
                        onClose={handleOverlayToggle}
                        inventory={{
                          Id: data?.Id,
                          DescriptionId: data?.InventoryDescriptionId,
                          Description: data?.Description,
                          CategoryName: data?.CategoryName,
                          SerialNumber: data?.SerialNumber,
                        }}
                      />
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleEditToggle}
                      className="group bg-secondary text-white px-4 py-2 rounded-xl shadow-lg hover:opacity-80 transition"
                      title="Edit this inventory"
                    >
                      <span className="hidden group-hover:inline pr-2">
                        Edit this inventory
                      </span>
                      <EditRounded />
                    </button>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="group bg-error text-white px-4 py-2 rounded-xl shadow-lg hover:bg-errorAccent transition"
                      title="Delete this inventory"
                    >
                      <span className="hidden group-hover:inline pr-2">
                        Delete this inventory
                      </span>
                      <DeleteRounded />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default InventoryDetail;
