"use client";

import { useAddOrUpdateBulkCheckin } from "@/app/hooks/bulkcheckin/useBulkCheckinAddOrUpdate";
import { BulkCheckinInterface } from "@/types/BulkCheckin";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";

const BarcodeReaderPage = ({
  onClose,
  inventory,
}: {
  onClose: () => void;
  inventory: {
    Id: string;
    DescriptionId: string;
    Description: string;
    CategoryName: string;
    SerialNumber: string;
  };
}) => {
  const [barcode, setBarcode] = useState<string>("");
  const [scannedItems, setScannedItems] = useState<
    {
      barcode: string;
      serialNumber?: string;
      isEditing: boolean;
    }[]
  >([]);
  const router = useRouter();
  const [isFinalBarcode, setIsFinalBarcode] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [quantity, setQuantity] = useState<number | null>(null);
  const [isQuantityOverlayVisible, setIsQuantityOverlayVisible] =
    useState(true);
  const [isDetailsOverlayVisible, setIsDetailsOverlayVisible] = useState(false);
  const [editableBulkCheckin, setEditableBulkCheckin] =
    useState<BulkCheckinInterface | null>(null);
  const [editingCheckinId, setEditingCheckinId] = useState<string | null>(null);
  const [Bulk, setBulk] = useState<any[]>([]);
  const barcodeListRef = useRef<HTMLDivElement | null>(null);
  const { mutateAsync: addOrUpdateBulkCheckin } = useAddOrUpdateBulkCheckin();

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyPress = async (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "j") {
        e.preventDefault();
        return;
      }

      if (
        e.key === "Backspace" ||
        e.key === "Delete" ||
        e.key.startsWith("Arrow")
      ) {
        return;
      }

      if (/^[0-9a-zA-Z]$/.test(e.key)) {
        setBarcode((prev) => prev + e.key);

        if (debounceTimeout.current) {
          clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = await setTimeout(() => {
          if (scannedItems.length === quantity) {
            toast.error("Cannot scan more than required quantity");
            setBarcode("");
            return;
          } else {
            setIsFinalBarcode(true);
          }
        }, 50);
      } else {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [barcode]);

  useEffect(() => {
    if (isFinalBarcode && quantity != null) {
      if (
        !scannedItems.some((item) => item.barcode === barcode.toUpperCase())
      ) {
        const newItem = {
          barcode: barcode.toUpperCase(),
          isEditing: false,
        };

        setScannedItems((prev) => {
          const updatedItems = [...prev, newItem];
          setTimeout(() => {
            if (barcodeListRef.current) {
              const newItemElement = barcodeListRef.current.lastElementChild;
              if (newItemElement) {
                newItemElement.scrollIntoView({ behavior: "smooth" });
              }
            }
          }, 100);
          return updatedItems;
        });
      } else {
        toast.error("This barcode has already been scanned.");
      }

      setBarcode("");
      setIsFinalBarcode(false);
    }
  }, [isFinalBarcode, scannedItems, barcode, quantity]);

  const handleSerialNumberChange = (index: number, newSerialNumber: string) => {
    const updatedItems = [...scannedItems];
    updatedItems[index].serialNumber = newSerialNumber;
    setScannedItems(updatedItems);
    setBarcode("");
  };

  const handleDeleteItem = (index: number) => {
    const updatedItems = scannedItems.filter((_, i) => i !== index);

    setScannedItems(updatedItems);
    setBarcode("");
  };

  const handleEditItem = (index: number) => {
    const updatedItems = [...scannedItems];
    updatedItems[index].isEditing = !updatedItems[index].isEditing;
    setScannedItems(updatedItems);
    setIsEditing(true);
    setBarcode("");
  };

  const handleSaveItem = (index: number) => {
    const updatedItems = [...scannedItems];
    updatedItems[index].isEditing = false;
    setScannedItems(updatedItems);
    setIsEditing(false);
    setBarcode("");
  };

  const resetState = () => {
    setQuantity(0);
    setScannedItems([]);
    setIsDetailsVisible(false);
    setIsQuantityOverlayVisible(true);
    onClose();
    setBarcode("");
  };

  const handleConfirmClick = async () => {
    const missingSerialNumber = scannedItems.some(
      (item) => inventory.SerialNumber && !item.serialNumber
    );
    if (missingSerialNumber) {
      toast.error("Please enter serial numbers for all items.");
      return;
    }

    const payload: BulkCheckinInterface = {
      Id: inventory.Id,
      BulkCheckin: scannedItems.map((entry) => ({
        BarCode: entry.barcode,
        SerialNumber: entry.serialNumber ? entry.serialNumber : null,
      })),
    };

    setBulk((prevBulk) =>
      prevBulk.map((bulk) =>
        bulk.Id === editingCheckinId
          ? { ...bulk, ...editableBulkCheckin }
          : bulk
      )
    );

    try {
      const result = await addOrUpdateBulkCheckin(payload);
      if (result) {
        setEditingCheckinId(null);
        setEditableBulkCheckin(editableBulkCheckin);
        toast.success("Bulk Checkin updated successfully!");
        router.push(`/inventory/details/${inventory.DescriptionId}`);
      }
    } catch (err) {}
  };

  const handleQuantityConfirm = () => {
    setIsQuantityOverlayVisible(false);
    setIsDetailsOverlayVisible(true);
    setBarcode("");
  };

  return (
    <div className="fixed inset-0 h-screen flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-md z-20">
      <div className="fixed w-1/2 min-h-72 top-20 right-1/2 translate-x-2/3 p-6  text-text rounded-3xl max-h-screen scrollbar-thin overflow-y-auto mt-4">
        {isQuantityOverlayVisible && (
          <div className="w-full min-h-1 right-1/2 p-6 bg-white border border-tablehead rounded-xl">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Enter Quantity for Bulk Check-in
              </h3>
              <input
                type="number"
                value={quantity || ""}
                onChange={(e) => {
                  setBarcode("");
                  setQuantity(Number(e.target.value));
                }}
                className="p-2 border border-tablehead rounded-xl w-full"
                placeholder="Enter Quantity"
              />
            </div>

            <div className="flex justify-between mt-2">
              <button
                onClick={resetState}
                className="bg-error text-white px-4 py-2 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleQuantityConfirm}
                className="bg-success text-white px-4 py-2 rounded-xl"
              >
                Confirm
              </button>
            </div>
          </div>
        )}

        {isDetailsOverlayVisible && (
          <div className="bg-white border border-tablehead  p-6 rounded-xl shadow-lg max-w-screen-lg w-full  ">
            <h3 className="text-center text-2xl font-semibold mb-4">
              Bulk Check-in
            </h3>

            <div className="flex flex-col">
              <h1 className="text-lg md:text-2xl font-black text-primary text-left">
                Description: {inventory?.Description}
              </h1>
              <h1 className="md:text-lg font-black text-text text-left">
                Category: {inventory?.CategoryName}
              </h1>
              <div className="flex flex-col justify-start items-end">
                <div className="px-4 py-2 rounded-xl border border-tablehead w-fit mb-2">
                  Total required: {quantity ? quantity : 0}
                </div>
              </div>
              <div className="flex flex-col justify-start items-end">
                <div className="px-4 py-2 rounded-xl border border-tablehead w-fit mb-2">
                  Total scanned: {scannedItems.length}
                </div>
              </div>
            </div>

            <div
              ref={barcodeListRef}
              className="w-full overflow-auto"
              style={{ maxHeight: "260px" }}
            >
              <table className="w-full table-fixed">
                <thead>
                  <tr className="border-2 bg-tablehead">
                    <th className="px-4 py-2 text-left">SNo</th>
                    <th className="px-4 py-2 text-left">Barcode</th>
                    {inventory.SerialNumber && (
                      <th className="px-4 py-2 text-left">
                        Serial Number
                        <span className="text-error pl-2">*</span>
                      </th>
                    )}
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {scannedItems.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{item.barcode}</td>
                      {inventory.SerialNumber && (
                        <td className="px-4 py-2">
                          {item.isEditing ? (
                            <input
                              type="text"
                              value={item.serialNumber}
                              onChange={(e) =>
                                handleSerialNumberChange(index, e.target.value)
                              }
                              className="w-full p-2 border rounded-xl"
                              required
                            />
                          ) : (
                            <span>{item.serialNumber}</span>
                          )}
                        </td>
                      )}
                      <td className="px-4 py-2 flex justify-start gap-2">
                        {inventory.SerialNumber && (
                          <div className="flex gap-2">
                            {item.isEditing ? (
                              <>
                                <button
                                  onClick={() => handleSaveItem(index)}
                                  className="bg-success text-white px-4 py-2 rounded-xl"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => handleEditItem(index)}
                                  className="bg-error text-white px-4 py-2 rounded-xl"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleEditItem(index)}
                                className="text-success"
                              >
                                <EditRounded />
                              </button>
                            )}
                          </div>
                        )}
                        {!item.isEditing && (
                          <button
                            onClick={() => handleDeleteItem(index)}
                            className="text-error"
                          >
                            <DeleteRounded />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between mt-4">
                <button
                  onClick={resetState}
                  className="bg-error text-white px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmClick}
                  className="bg-success text-white px-4 py-2 rounded-xl"
                  disabled={scannedItems.length != quantity}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarcodeReaderPage;
