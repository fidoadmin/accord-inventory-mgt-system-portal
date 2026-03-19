import { ContainerInterfaceForMaintenance } from "@/types/ContainerInterface";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchContainerListForMaintenance = async (
  page?: number,
  limit?: number,
  search?: string,
  categoryId?: string,
  sortBy?: string,
  sortOrder?: string,
  type?: string,
  clientid?: string
): Promise<{
  data: ContainerInterfaceForMaintenance[];
  totalCount: number;
}> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const query = new URLSearchParams({
    Page: page?.toString() || "",
    Limit: limit?.toString() || "",
    CategoryId: categoryId || "",
    Search: search || "",
    SortBy: sortBy || "",
    SortOrder: sortOrder || "",
    Type: type || "",
    ClientId: clientid || "",
  });

  const response = await fetch(`${baseURL}/containers?${query.toString()}`, {
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
