import { SalesInfo } from "@/types/ReportInterface"
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchSalesInfo = async (
  page?: number,
  limit?: number,
  sortBy?: string,
  sortOrder?: string,
  varsearch?: string,
  clientid?: string
): Promise<{
  data: SalesInfo[];
  totalCount: number;
}> => {
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
    ClientId: clientid || "",
  });

  const response = await fetch(`${baseURL}/salesinfo?${query.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch report list");
  }

  const totalCount = parseInt(
    response.headers.get("x-page-totalcount") || "0",
    10
  );

  const data = await response.json();

  return { data, totalCount };
};
