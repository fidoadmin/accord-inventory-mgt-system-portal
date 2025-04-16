import { CompanyInterface } from "@/types/CompanyInterface";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchCompanyList = async (
  page?: number,
  limit?: number,
  search?: string,
  varsortby?: string,
  varsortorder?: string,
  clientid?: string,
  isinternal?: string
): Promise<{ data: CompanyInterface[]; totalCount: number }> => {
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
    ClientId: clientid || "",
    IsInternal: isinternal || "",
  });

  const response = await fetch(`${baseURL}/companies?${query.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
  });

  const totalCount = parseInt(
    response.headers.get("x-page-totalcount") || "0",
    10
  );

  const data = await response.json();

  return { data, totalCount };
};
