import { CategoryListInterface } from "@/types/CategoryInterface";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchCategoryList = async (
  page?: number,
  limit?: number,
  search?: string,
  varsortby?: string,
  varsortorder?: string,
  clientId?: string
): Promise<{ data: CategoryListInterface[]; totalCount: number }> => {
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
    ClientId: clientId || "",
  });

  const response = await fetch(`${baseURL}/categories?${query.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch inventory list");
  }

  const totalCount = parseInt(
    response.headers.get("x-page-totalcount") || "0",
    10
  );

  const data = await response.json();

  return { data, totalCount };
};
