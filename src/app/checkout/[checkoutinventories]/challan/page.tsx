"use client";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { FC, useState, useEffect } from "react";
import { useCheckoutDetails } from "@/app/hooks/checkouts/useCheckoutDetails";

import {
  KeyboardArrowLeftRounded,
  KeyboardArrowRightRounded,
} from "@mui/icons-material";
import { ChallanPreviewPageProps } from "@/types/CheckoutInterface";
import Loading from "@/app/loading";
import { useRouter, useSearchParams } from "next/navigation";
import GenerateSaleChallanPDF from "@/components/GenerateSaleChallanPDF";
import GenerateFocChallanPDF from "@/components/GenerateFocChallanPDF";
import GenerateSaleGatePassPDF from "@/components/GenerateSaleGatePass";
import GenerateFocGatePassPDF from "@/components/GenerateFocGatePass";
import React from "react";
import GenerateBarcodeList from "@/components/GenerateBarcodeList";
import { useBarcodeList } from "@/app/hooks/barcodelist/useBarcodeGetList";
import { getCookie } from "cookies-next";
import GenerateReturnChallanPDF from "@/components/GenerateReturnChallanPDF";

const ChallanPreviewPage: FC<ChallanPreviewPageProps> = ({ params }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authKey = getCookie("authKey") as string;

  const pageParam = searchParams.get("page");
  const initialPage = pageParam ? parseInt(pageParam, 10) : 1;
  const [currentPage, setCurrentPage] = useState(1);
  const [isForReturnChallan, setIsForReturnChallan] = useState<boolean>(false);
  const [isForSaleChallan, setIsForSaleChallan] = useState<boolean>(
    !isForReturnChallan
  );
  const isOnlySaleChallan = !isForReturnChallan
    ? false
    : searchParams.get("onlySaleChallan") === "true";
  const [isForGatePass, setIsForGatePass] = useState<boolean>(
    isOnlySaleChallan ? false : true
  );

  const {
    data: checkoutDetails,
    error: checkoutDetailsError,
    isLoading: checkoutDetailsLoading,
  } = useCheckoutDetails(
    authKey,
    params.checkoutinventories,
    isForSaleChallan,
    isForGatePass,
    isForReturnChallan
  );

  const [activeTab, setActiveTab] = useState<
    "sales" | "foc" | "gatePass" | "barcodelist" | "returnchallan"
  >(
    isOnlySaleChallan
      ? checkoutDetails?.HasSale
        ? "sales"
        : "gatePass"
      : "gatePass"
  );
  const {
    data: BarcodeList,
    isLoading,
    isError,
    error,
  } = useBarcodeList(authKey, params.checkoutinventories);

  useEffect(() => {
    router.replace(
      `?page=${currentPage}&onlySaleChallan=${isOnlySaleChallan}`,
      {
        scroll: false,
      }
    );
  }, [currentPage, router, isOnlySaleChallan]);
  useEffect(() => {
    if (isOnlySaleChallan && !checkoutDetails?.HasSale) {
      setActiveTab("returnchallan");
      setIsForSaleChallan(false);
      setIsForGatePass(false);
      setIsForReturnChallan(true);
    }
  }, [isOnlySaleChallan, checkoutDetails]);

  // useEffect(() => {
  //   router.replace(
  //     `?page=${currentPage}&onlyReturnChallan=${isForReturnChallan}`,
  //     {
  //       scroll: false,
  //     }
  //   );
  // }, [currentPage, router, isForReturnChallan]);
  if (checkoutDetailsLoading || !checkoutDetails) return <Loading />;
  if (checkoutDetailsError) return <p>Error loading checkout list.</p>;
  if (!checkoutDetails || !checkoutDetails.CompanyDetails) {
    return <Loading />;
  }

  const totalPages = checkoutDetails.CompanyDetails.length || 1;

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const isReturned = checkoutDetails.StatusCode === "CHECKOUT-RETURNED";

  return (
    <div className="text-center py-4">
      <div className="flex justify-start">
        {checkoutDetails.HasSale && (
          <button
            onClick={() => {
              setCurrentPage(1);
              setIsForReturnChallan(false);
              setIsForSaleChallan(true);
              setIsForGatePass(false);
              setActiveTab("sales");
            }}
            className={`px-4 py-2 text-white rounded-t-lg bg-primary ${
              activeTab === "sales" ? "" : "opacity-60"
            }`}
          >
            Sales Challan
          </button>
        )}
        {checkoutDetails.HasReturn && (
          <button
            onClick={() => {
              setCurrentPage(1);
              setIsForSaleChallan(false);
              setIsForReturnChallan(true);
              setIsForGatePass(false);
              setActiveTab("returnchallan");
            }}
            className={`px-4 py-2 text-white rounded-t-lg bg-primary ${
              activeTab === "returnchallan" ? "" : "opacity-60"
            }`}
          >
            Return Challan
          </button>
        )}
        {checkoutDetails.HasFoc && !isOnlySaleChallan && (
          <button
            onClick={() => {
              setCurrentPage(1);
              setIsForSaleChallan(false);
              setIsForGatePass(false);
              setActiveTab("foc");
            }}
            className={`px-4 py-2 text-white rounded-t-lg bg-primary ${
              activeTab === "foc" ? "" : "opacity-60"
            }`}
          >
            Free of Cost (FOC) Challan
          </button>
        )}

        {!isOnlySaleChallan && (
          <button
            onClick={() => {
              setCurrentPage(1);
              setIsForGatePass(true);
              setIsForSaleChallan(false);
              setIsForReturnChallan(false);
              setActiveTab("gatePass");
            }}
            className={`px-4 py-2 text-white rounded-t-lg bg-primary ${
              activeTab === "gatePass" ? "" : "opacity-60"
            }`}
          >
            Gate Pass
          </button>
        )}

        {!isOnlySaleChallan && (
          <button
            onClick={() => {
              setCurrentPage(1);
              setIsForGatePass(true);
              setActiveTab("barcodelist");
            }}
            className={`px-4 py-2 text-white rounded-t-lg bg-primary ${
              activeTab === "barcodelist" ? "" : "opacity-60"
            }`}
          >
            Barcode List
          </button>
        )}
      </div>

      {checkoutDetails.HasSale && activeTab === "sales" && (
        <div className="bg-surface px-4 rounded-tl-xl rounded-br-xl">
          <div className="flex justify-between py-2">
            <h1 className="text-lg font-bold">
              Sales Challan for Checkout #{checkoutDetails?.CheckoutNumber}
            </h1>
            <div className="flex gap-4">
              {!isOnlySaleChallan && (
                <PDFDownloadLink
                  document={
                    <GenerateSaleChallanPDF
                      companyDetails={
                        checkoutDetails.CompanyDetails[currentPage - 1]
                      }
                      checkoutList={checkoutDetails.SelectedInventories}
                      poNumber={checkoutDetails.PurchaseOrderNumber}
                      remarks={checkoutDetails.Remarks}
                      date={checkoutDetails.DateCreated}
                      NepaliDate={checkoutDetails.NepaliDate}
                      totalQuantity={checkoutDetails.TotalQuantity}
                    />
                  }
                  fileName={`${checkoutDetails.CompanyDetails[currentPage - 1]
                    ?.SaleChallanNumber!}.pdf`}
                  className="px-4 py-2 bg-primary text-white rounded-xl hover:opacity-80"
                >
                  {({ loading }) =>
                    loading ? "Loading..." : "Download Sales Challan PDF"
                  }
                </PDFDownloadLink>
              )}
            </div>
          </div>
          {totalPages > 0 ? (
            <div>
              <PDFViewer width="600" height="900" className="mx-auto">
                <GenerateSaleChallanPDF
                  companyDetails={
                    checkoutDetails.CompanyDetails[currentPage - 1]
                  }
                  checkoutList={checkoutDetails.SelectedInventories}
                  poNumber={checkoutDetails.PurchaseOrderNumber}
                  remarks={checkoutDetails.Remarks}
                  date={checkoutDetails.DateCreated}
                  NepaliDate={checkoutDetails.NepaliDate}
                  totalQuantity={checkoutDetails.TotalQuantity}
                />
              </PDFViewer>
              <div className="mt-4 flex justify-center gap-2 items-center">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-primary hover:opacity-80 text-white rounded-xl disabled:opacity-40"
                >
                  <KeyboardArrowLeftRounded />
                </button>
                <h1>{currentPage}</h1>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-primary hover:opacity-80 text-white rounded-xl disabled:opacity-40"
                >
                  <KeyboardArrowRightRounded />
                </button>
              </div>
            </div>
          ) : (
            <p>No pages available to preview.</p>
          )}
        </div>
      )}
      {activeTab === "returnchallan" && (
        <div className="bg-surface px-4 rounded-tl-xl rounded-br-xl">
          <div className="flex justify-between py-2">
            <h1 className="text-lg font-bold">
              Return Challan for Checkout #{checkoutDetails?.CheckoutNumber}
            </h1>
            <div className="flex gap-4">
              {!isOnlySaleChallan && (
                <PDFDownloadLink
                  document={
                    <GenerateReturnChallanPDF
                      companyDetails={
                        checkoutDetails.CompanyDetails[currentPage - 1]
                      }
                      checkoutList={checkoutDetails.SelectedInventories}
                      poNumber={checkoutDetails.PurchaseOrderNumber}
                      remarks={checkoutDetails.Remarks}
                      date={checkoutDetails.DateCreated}
                      NepaliDate={checkoutDetails.NepaliDate}
                      totalQuantity={checkoutDetails.TotalQuantity}
                      ReturnBy={checkoutDetails.ReturnBy}
                      ReturnReason={checkoutDetails.ReturnReason}
                    />
                  }
                  fileName={`${checkoutDetails.CompanyDetails[currentPage - 1]
                    ?.SaleChallanNumber!}.pdf`}
                  className="px-4 py-2 bg-primary text-white rounded-xl hover:opacity-80"
                >
                  {({ loading }) =>
                    loading ? "Loading..." : "Download Return Challan PDF"
                  }
                </PDFDownloadLink>
              )}
            </div>
          </div>
          {totalPages > 0 ? (
            <div>
              <PDFViewer width="600" height="900" className="mx-auto">
                <GenerateReturnChallanPDF
                  companyDetails={
                    checkoutDetails.CompanyDetails[currentPage - 1]
                  }
                  checkoutList={checkoutDetails.SelectedInventories}
                  poNumber={checkoutDetails.PurchaseOrderNumber}
                  remarks={checkoutDetails.Remarks}
                  date={checkoutDetails.DateCreated}
                  NepaliDate={checkoutDetails.NepaliDate}
                  totalQuantity={checkoutDetails.TotalQuantity}
                  ReturnBy={checkoutDetails.ReturnBy}
                  ReturnReason={checkoutDetails.ReturnReason}
                />
              </PDFViewer>
              <div className="mt-4 flex justify-center gap-2 items-center">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-primary hover:opacity-80 text-white rounded-xl disabled:opacity-40"
                >
                  <KeyboardArrowLeftRounded />
                </button>
                <h1>{currentPage}</h1>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-primary hover:opacity-80 text-white rounded-xl disabled:opacity-40"
                >
                  <KeyboardArrowRightRounded />
                </button>
              </div>
            </div>
          ) : (
            <p>No pages available to preview.</p>
          )}
        </div>
      )}
      {activeTab === "foc" && (
        <div className="bg-surface px-4 rounded-tl-xl rounded-br-xl">
          <div className="flex justify-between py-2">
            <h1 className="text-lg font-bold">
              FOC Challan for Checkout #{checkoutDetails?.CheckoutNumber}
            </h1>
            <div className="flex gap-4">
              {currentPage === totalPages && !isReturned && (
                <PDFDownloadLink
                  document={
                    <GenerateFocGatePassPDF
                      companyDetails={
                        checkoutDetails.CompanyDetails[currentPage - 1]
                      }
                      checkoutList={checkoutDetails.SelectedInventories}
                      date={checkoutDetails.DateCreated}
                      nepaliDate={checkoutDetails.NepaliDate}
                    />
                  }
                  fileName={`${checkoutDetails.CompanyDetails[currentPage - 1]
                    .SaleChallanNumber!}-GatePass.pdf`}
                  className="px-4 py-2 bg-primary text-white rounded-xl hover:opacity-80"
                >
                  {({ loading }) =>
                    loading ? "Loading..." : "Download Gate Pass PDF"
                  }
                </PDFDownloadLink>
              )}
              <PDFDownloadLink
                document={
                  <GenerateFocChallanPDF
                    companyDetails={
                      checkoutDetails.CompanyDetails[currentPage - 1]
                    }
                    checkoutList={checkoutDetails.SelectedInventories}
                    poNumber={checkoutDetails.PurchaseOrderNumber}
                    remarks={checkoutDetails.Remarks}
                    date={checkoutDetails.DateCreated}
                    nepaliDate={checkoutDetails.NepaliDate}
                    totalQuantity={checkoutDetails.TotalQuantity}
                  />
                }
                fileName={`${checkoutDetails.CompanyDetails[currentPage - 1]
                  .FocChallanNumber!}.pdf`}
                className="px-4 py-2 bg-primary text-white rounded-xl hover:opacity-80"
              >
                {({ loading }) =>
                  loading ? "Loading..." : "Download FOC Challan PDF"
                }
              </PDFDownloadLink>
            </div>
          </div>
          <PDFViewer width="600" height="900" className="mx-auto">
            <GenerateFocChallanPDF
              companyDetails={checkoutDetails.CompanyDetails[currentPage - 1]}
              checkoutList={checkoutDetails.SelectedInventories}
              poNumber={checkoutDetails.PurchaseOrderNumber}
              remarks={checkoutDetails.Remarks}
              date={checkoutDetails.DateCreated}
              nepaliDate={checkoutDetails.NepaliDate}
              totalQuantity={checkoutDetails.TotalQuantity}
            />
          </PDFViewer>
          <div className="mt-4 flex justify-center gap-2 items-center">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-primary hover:opacity-80 text-white rounded-xl disabled:opacity-40"
            >
              <KeyboardArrowLeftRounded />
            </button>
            <h1>{currentPage}</h1>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-primary hover:opacity-80 text-white rounded-xl disabled:opacity-40"
            >
              <KeyboardArrowRightRounded />
            </button>
          </div>
        </div>
      )}

      {activeTab === "gatePass" && (
        <div className="bg-surface px-4 rounded-tl-xl rounded-br-xl">
          <div className="flex justify-between py-2">
            <h1 className="text-lg font-bold">
              Gate Pass for Checkout #{checkoutDetails?.CheckoutNumber}
            </h1>
            <div className="flex gap-4">
              {currentPage === totalPages && (
                <PDFDownloadLink
                  document={
                    <GenerateSaleGatePassPDF
                      companyDetails={
                        checkoutDetails.CompanyDetails[currentPage - 1]
                      }
                      checkoutList={checkoutDetails.SelectedInventories}
                      date={checkoutDetails.DateCreated}
                      nepaliDate={checkoutDetails.NepaliDate}
                      totalQuantity={checkoutDetails.TotalQuantity}
                    />
                  }
                  fileName={`${checkoutDetails.CompanyDetails[currentPage - 1]
                    .SaleChallanNumber!}-GatePass.pdf`}
                  className="px-4 py-2 bg-primary text-white rounded-xl hover:opacity-80"
                >
                  {({ loading }) =>
                    loading ? "Loading..." : "Download Gate Pass PDF"
                  }
                </PDFDownloadLink>
              )}
            </div>
          </div>
          {totalPages > 0 ? (
            <div>
              <PDFViewer width="600" height="900" className="mx-auto">
                <GenerateSaleGatePassPDF
                  companyDetails={
                    checkoutDetails.CompanyDetails[currentPage - 1]
                  }
                  checkoutList={checkoutDetails.SelectedInventories}
                  date={checkoutDetails.DateCreated}
                  nepaliDate={checkoutDetails.NepaliDate}
                  totalQuantity={checkoutDetails.TotalQuantity}
                />
              </PDFViewer>
              <div className="mt-4 flex justify-center gap-2 items-center">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-primary hover:opacity-80 text-white rounded-xl disabled:opacity-40"
                >
                  <KeyboardArrowLeftRounded />
                </button>
                <h1>{currentPage}</h1>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-primary hover:opacity-80 text-white rounded-xl disabled:opacity-40"
                >
                  <KeyboardArrowRightRounded />
                </button>
              </div>
            </div>
          ) : (
            <p>No pages available to preview.</p>
          )}
        </div>
      )}
      {activeTab === "barcodelist" && (
        <div className="bg-surface px-4 rounded-tl-xl rounded-br-xl">
          <div className="flex justify-between py-2">
            <h1 className="text-lg font-bold">
              Barcode List #{checkoutDetails?.CheckoutNumber}
            </h1>
            <div className="flex gap-4">
              {currentPage === totalPages && !isReturned && (
                <PDFDownloadLink
                  document={
                    <GenerateBarcodeList
                      companyDetails={
                        checkoutDetails.CompanyDetails[currentPage - 1]
                      }
                      date={checkoutDetails.DateCreated}
                      nepaliDate={checkoutDetails.NepaliDate}
                      CheckoutNumber={checkoutDetails.CheckoutNumber}
                      barcodeList={BarcodeList}
                    />
                  }
                  fileName={`${checkoutDetails.CompanyDetails[currentPage - 1]
                    .SaleChallanNumber!}-GatePass.pdf`}
                  className="px-4 py-2 bg-primary text-white rounded-xl hover:opacity-80"
                >
                  {({ loading }) =>
                    loading ? "Loading..." : "Download Barcode List PDF"
                  }
                </PDFDownloadLink>
              )}
            </div>
          </div>
          <PDFViewer width="600" height="900" className="mx-auto">
            <GenerateBarcodeList
              companyDetails={checkoutDetails.CompanyDetails[currentPage - 1]}
              date={checkoutDetails.DateCreated}
              nepaliDate={checkoutDetails.NepaliDate}
              CheckoutNumber={checkoutDetails.CheckoutNumber}
              barcodeList={BarcodeList}
            />
          </PDFViewer>
          <div className="mt-4 flex justify-center gap-2 items-center">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-primary hover:opacity-80 text-white rounded-xl disabled:opacity-40"
            >
              <KeyboardArrowLeftRounded />
            </button>
            <h1>{currentPage}</h1>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-primary hover:opacity-80 text-white rounded-xl disabled:opacity-40"
            >
              <KeyboardArrowRightRounded />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallanPreviewPage;
