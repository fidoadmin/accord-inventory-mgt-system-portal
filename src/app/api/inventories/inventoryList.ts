import { InventoryListInterface } from "@/types/InventoryInterface";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchInventoryList = async (
  page?: number,
  limit?: number,
  inventoryDescriptionId?: string,
  sortby?: string,
  sortorder?: string
): Promise<{
  totalCount: number;
  data: InventoryListInterface[];
}> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const query = new URLSearchParams({
    Page: page?.toString() || "",
    Limit: limit?.toString() || "",
    SortBy: sortby || "",
    SortOrder: sortorder || "",
    InventoryDescriptionId: inventoryDescriptionId || "",
  });

  const response = await fetch(`${baseURL}/inventories?${query.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch inventory description details: ${response.statusText}`
    );
  }

  const totalCount = parseInt(
    response.headers.get("x-page-totalcount") || "0",
    10
  );
  const data = await response.json();
  console.log(data);

  return {
    totalCount,
    data,
  };
};
