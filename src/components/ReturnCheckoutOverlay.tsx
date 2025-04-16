"use client";

import { BulkCheckinInterface } from "@/types/BulkCheckin";
import { DeleteRounded } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

const ReturnBarcodePage = ({
  onClose,
  inventory,
  onValidate,
  setIsDescriptionSelected,
  setSelectedDescriptionId,
}: {
  onClose: () => void;
  inventory: {
    Id: string;
    DescriptionId: string;
    Description: string;
    ShortName: string;
  };
  onValidate: (scannedItems: { barcode: string }[]) => void;
  setIsDescriptionSelected: (value: string | null) => void;
  setSelectedDescriptionId: (value: string | null) => void;
}) => {
  const [barcode, setBarcode] = useState<string>("");
  const [scannedItems, setScannedItems] = useState<
    {
      barcode: string;
      isEditing: boolean;
    }[]
  >([]);
  const router = useRouter();
  const [isFinalBarcode, setIsFinalBarcode] = useState<boolean>(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [quantity, setQuantity] = useState<number | null>(null);
  const [isQuantityOverlayVisible, setIsQuantityOverlayVisible] =
    useState(true);
  const [isDetailsOverlayVisible, setIsDetailsOverlayVisible] = useState(false);
  const barcodeListRef = useRef<HTMLDivElement | null>(null);

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

  const handleDeleteItem = (index: number) => {
    const updatedItems = scannedItems.filter((_, i) => i !== index);

    setScannedItems(updatedItems);
    setBarcode("");
  };

  const resetState = () => {
    setQuantity(0);
    setScannedItems([]);
    setIsDetailsVisible(false);
    setIsQuantityOverlayVisible(true);
    setBarcode("");
    setIsDescriptionSelected(null);
    setSelectedDescriptionId(null);
    onClose();
  };

  const handleQuantityConfirm = () => {
    setIsQuantityOverlayVisible(false);
    setIsDetailsOverlayVisible(true);
    setBarcode("");
  };
  const handleValidateBarcode = () => {
    if (scannedItems.length === quantity) {
      onValidate(scannedItems);
      onClose();
    } else {
      toast.error("Please scan the required number of barcodes.");
    }
  };

  return (
    <div className="fixed inset-0 h-screen flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-md z-20">
      <div className="fixed w-1/2 min-h-72 top-20 right-1/2 translate-x-2/3 p-6  text-text rounded-3xl max-h-screen scrollbar-thin overflow-y-auto mt-4">
        {isQuantityOverlayVisible && (
          <div className="w-full min-h-1 right-1/2 p-6 bg-white border border-tablehead rounded-xl">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Enter Number of Items to Return
              </h3>
              <input
                type="number"
                value={quantity || ""}
                onChange={(e) => {
                  setBarcode("");
                  setQuantity(Number(e.target.value));
                }}
                className="p-2 border border-tablehead rounded-xl w-full"
                placeholder="Enter Number of Items"
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
            <h3 className="text-center text-2xl font-semibold mb-4">Return</h3>

            <div className="flex flex-col">
              <h1 className="text-lg md:text-2xl font-black text-primary text-left">
                Description: {inventory?.Description}
              </h1>
              <h1 className="md:text-lg font-black text-text text-left">
                Short Name: {inventory?.ShortName}
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
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {scannedItems.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{item.barcode}</td>

                      <td className="px-4 py-2 flex justify-start gap-2">
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
                  onClick={handleValidateBarcode}
                  className="bg-success text-white px-4 py-2 rounded-xl"
                  disabled={scannedItems.length != quantity}
                >
                  Validate Barcode
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReturnBarcodePage;
