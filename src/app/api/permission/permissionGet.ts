import { RolePermission } from "@/types/Permission";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchPermission = async (
  page?: number,
  limit?: number,
  varsearch?: string,
  roleid?: string,
  clientid?: string,
  accesslabelid?: string
): Promise<{
  data: RolePermission[];
  totalCount: number;
}> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const query = new URLSearchParams({
    Page: page?.toString() || "",
    Limit: limit?.toString() || "",
    Search: varsearch || "",
    RoleId: roleid || "",
    ClientId: clientid || "",
    AccessLabelTypeId: accesslabelid || "",
  });

  const response = await fetch(`${baseURL}/permissions?${query.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch role list");
  }

  const totalCount = parseInt(
    response.headers.get("x-page-totalcount") || "0",
    10
  );
  const data = await response.json();
  return { data, totalCount };
};
