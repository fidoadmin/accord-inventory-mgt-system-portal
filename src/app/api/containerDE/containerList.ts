import { CompanyInterface } from "@/types/CompanyInterface";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchCompanyList = async (
  page?: number,
  limit?: number,
  varcategoryname?: string,
  varsearch?: string,
  varsortby?: string,
  varsortorder?: string,
  isinternal?: string,
  issupplier?: string,
  iscustomer?: string,
  ismanufacturer?: string
): Promise<{ data: CompanyInterface[]; totalCount: number }> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const query = new URLSearchParams({
    Page: page?.toString() || "",
    Limit: limit?.toString() || "",
    Search: varsearch || "",
    SortBy: varsortby || "",
    SortOrder: varsortorder || "",
    CategoryName:
      decodeURIComponent(varcategoryname ? varcategoryname : "") || "",
    IsInternal: isinternal?.toString() || "",
    IsSupplier: issupplier?.toString() || "",
    IsCustomer: iscustomer?.toString() || "",
    IsManufacturer: ismanufacturer?.toString() || "",
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
