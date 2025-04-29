import { InventoryDescriptionForMaintenance } from "@/types/InventoryInterface";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchInventoryDescriptionForMaintenance = async (
  page?: number,
  limit?: number,
  categoryId?: string,
  search?: string,
  varsortby?: string,
  varsortorder?: string,
  fromDate?: string,
  toDate?: string,
  isFromReport?: boolean,
  outofstock?: boolean,
  instock?: boolean,
  clientid?: string
): Promise<{
  data: InventoryDescriptionForMaintenance[];
  totalCount: number;
}> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const query = new URLSearchParams({
    Page: page?.toString() || "",
    Limit: limit?.toString() || "",
    Search: search || "",
    SortBy: varsortby || "",
    SortOrder: varsortorder || "",
    CategoryId: categoryId || "",
    FromDate: fromDate || "",
    ToDate: toDate || "",
    InStock: instock?.toString() || "",
    OutStock: outofstock?.toString() || "",
    IsFromReport: isFromReport?.toString() || "",
    ClientId: clientid || "",
  });

  const response = await fetch(
    `${baseURL}/inventorydescriptions?${query.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        AuthKey: authKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch inventorydescriptionformaintenance list");
  }

  const totalCount = parseInt(
    response.headers.get("x-page-totalcount") || "0",
    10
  );

  const data = await response.json();

  return { data, totalCount };
};
