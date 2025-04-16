import { ReportInterface } from "@/types/ReportInterface";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchSalesReportExport = async (
  page?: number,
  limit?: number,
  sortBy?: string,
  sortOrder?: string,
  varsearch?: string,
  inventoryDescriptionId?: string,
  buyerId?: string,
  fromDate?: string,
  toDate?: string
) => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const query = new URLSearchParams({
    Page: page?.toString() || "",
    Limit: limit?.toString() || "",
    SortBy: sortBy?.toString() || " ",
    SortOrder: sortOrder?.toString() || " ",
    Search: varsearch || "",
    InventoryDescriptionId: inventoryDescriptionId || "",
    BuyerId: buyerId || "",
    FromDate: fromDate || "",
    ToDate: toDate || "",
  });

  const response = await fetch(`${baseURL}/exportreport?${query.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
  });
  const blob = await response.blob();
  const csvText = await blob.text();
  return csvText;
};
