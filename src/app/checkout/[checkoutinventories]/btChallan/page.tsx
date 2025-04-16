"use client";

import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { FC, useState } from "react";
import { useCheckoutDetails } from "@/app/hooks/checkouts/useCheckoutDetails";

import GenerateBranchChallanPDF from "@/components/GenerateBranchChallanPDF";
import GenerateBranchGatePassPDF from "@/components/GenerateBranchGatePassPDF";
import { ChallanPreviewPageProps } from "@/types/CheckoutInterface";
import Loading from "@/app/loading";
import { useBarcodeList } from "@/app/hooks/barcodelist/useBarcodeGetList";
import { useSearchParams } from "next/navigation";
import GenerateBarcodeList from "@/components/GenerateBarcodeList";
import { getCookie } from "cookies-next";
import {
  KeyboardArrowLeftRounded,
  KeyboardArrowRightRounded,
} from "@mui/icons-material";

const BTChallanPreviewPage: FC<ChallanPreviewPageProps> = ({ params }) => {
  const [isForSaleChallan, setIsForSaleChallan] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<
    "sales" | "gatePass" | "barcodelist"
  >("sales");
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const initialPage = pageParam ? parseInt(pageParam, 10) : 1;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isForGatePass, setIsForGatePass] = useState<boolean>(true);

  const authKey = getCookie("authKey") as string;

  const {
    data: checkoutDetails,
    error: checkoutDetailsError,
    isLoading: checkoutDetailsLoading,
  } = useCheckoutDetails(
    authKey,
    params.checkoutinventories,
    isForSaleChallan!
  );

  const {
    data: BarcodeList,
    isLoading,
    isError,
    error,
  } = useBarcodeList(authKey, params.checkoutinventories);

  if (checkoutDetailsLoading || !checkoutDetails) return <Loading />;
  if (checkoutDetailsError) return <p>Error loading checkout list.</p>;

  if (!checkoutDetails || !checkoutDetails.BranchDetails) {
    return <Loading />;
  }

  const isReturned = checkoutDetails.StatusCode === "CHECKOUT-RETURNED";
  const totalPages = checkoutDetails.CompanyDetails.length || 1;

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="text-center py-4">
      <div className="flex justify-between py-2">
        <div className="flex justify-start">
          <button
            onClick={() => {
              setIsForSaleChallan(true);
              setActiveTab("sales");
            }}
            className={`px-4 py-2 text-white rounded-t-lg bg-primary ${
              activeTab === "sales" ? "" : "opacity-60"
            }`}
          >
            Branch Transfer Challan
          </button>
          {!isReturned && (
            <button
              onClick={() => {
                setIsForSaleChallan(true);
                setActiveTab("gatePass");
              }}
              className={`px-4 py-2 text-white rounded-t-lg bg-primary ${
                activeTab === "gatePass" ? "" : "opacity-60"
              }`}
            >
              Gate Pass
            </button>
          )}
          <button
            onClick={() => {
              setIsForSaleChallan(true);
              setActiveTab("barcodelist");
            }}
            className={`px-4 py-2 text-white rounded-t-lg bg-primary ${
              activeTab === "barcodelist" ? "" : "opacity-60"
            }`}
          >
            Barcode List
          </button>
        </div>
      </div>

      {activeTab === "sales" && (
        <div className="bg-surface px-4 rounded-tl-xl rounded-br-xl">
          <div className="flex justify-between py-2">
            <h1 className="text-lg font-bold">
              Branch Challan for Checkout #{checkoutDetails?.CheckoutNumber}
            </h1>
            <PDFDownloadLink
              document={
                <GenerateBranchChallanPDF
                  companyDetails={checkoutDetails.CompanyDetails[0]}
                  branchDetails={checkoutDetails.BranchDetails[0]}
                  checkoutList={checkoutDetails.SelectedInventories}
                  poNumber={checkoutDetails.PurchaseOrderNumber}
                  remarks={checkoutDetails.Remarks}
                  date={checkoutDetails.DateCreated}
                  nepaliDate={checkoutDetails.NepaliDate}
                  totalQuantity={checkoutDetails.TotalQuantity}
                />
              }
              fileName={`${checkoutDetails.CompanyDetails[0]
                ?.FocChallanNumber!}.pdf`}
              className="px-4 py-2 bg-primary text-white rounded-xl hover:opacity-80"
            >
              {({ loading }) => (loading ? "Loading..." : "Download Sales PDF")}
            </PDFDownloadLink>
          </div>
          <PDFViewer width="600" height="900" className="mx-auto">
            <GenerateBranchChallanPDF
              companyDetails={checkoutDetails.CompanyDetails[0]}
              branchDetails={checkoutDetails.BranchDetails[0]}
              checkoutList={checkoutDetails.SelectedInventories}
              poNumber={checkoutDetails.PurchaseOrderNumber}
              remarks={checkoutDetails.Remarks}
              date={checkoutDetails.DateCreated}
              nepaliDate={checkoutDetails.NepaliDate}
              totalQuantity={checkoutDetails.TotalQuantity}
            />
          </PDFViewer>
        </div>
      )}

      {activeTab === "gatePass" && (
        <div className="bg-surface px-4 rounded-tl-xl rounded-br-xl">
          <div className="flex justify-between py-2">
            <h1 className="text-lg font-bold">
              Gate Pass for Checkout #{checkoutDetails?.CheckoutNumber}
            </h1>
            <PDFDownloadLink
              document={
                <GenerateBranchGatePassPDF
                  companyDetails={checkoutDetails.CompanyDetails[0]}
                  branchDetails={checkoutDetails.BranchDetails[0]}
                  checkoutList={checkoutDetails.SelectedInventories}
                  poNumber={checkoutDetails.PurchaseOrderNumber}
                  remarks={checkoutDetails.Remarks}
                  date={checkoutDetails.DateCreated}
                  nepaliDate={checkoutDetails.NepaliDate}
                  totalQuantity={checkoutDetails.TotalQuantity}
                />
              }
              fileName={`${checkoutDetails.CompanyDetails[0]
                ?.FocChallanNumber!}-GatePass.pdf`}
              className="px-4 py-2 bg-primary text-white rounded-xl hover:opacity-80"
            >
              {({ loading }) =>
                loading ? "Loading..." : "Download Gate Pass PDF"
              }
            </PDFDownloadLink>
          </div>
          <PDFViewer width="600" height="900" className="mx-auto">
            <GenerateBranchGatePassPDF
              companyDetails={checkoutDetails.CompanyDetails[0]}
              branchDetails={checkoutDetails.BranchDetails[0]}
              checkoutList={checkoutDetails.SelectedInventories}
              poNumber={checkoutDetails.PurchaseOrderNumber}
              remarks={checkoutDetails.Remarks}
              date={checkoutDetails.DateCreated}
              nepaliDate={checkoutDetails.NepaliDate}
              totalQuantity={checkoutDetails.TotalQuantity}
            />
          </PDFViewer>
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
                    ?.SaleChallanNumber!}-GatePass.pdf`}
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

export default BTChallanPreviewPage;
