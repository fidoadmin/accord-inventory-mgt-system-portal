import React, { useState, useEffect } from "react";
import { useCheckoutInventoryDescriptionList } from "@/app/hooks/checkoutInventoryDescriptons/useCheckoutInventoryDescriptionList";
import { getCookie } from "cookies-next";
import { useCheckoutInventories } from "@/app/hooks/getcheckoutinventories/useGetCheckoutInventories";
import ReturnBarcodePage from "./ReturnCheckoutOverlay";
import { CancelRounded, EditRounded, SaveRounded } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useUpdateReturnCheckoutList } from "@/app/hooks/checkouts/useReturnCheckoutList";

interface ReturnOverlayProps {
  checkoutNumber: string;
  closeOverlay: () => void;
}

const ReturnOverlay: React.FC<ReturnOverlayProps> = ({
  checkoutNumber,
  closeOverlay,
}) => {
  const [returnReason, setReturnReason] = useState<string>("");
  const [returnData, setReturnData] = useState<any[]>([]);
  const [selectedDescription, setSelectedDescriptionId] = useState<string>("");
  const [isDescriptionSelected, setIsDescriptionSelected] = useState(false);
  const [validatedScannedItems, setValidatedScannedItems] = useState<
    { barcode: string }[]
  >([]);
  const [showBarcodePage, setShowBarcodePage] = useState(false);
  const [editingRows, setEditingRows] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [quantities, setQuantities] = useState<{
    [key: number]: number | "";
  }>({});

  const authKey = getCookie("authKey") as string;

  const { mutate: updateReturnCheckoutList } = useUpdateReturnCheckoutList();

  const { data, error, isLoading } = useCheckoutInventoryDescriptionList(
    authKey,
    checkoutNumber,
    { varsearch: "" }
  );

  const { data: checkoutinventories } = useCheckoutInventories(
    checkoutNumber,
    selectedDescription
  );

  useEffect(() => {
    if (data?.data) {
      setReturnData(data.data);
    }
  }, [data]);

  const handleSelectDescription = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    setSelectedDescriptionId(selectedValue);
    setIsDescriptionSelected(selectedValue !== "");
    setShowBarcodePage(true);
  };
  const handleValidateBarcode = (scannedItems: { barcode: string }[]) => {
    setValidatedScannedItems(scannedItems);
  };
  const toggleEditRow = (index: number) => {
    setEditingRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  const handleSaveItem = (index: number) => {
    setEditingRows((prev) => ({
      ...prev,
      [index]: false,
    }));
  };
  const handleCancel = (index: number) => {
    setEditingRows((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });

    setQuantities((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  };
  const handleFinalSave = async () => {
    if (!selectedDescription) {
      toast.error("Please select a description", { position: "top-right" });
      return;
    }

    if (validatedScannedItems.length === 0) {
      toast.error("Please scan at least one barcode", {
        position: "top-right",
      });
      return;
    }

    if (!returnReason.trim()) {
      toast.error("Please enter a return reason", { position: "top-right" });
      return;
    }

    const itemsToReturn =
      checkoutinventories?.data
        .filter((item: any) =>
          validatedScannedItems.some(
            (scanned) =>
              scanned.barcode.trim().toLowerCase() ===
              item.Barcode?.trim().toLowerCase()
          )
        )
        .map((item: any) => {
          const scannedIndex = validatedScannedItems.findIndex(
            (scanned) =>
              scanned.barcode.trim().toLowerCase() ===
              item.Barcode?.trim().toLowerCase()
          );

          const quantity = quantities[scannedIndex] ?? item.Quantity ?? 1;

          return {
            Id: item.Id,
            Quantity: quantity,
            ReturnReason: returnReason,
          };
        }) || [];

    if (itemsToReturn.length === 0) {
      toast.error("No matched items found for scanned barcodes.", {
        position: "top-right",
      });
      return;
    }

    const payload = {
      checkoutNumber: checkoutNumber,
      descriptionId: selectedDescription,
      items: itemsToReturn,
    };

    try {
      await updateReturnCheckoutList(payload);
      closeOverlay();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Error while saving return: ${error.message}`, {
          position: "top-right",
        });
      } else {
        toast.error("Unknown error occurred while saving return.", {
          position: "top-right",
        });
      }
    }
  };
  const uniqueChallans = Array.from(
    new Set(returnData.map((item) => item.ChallanNumber))
  );
  return (
    <div className="w-full p-8 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Return Checkout</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block mb-1 font-medium">Challan Number</label>
          {uniqueChallans.map((challan, index) => (
            <input
              key={index}
              type="text"
              className="w-full p-2 border rounded"
              value={challan}
              readOnly
            />
          ))}
        </div>

        <div className="flex-1">
          <label className="block mb-1 font-medium">Select Description</label>
          <select
            className="w-full p-2 border rounded"
            onChange={handleSelectDescription}
            value={selectedDescription}
          >
            <option value="">-- Select Description --</option>
            {returnData.map((item) => (
              <option key={item.Id} value={item.Id}>
                {`${item.Description} (${item.PackSize})`}
              </option>
            ))}
          </select>
        </div>
      </div>
      {!isDescriptionSelected && (
        <div className="text-center text-black mt-20">
          <p className="text-3xl font-semibold ">
            Select a Description to view its details!
          </p>
          <p className="text-2xl mt-2">
            Choose from the dropdown above to generate return.
          </p>
        </div>
      )}

      {showBarcodePage && (
        <ReturnBarcodePage
          onClose={() => setShowBarcodePage(false)}
          inventory={
            returnData.find((item) => item.Id === selectedDescription) || {}
          }
          onValidate={(scannedItems) => {
            handleValidateBarcode(scannedItems);
            setShowBarcodePage(false);
            setIsDescriptionSelected(true);
          }}
          setIsDescriptionSelected={(value) =>
            setIsDescriptionSelected(!!value)
          }
          setSelectedDescriptionId={(value) =>
            setSelectedDescriptionId(value ?? "")
          }
        />
      )}

      {isDescriptionSelected && (
        <>
          <table className="w-full border-collapse mb-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-3 text-left">SNo</th>
                <th className="py-2 px-3 text-left">Description</th>
                <th className="py-2 px-3 text-left">Expiration Date</th>
                <th className="py-2 px-3 text-left">Barcode</th>
                <th className="py-2 px-3 text-left">Quantity</th>
                <th className="py-2 px-3 text-left">Scan Barcode</th>
                <th className="px-2 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {checkoutinventories?.data.map((item: any, index: number) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="py-2 px-3">{item.Description || "N/A"}</td>
                  <td className="py-2 px-3">{item.ExpirationDate || "N/A"}</td>
                  <td className="py-2 px-3">
                    {validatedScannedItems.some(
                      (scanned) => scanned.barcode === item.Barcode
                    ) ? (
                      <div className="text-success font-bold">
                        {item.Barcode}
                      </div>
                    ) : (
                      <div>{item.Barcode || "N/A"}</div>
                    )}
                  </td>
                  <td className="py-2 px-3">
                    {editingRows[index] ? (
                      <input
                        type="number"
                        className="w-20 border rounded p-1"
                        value={
                          quantities[index] !== undefined
                            ? quantities[index]
                            : item.Quantity ?? 0
                        }
                        onChange={(e) => {
                          const input = e.target.value;

                          if (input === "") {
                            setQuantities((prev) => ({
                              ...prev,
                              [index]: "",
                            }));
                            return;
                          }

                          const value = parseInt(input, 10);

                          if (!isNaN(value)) {
                            if (value <= item.Quantity) {
                              setQuantities((prev) => ({
                                ...prev,
                                [index]: value,
                              }));
                            } else {
                              toast.warn(
                                `Maximum quantity allowed is ${item.Quantity}`,
                                {
                                  position: "top-right",
                                }
                              );
                            }
                          }
                        }}
                        min={0}
                        max={item.Quantity}
                      />
                    ) : (
                      <span>{quantities[index] ?? item.Quantity ?? 0}</span>
                    )}
                  </td>

                  <td className="py-2 px-3">
                    {validatedScannedItems.length > 0 &&
                      validatedScannedItems[index] && (
                        <div>{validatedScannedItems[index]?.barcode}</div>
                      )}
                  </td>
                  <td className="px-4 py-2 flex justify-start gap-2">
                    {editingRows[index] ? (
                      <>
                        <button
                          onClick={() => handleSaveItem(index)}
                          className="mr-2 text-success"
                        >
                          <SaveRounded />
                        </button>
                        <button
                          onClick={() => handleCancel(index)}
                          className="text-error"
                        >
                          <CancelRounded />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => toggleEditRow(index)}
                        className="text-success"
                      >
                        <EditRounded />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <textarea
            className="w-full p-2 border rounded mb-4"
            placeholder="Enter return reason for this item"
            value={returnReason}
            onChange={(e) => setReturnReason(e.target.value)}
          />
        </>
      )}

      {isDescriptionSelected && (
        <div className="flex justify-end gap-3">
          <button
            onClick={closeOverlay}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleFinalSave}
            className="bg-primary text-white px-4 py-2 rounded hover:opacity-80"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default ReturnOverlay;
