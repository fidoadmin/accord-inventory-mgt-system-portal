import { UserDetailInterface } from "@/types/UserInterface";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchUserList = async (
  page?: number,
  limit?: number,
  departmentCode?: string,
  varsearch?: string,
  varsortby?: string,
  varsortorder?: string,
  clientid?: string
): Promise<{ data: UserDetailInterface[]; totalCount: number }> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const query = new URLSearchParams({
    Page: page?.toString() || "",
    Limit: limit?.toString() || "",
    DepartmentCode: departmentCode || "",
    Search: varsearch || "",
    SortBy: varsortby || "",
    SortOrder: varsortorder || "",
    ClientId: clientid || "",
  });

  const response = await fetch(`${baseURL}/users?${query.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user list");
  }
  const totalCount = parseInt(
    response.headers.get("x-page-totalcount") || "0",
    10
  );
  const data = await response.json();
  return { data, totalCount };
};
