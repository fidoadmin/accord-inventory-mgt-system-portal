"use client";

import { useCheckoutList } from "@/app/hooks/checkouts/useCheckoutList";
import React, { useState, useEffect, useRef, useCallback } from "react";
import "react-toastify/ReactToastify.css";
import { useQueryClient } from "@tanstack/react-query";
import { useVerifyCheckoutList } from "@/app/hooks/checkouts/useVerifyCheckout";
import { useCancelCheckoutList } from "@/app/hooks/checkouts/useCancelCheckout";
import { useInsertCheckoutInventory } from "@/app/hooks/checkoutinventories/useCheckoutInventoryInsert";
import { permanentRedirect, useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { getCookie } from "cookies-next";
import { DeleteRounded } from "@mui/icons-material";
import { useDeleteCheckoutDetail } from "@/app/hooks/checkouts/useCheckoutDelete";
import { toast } from "react-toastify";

const BarcodeReaderPage = (context: any) => {
  const [barcode, setBarcode] = useState<string>("");
  const [isFinalBarcode, setIsFinalBarcode] = useState<boolean>(false);
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);
  const [lastUsedBarcode, setLastUsedBarcode] = useState<string | undefined>(
    undefined
  );
  const [allScanned, setAllScanned] = useState<boolean | undefined>(false);
  const [items, setItems] = useState<any[]>([]);
  const authKey = getCookie("authKey") as string;
  const [showValidateButton, setShowValidateButton] = useState(false);
  const [isPartialScan, setIsPartialScan] = useState(false);
  const { params } = context;
  const queryClient = useQueryClient();
  const verifyMutation = useVerifyCheckoutList();
  const cancelMutation = useCancelCheckoutList();
  const insertCheckoutInventory = useInsertCheckoutInventory();
  const deleteMutation = useDeleteCheckoutDetail();

  const router = useRouter();
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const {
    data: checkoutList,
    error: checkoutListError,
    isLoading: checkoutListIsLoading,
  } = useCheckoutList(authKey, params.checkoutinventories);

  const checkoutCancelled: boolean =
    !!checkoutList && checkoutList[0].StatusCode === "CHECKOUT-CANCEL";

  const checkoutReturned: boolean =
    !!checkoutList && checkoutList[0].StatusCode === "CHECKOUT-RETURNED";

  if (checkoutList) {
    queryClient.setQueryData(
      ["checkoutList", params.checkoutinventories],
      checkoutList
    );
  }

  const handleCheckoutVerify = async () => {
    setButtonClicked(true);
    try {
      await verifyMutation.mutateAsync(params.checkoutinventories);

      localStorage.removeItem(
        `checkoutVerificationList${params.checkoutinventories}`
      );
      if (
        checkoutList &&
        checkoutList[0].CheckoutTypeName === "BranchTransfer"
      ) {
        router.push(`/checkout/${params.checkoutinventories}/btChallan`);
      } else {
        router.push(`/checkout/${params.checkoutinventories}/challan?page=1`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckoutCancel = async () => {
    try {
      await cancelMutation.mutateAsync(params.checkoutinventories);

      router.push(`/checkoutlist`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFinalBarcodeProcessing = useCallback(async () => {
    if (isFinalBarcode) {
      try {
        await insertCheckoutInventory.mutateAsync({
          checkoutNumber: params.checkoutinventories,
          barcode: barcode.toUpperCase(),
        });
        setBarcode("");
        setIsFinalBarcode(false);
      } catch {
        setBarcode("");
        setIsFinalBarcode(false);
      }
    }
  }, [
    isFinalBarcode,
    barcode,
    params.checkoutinventories,
    insertCheckoutInventory,
  ]);

  useEffect(() => {
    const allItemsRemainingZero = checkoutList?.every(
      (item) => parseInt(item.TotalRequired) === 0
    );

    const allItemsScannedCompletely = checkoutList?.every((item) =>
      item.Details.every(
        (inventory) =>
          parseInt(inventory.AvailableQuantity) - inventory.Scanned === 0
      )
    );

    const hasPartialScans = checkoutList?.some((item) =>
      item.Details.some((inventory) => inventory.Scanned > 0)
    );

    setAllScanned(allItemsRemainingZero || allItemsScannedCompletely);
    setIsPartialScan(!!hasPartialScans);

    setShowValidateButton(!!hasPartialScans);
  }, [checkoutList]);

  useEffect(() => {
    const handleKeyPress = async (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "j") {
        e.preventDefault();
        return;
      }

      if (/^[0-9a-zA-Z]$/.test(e.key)) {
        setBarcode((prev) => prev + e.key);

        if (debounceTimeout.current) {
          clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = await setTimeout(() => {
          setIsFinalBarcode(true);
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
    if (isFinalBarcode) {
      if (
        lastUsedBarcode != barcode.toUpperCase() ||
        lastUsedBarcode === undefined
      ) {
        setLastUsedBarcode(barcode.toUpperCase());
        handleFinalBarcodeProcessing();
      } else {
        setBarcode("");
        setIsFinalBarcode(false);
      }
    }
  }, [isFinalBarcode, handleFinalBarcodeProcessing]);

  useEffect(() => {
    const allItemsRemainingZero = checkoutList?.every(
      (item) => parseInt(item.TotalRequired) === 0
    );

    const allItemsScannedCompletely = checkoutList?.every((item) =>
      item.Details.every(
        (inventory) =>
          parseInt(inventory.AvailableQuantity) - inventory.Scanned === 0
      )
    );

    setAllScanned(allItemsRemainingZero || allItemsScannedCompletely);
  }, [checkoutList]);

  if (checkoutListIsLoading || !checkoutList) {
    return <Loading />;
  }
  if (checkoutListError) return <div>Error: {checkoutListError.message}</div>;

  const handleDelete = (
    CheckoutInventoryDescriptionId: string,
    name: string,
    PackSize: string
  ) => {
    toast(({ closeToast }) => (
      <div>
        <p className="text-black">
          Are you sure you want to delete this{" "}
          <strong>
            Description( {name}) of PackSize ({PackSize})
          </strong>
          ?
        </p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={async () => {
              try {
                await deleteMutation.mutateAsync({
                  CheckoutInventoryDescriptionId,
                  AuthKey: authKey || "",
                });

                setItems((prevItem) =>
                  prevItem.filter(
                    (item) =>
                      item.CheckoutInventoryDescriptionId !==
                      CheckoutInventoryDescriptionId
                  )
                );

                closeToast();
              } catch (error) {
                toast.error("Failed to delete item");
                closeToast();
              }
            }}
            className="px-3 py-1.5 bg-error text-white rounded-md hover:bg-error"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };
  const shouldShowDeleteButton = (checkoutList: any[]) => {
    const uniqueIds = new Set(
      checkoutList.map((item) => item.CheckoutInventoryDescriptionId)
    );
    return uniqueIds.size > 1;
  };

  const handleValidatePartial = (
    scannedQty: number,
    descriptionName: string
  ) => {
    toast(({ closeToast }) => (
      <div>
        <p className="text-black">
          You have scanned fewer items than requested. Do you want to continue
          with the scanned quantity?{" "}
          <strong>
            {scannedQty} of Description ({descriptionName})
          </strong>
        </p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              closeToast();
              handleCheckoutVerify();
            }}
            className="px-3 py-1.5 bg-success text-white rounded-md hover:bg-success-dark"
          >
            Yes, Continue
          </button>
          <button
            onClick={closeToast}
            className="px-3 py-1.5 bg-error text-white rounded-md hover:bg-error-dark"
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  return (
    !!checkoutList &&
    (checkoutList[0].StatusCode === "CHECKOUT-DISPATCHED" ? (
      checkoutList[0].CheckoutTypeName === "BranchTransfer" ? (
        permanentRedirect(
          `/checkout/${checkoutList[0].CheckoutNumber}/btChallan`
        )
      ) : (
        permanentRedirect(
          `/checkout/${checkoutList[0].CheckoutNumber}/challan?page=1`
        )
      )
    ) : (
      <>
        <div className="relative border-2 rounded-lg overflow-hidden">
          <table className="w-full table-auto">
            <thead className="bg-tablehead">
              <tr className="border-b-2">
                <th className="px-4 py-2 border w-1/3">Details</th>
                <th className="px-4 py-2 border">Location</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Pack Size</th>
                <th className="px-4 py-2 border">Available Quantity</th>
                <th className="px-4 py-2 border">Scanned</th>
                {shouldShowDeleteButton(checkoutList) && (
                  <th className="px-4 py-2 border">Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {checkoutList?.map((item, idx) =>
                item.Details.map((inventory, index) => (
                  <tr key={index} className="text-left">
                    {index === 0 ? (
                      <td
                        className="px-4 py-2 border align-top"
                        rowSpan={item.Details.length}
                      >
                        <p className="">Name: {item.Name}</p>
                        <p>Remaining: {item.TotalRequired}</p>
                        <p>Scanned: {item.TotalScanned}</p>
                        <p>
                          Barcodes:{" "}
                          {item.ScannedBarcode && item.ScannedBarcode.length > 0
                            ? item.ScannedBarcode.join(", ")
                            : "-"}
                        </p>
                      </td>
                    ) : null}

                    <td className="px-4 py-2 border text-center">
                      {inventory.Location}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {inventory.ExpiryDate}
                      {inventory.DataReferenceType === "expirationdate" ? (
                        <p>(Expiry)</p>
                      ) : (
                        <p>(created)</p>
                      )}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {inventory.PackSize}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {parseInt(inventory.AvailableQuantity) -
                        inventory.Scanned}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {inventory.Scanned}
                    </td>

                    {shouldShowDeleteButton(checkoutList) && (
                      <td className="px-4 py-2 border text-center">
                        <button
                          onClick={() => {
                            const CheckoutInventoryDescriptionId =
                              item.CheckoutInventoryDescriptionId;
                            handleDelete(
                              CheckoutInventoryDescriptionId,
                              item.Name,
                              inventory.PackSize
                            );
                          }}
                          className="text-error"
                        >
                          <DeleteRounded />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center gap-8 text-center mt-4">
          <button
            onClick={handleCheckoutCancel}
            className="bg-error hover:opacity-80 rounded-xl py-2 px-4 text-white disabled:bg-slate-500"
            disabled={checkoutCancelled}
          >
            Cancel Checkout
          </button>

          {showValidateButton && !allScanned && (
            <button
              onClick={() =>
                handleValidatePartial(
                  parseInt(checkoutList[0].TotalScanned),
                  checkoutList[0].Name
                )
              }
              className="bg-primary hover:opacity-80 rounded-xl py-2 px-4 text-white"
            >
              Validate
            </button>
          )}
          <button
            onClick={handleCheckoutVerify}
            className="bg-success hover:opacity-80 rounded-xl py-2 px-4 text-white disabled:bg-slate-500"
            disabled={
              !allScanned ||
              checkoutCancelled ||
              buttonClicked ||
              checkoutReturned
            }
          >
            Generate Challan
          </button>
        </div>
      </>
    ))
  );
};

export default BarcodeReaderPage;
