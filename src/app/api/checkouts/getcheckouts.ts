import { CheckoutsResponseInterface } from "@/types/CheckoutInterface";
import { ErrorResponse } from "@/types/ErrorInterface";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchCheckouts = async (
  page?: number,
  limit?: number,
  statusid?: string,
  varsearch?: string,
  sortby?: string,
  sortorder?: string,
  isfromreport?: boolean,
  isfromreturn?: boolean,
  onlycancelled?: boolean,
  onlydispatched?: boolean,
  onlyreturned?: boolean,
  fromdate?: string,
  todate?: string,
  typefilter?: string,
  search?: string,
  clientid?: string
): Promise<{ data: CheckoutsResponseInterface[]; totalCount: number }> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const query = new URLSearchParams({
    Page: page?.toString() || "",
    Limit: limit?.toString() || "",
    StatusId: statusid || "",
    Search: search || "",
    SortBy: sortby || "",
    SortOrder: sortorder || "",
    IsFromReport: isfromreport ? "true" : "false",
    IsFromReturn: isfromreturn ? "true" : "false",
    OnlyCancelled: onlycancelled ? "true" : "false",
    OnlyDispatched: onlydispatched ? "true" : "false",
    OnlyReturned: onlyreturned ? "true" : "false",
    FromDate: fromdate ? fromdate : "",
    ToDate: todate ? todate : "",
    CheckoutType: typefilter ? typefilter : "",
    ClientId: clientid || "",
  });

  const response = await fetch(`${baseURL}/checkouts?${query.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      origin: "http://localhost:3000",
      AuthKey: authKey,
    },
  });

  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.error);
  }

  const totalCount = parseInt(
    response.headers.get("x-page-totalcount") || "0",
    10
  );

  const data = await response.json();

  return { data, totalCount };
};
