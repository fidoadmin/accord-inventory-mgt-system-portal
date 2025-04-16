import React, { useEffect, useState } from "react";
import { checkoutListCardPropsInterface } from "@/types/ComponentInterface";
import {
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
  LaunchRounded,
} from "@mui/icons-material";
import CheckoutListInnerCard from "./CheckoutListInnerCard";
import Link from "next/link";
import { useReturnCheckoutList } from "@/app/hooks/checkouts/useReturnCheckout";
import { toast } from "react-toastify";
import InvoiceOverlay from "./InvoiceOverlay";
import ReturnOverlay from "./Return";

const CheckoutListCard: React.FC<checkoutListCardPropsInterface> = ({
  checkoutListItem,
  isreturn,
  isinvoice,
  onHasReturnChange,
}) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [isInvoiceOverlayOpen, setIsInvoiceOverlayOpen] = useState(false);
  const [isReturnOverlayOpen, setIsReturnOverlayOpen] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [roleCode, setRoleCode] = useState<string | null>(null);
  const [showReturnOptions, setShowReturnOptions] = useState(false);
  const [hasReturn, setHasReturn] = useState(false);

  const returnMutation = useReturnCheckoutList();

  const handleAccordionToggle = () => {
    setShowReturnOptions(false);
    setIsAccordionOpen(!isAccordionOpen);
  };

  const handleHasReturn = (hasReturn: boolean) => {
    setHasReturn(hasReturn);
  };

  const handleDetailsClick = (
    checkoutNumber: string,
    statusCode: string,
    checkoutType: string
  ) => {
    let Url = "";
    if (
      statusCode === "CHECKOUT-DISPATCHED" ||
      statusCode === "CHECKOUT-RETURNED"
    ) {
      checkoutType === "BranchTransfer"
        ? (Url = `/checkout/${checkoutNumber}/btChallan`)
        : (Url = `/checkout/${checkoutNumber}/challan?page=1&onlySaleChallan=${isreturn}`);
    } else {
      Url = `/checkout/${checkoutNumber}`;
    }
    return Url;
  };

  const handleReturnClick = async () => {
    if (returnReason.trim()) {
      await returnMutation.mutateAsync({
        checkoutNumber: checkoutListItem.CheckoutNumber,
        reason: returnReason,
      });
      setIsOverlayOpen(false);
      setIsAccordionOpen(false);
    } else {
      toast.info("Please provide a return reason.");
    }
  };

  const handleAddInvoiceClick = async () => {
    if (invoiceNumber.trim()) {
      if (checkoutListItem.InvoiceNumber) {
        console.log(`Invoice Number Updated: ${invoiceNumber}`);
      } else {
        console.log(`Invoice Number Added: ${invoiceNumber}`);
      }
      setIsInvoiceOverlayOpen(false);
      setIsAccordionOpen(false);
    } else {
      toast.info("Please enter a valid invoice number.");
    }
  };
  useEffect(() => {
    const RoleCode = localStorage.getItem("RoleCode");
    setRoleCode(RoleCode);
  }, []);

  return (
    <div className="relative">
      <table className="w-full table-auto border-2 rounded-xl overflow-hidden text-sm bg-white">
        <tbody>
          <tr
            className={`cursor-pointer hover:bg-secondary hover:text-white ${
              isAccordionOpen ? "bg-gray-100 border-primary" : ""
            }`}
            onClick={handleAccordionToggle}
          >
            <td className="w-1/6 text-center p-2 font-semibold">
              {checkoutListItem.CheckoutNumber}
            </td>
            {roleCode === "USERROLE_SYSTEMADMIN" && (
              <>
                <td className="w-1/6">{checkoutListItem.ClientName}</td>
              </>
            )}
            <td
              className={`w-1/6 text-center p-2 ${
                checkoutListItem.Status === "Dispatched"
                  ? "text-success"
                  : checkoutListItem.Status === "Checkout Cancelled"
                  ? "text-error"
                  : "text-highlight"
              }`}
            >
              {checkoutListItem.Status}
            </td>
            <td className="w-1/6 text-center p-2">
              {checkoutListItem.CheckoutType}
            </td>
            <td className="w-1/6 text-center p-2">
              <div>
                <p>{checkoutListItem.Created}</p>
              </div>
            </td>
            <td className="w-1/6 text-center p-2">
              {checkoutListItem.CheckoutStartedBy}
            </td>
            <td className="w-1/6 text-center p-2">
              {checkoutListItem.CheckoutCompletedBy || "N/A"}
            </td>
            <td className="w-1/12 text-center p-2">
              <div
                className="cursor-pointer hover:text-success"
                title="View Details"
              >
                {isAccordionOpen ? (
                  <KeyboardArrowUpRounded />
                ) : (
                  <KeyboardArrowDownRounded />
                )}
              </div>
            </td>
          </tr>

          {isAccordionOpen && (
            <tr>
              <td colSpan={7} className="p-2 rounded-b-xl">
                <div className="additionalDetails flex flex-col gap-2 justify-center items-center">
                  <div className="innerCard w-[800px]">
                    <CheckoutListInnerCard
                      checkoutNumber={checkoutListItem.CheckoutNumber}
                      handleHasReturn={handleHasReturn}
                    />
                  </div>

                  {checkoutListItem.StatusCode === "CHECKOUT-RETURNED" && (
                    <p>Return Reason: {checkoutListItem.ReturnReason}</p>
                  )}

                  {checkoutListItem.StatusCode !== "CHECKOUT-CANCEL" && (
                    <Link
                      href={handleDetailsClick(
                        checkoutListItem.CheckoutNumber,
                        checkoutListItem.StatusCode,
                        checkoutListItem.CheckoutType
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary hover:opacity-80 text-white rounded-xl px-2 py-1 w-48 text-center cursor-pointer"
                      title={`Go To: Checkout Number ${checkoutListItem.CheckoutNumber}`}
                    >
                      View Details
                      <span>
                        <LaunchRounded />
                      </span>
                    </Link>
                  )}

                  {checkoutListItem.StatusCode === "CHECKOUT-DISPATCHED" &&
                    !isinvoice &&
                    isreturn &&
                    !hasReturn && (
                      <Link
                        href={`/return-checkout/${checkoutListItem.CheckoutNumber}`}
                      >
                        <p
                          className="bg-secondary hover:opacity-80 text-white rounded-xl px-2 py-1 w-48 text-center block cursor-pointer"
                          title={`Return: Checkout Number ${checkoutListItem.CheckoutNumber}`}
                        >
                          Mark As Returned
                        </p>
                      </Link>
                    )}

                  {checkoutListItem.StatusCode === "CHECKOUT-DISPATCHED" &&
                    isinvoice &&
                    !isreturn && (
                      <>
                        <button
                          onClick={() => {
                            setIsInvoiceOverlayOpen(true);
                            setInvoiceNumber(
                              checkoutListItem.InvoiceNumber || ""
                            );
                          }}
                          className="bg-secondary hover:opacity-80 text-white rounded-xl px-2 py-1 w-48 text-center"
                        >
                          Invoice Details
                        </button>
                      </>
                    )}
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isOverlayOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Return Checkout</h3>
            <textarea
              className="w-full p-2 border rounded-lg mb-4"
              placeholder="Enter return reason"
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOverlayOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleReturnClick}
                className="bg-primary px-4 py-2 text-white rounded-lg hover:opacity-80"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {isInvoiceOverlayOpen && (
        <InvoiceOverlay
          checkoutNumber={checkoutListItem.CheckoutNumber}
          closeOverlay={() => setIsInvoiceOverlayOpen(false)}
        />
      )}
      {isReturnOverlayOpen && (
        <ReturnOverlay
          checkoutNumber={checkoutListItem.CheckoutNumber}
          closeOverlay={() => setIsReturnOverlayOpen(false)}
        />
      )}
    </div>
  );
};

export default CheckoutListCard;
