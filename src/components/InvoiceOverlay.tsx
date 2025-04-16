import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { CloseRounded } from "@mui/icons-material";
import { useCheckoutInventoryDescriptionList } from "@/app/hooks/checkoutInventoryDescriptons/useCheckoutInventoryDescriptionList";
import { useUpdateCheckoutInventoryDescriptions } from "@/app/hooks/checkoutInventoryDescriptons/useCheckoutInventoryDescriptionUpdate";
import { getCookie } from "cookies-next";
interface InvoiceOverlayProps {
  checkoutNumber: string;
  closeOverlay: () => void;
}
const InvoiceOverlay: React.FC<InvoiceOverlayProps> = React.memo(
  ({ checkoutNumber, closeOverlay }) => {
    const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);
    const [amount, setAmount] = useState<string | null>(null);
    const [invoicedate, setInvoiceDate] = useState<string | null>(null);
    const [isIndividualInvoice, setIsIndividualInvoice] =
      useState<boolean>(false);
    const [isIndividualAmount, setIsIndividualAmount] =
      useState<boolean>(false);
    const [isIndividualInvoiceDate, setIsIndividualInvoiceDate] =
      useState<boolean>(false);
    const [hasTypedInvoice, setHasTypedInvoice] = useState<boolean>(false);
    const [hasTypedAmount, setHasTypedAmount] = useState<boolean>(false);
    const [hasTypedInvoiceDate, setHasTypedInvoiceDate] =
      useState<boolean>(false);
    const [invoiceData, setInvoiceData] = useState<any[]>([]);
    const [originalInvoiceData, setOriginalInvoiceData] = useState<any[]>([]);
    const { mutateAsync: updateCheckoutInventoryDescriptions } =
      useUpdateCheckoutInventoryDescriptions();
    const authKey = getCookie("authKey") as string;
    if (!authKey) {
      throw new Error("No authKey found");
    }
    const { data, error, isLoading } = useCheckoutInventoryDescriptionList(
      authKey,
      checkoutNumber,
      { varsearch: "" }
    );
    useEffect(() => {
      if (data && data.data) {
        setInvoiceData(data.data);
        setOriginalInvoiceData(data.data);
      }
    }, [data]);
    useEffect(() => {
      if (!isIndividualInvoice && hasTypedInvoice) {
        setInvoiceData((prevData) =>
          prevData.map((item) => ({
            ...item,
            InvoiceNumber: invoiceNumber,
          }))
        );
        setHasTypedInvoice(false);
      }
      if (!isIndividualAmount && hasTypedAmount) {
        setInvoiceData((prevData) =>
          prevData.map((item) => ({
            ...item,
            Amount: amount,
          }))
        );
        setHasTypedAmount(false);
      }
      if (!isIndividualInvoiceDate && hasTypedInvoiceDate) {
        setInvoiceData((prevData) =>
          prevData.map((item) => ({
            ...item,
            InvoiceDate: invoicedate,
          }))
        );
      }
      setHasTypedInvoiceDate(false);
    }, [
      invoiceNumber,
      isIndividualInvoice,
      amount,
      isIndividualAmount,
      invoicedate,
      isIndividualInvoiceDate,
      hasTypedInvoice,
      hasTypedAmount,
      hasTypedInvoiceDate,
    ]);
    const handleFinalSave = async () => {
      try {
        const records = invoiceData.map(
          ({ Id, InvoiceNumber, Amount, InvoiceDate }) => ({
            Id,
            InvoiceNumber,
            Amount,
            InvoiceDate,
          })
        );
        await updateCheckoutInventoryDescriptions({ records });
        toast.success("Invoice updated successfully!");
        closeOverlay();
      } catch (error) {
        toast.error("Error updating invoice descriptions.");
        console.error(error);
      }
    };
    const handleTabSwitch = () => {
      setInvoiceData([...originalInvoiceData]);
      setInvoiceNumber("");
      setAmount("");
      setInvoiceDate("");
    };
    const handleInvoiceDateSelect = (value: string) => {
      let formattedValue = value.replace(/[^\d-]/g, "");
      if (/^\d{4}-\d{2}-\d{2}$/.test(formattedValue)) {
        setInvoiceDate(formattedValue);
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
        setInvoiceDate(formattedValue);
      }
    };
    const formatInvoiceDate = (value: string) => {
      let formattedValue = value.replace(/[^\d-]/g, "");
      if (/^\d{4}-\d{2}-\d{2}$/.test(formattedValue)) {
        return formattedValue;
      }
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
      return formattedValue;
    };
    if (isLoading)
      return (
        <div className="overlay-container fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-50">
          <div className="text-white font-bold text-2xl">Loading...</div>
        </div>
      );
    if (error) return <div>Error loading data.</div>;
    return (
      <div className="overlay-container fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-50">
        <div className="overlay-content bg-white p-8 rounded-lg shadow-lg w-full md:w-3/4 lg:w-2/3 max-h-[90vh] mt-8 overflow-hidden flex flex-col">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl text-center font-bold">Invoice Details</h1>
            <button onClick={closeOverlay}>
              <CloseRounded />
            </button>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setIsIndividualInvoice(false);
                  setIsIndividualAmount(false);
                  setIsIndividualInvoiceDate(false);
                  handleTabSwitch();
                }}
                className={`py-1 px-4 rounded-lg ${
                  !isIndividualInvoice &&
                  !isIndividualAmount &&
                  !isIndividualInvoiceDate
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Add Invoice (to All)
              </button>
              <button
                onClick={() => {
                  setIsIndividualInvoice(true);
                  setIsIndividualAmount(true);
                  setIsIndividualInvoiceDate(true);
                  handleTabSwitch();
                }}
                className={`py-1 px-4 rounded-lg ${
                  isIndividualInvoice &&
                  isIndividualAmount &&
                  isIndividualInvoiceDate
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Add Individual Invoice
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="w-full md:w-1/5">
              <span className="block text-lg font-bold text-gray-700 mb-1">
                Invoice Number:
              </span>
              <input
                id="invoiceNumber"
                type="text"
                value={invoiceNumber || ""}
                onChange={(e) => {
                  setInvoiceNumber(e.target.value);
                  setHasTypedInvoice(true);
                }}
                placeholder="Enter Invoice Number for all"
                className="border border-tablehead p-2 rounded-lg w-full"
                disabled={isIndividualInvoice}
              />
            </div>
            <div className="w-full md:w-1/5">
              <span className="block text-lg font-bold text-gray-700 mb-1">
                Amount:
              </span>
              <input
                id="amount"
                type="text"
                value={amount || ""}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setHasTypedAmount(true);
                }}
                placeholder="Enter Amount for all"
                className="border border-tablehead p-2 rounded-lg w-full"
                disabled={isIndividualAmount}
              />
            </div>
            <div className="w-full md:w-1/5">
              <span className="block text-lg font-bold text-gray-700 mb-1">
                Invoice Date:
              </span>
              <input
                id="invoiceDate"
                type="text"
                value={invoicedate || ""}
                onChange={(e) => {
                  handleInvoiceDateSelect(e.target.value);
                  setHasTypedInvoiceDate(true);
                }}
                placeholder="Enter Invoice Date for all"
                className="border border-tablehead p-2 rounded-lg w-full"
                disabled={isIndividualInvoiceDate}
              />
            </div>
          </div>
          {invoiceData.length === 0 ? (
            <div className="text-center text-gray-500 py-4">No items found</div>
          ) : (
            <div className="overflow-x-auto border-2 rounded-lg mt-2">
              <table className="w-full border-collapse table-auto">
                <thead>
                  <tr className="bg-tablehead border text-left">
                    <th className="cursor-pointer text-left border-b py-2 px-2 text-sm">
                      Description
                    </th>
                    <th className="cursor-pointer text-left border-b py-2 px-2 text-sm">
                      Invoice Number
                    </th>
                    <th className="cursor-pointer text-left border-b py-2 px-2 text-sm">
                      Taxable Amount
                    </th>
                    <th className="cursor-pointer text-left border-b py-2 px-2 text-sm">
                      Invoice Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.map((item) => (
                    <tr key={item.Id} className="border hover:bg-gray-50">
                      <td className="pl-8">{item.Description}</td>
                      <td className="text-left py-2 px-2 text-sm">
                        {isIndividualInvoice ? (
                          <input
                            type="text"
                            value={item.InvoiceNumber}
                            onChange={(e) =>
                              setInvoiceData((prevData) =>
                                prevData.map((i) =>
                                  i.Id === item.Id
                                    ? { ...i, InvoiceNumber: e.target.value }
                                    : i
                                )
                              )
                            }
                            className="border p-2 rounded-lg"
                          />
                        ) : (
                          item.InvoiceNumber
                        )}
                      </td>
                      <td className="text-left py-2 px-2 text-sm">
                        {isIndividualAmount ? (
                          <input
                            type="text"
                            value={item.Amount}
                            onChange={(e) =>
                              setInvoiceData((prevData) =>
                                prevData.map((i) =>
                                  i.Id === item.Id
                                    ? { ...i, Amount: e.target.value }
                                    : i
                                )
                              )
                            }
                            className="border p-2 rounded-lg"
                          />
                        ) : (
                          item.Amount
                        )}
                      </td>
                      <td className="text-left py-2 px-2 text-sm">
                        {isIndividualInvoiceDate ? (
                          <input
                            type="text"
                            value={item.InvoiceDate}
                            onChange={(e) => {
                              const formattedDate = formatInvoiceDate(
                                e.target.value
                              );
                              setInvoiceData((prevData) =>
                                prevData.map((i) =>
                                  i.Id === item.Id
                                    ? { ...i, InvoiceDate: formattedDate }
                                    : i
                                )
                              );
                            }}
                            className="border p-2 rounded-lg"
                          />
                        ) : (
                          item.InvoiceDate
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleFinalSave}
              className="border rounded-xl px-6 py-2 bg-blue-500 text-white hover:opacity-80"
            >
              Save All
            </button>
          </div>
        </div>
      </div>
    );
  }
);
InvoiceOverlay.displayName = "InvoiceOverlay";
export default InvoiceOverlay;
