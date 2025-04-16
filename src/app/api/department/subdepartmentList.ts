import { getCookie } from "cookies-next";
import { DepartmentDetailInterface } from "@/types/Department";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchSubDepartmentList = async (
  page?: number,
  limit?: number,
  varsearch?: string,
  varsortby?: string,
  varsortorder?: string,
  parentId?: string
): Promise<{ data: DepartmentDetailInterface[]; totalCount: number }> => {
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
    ParentId: parentId || "",
  });

  const response = await fetch(
    `${baseURL}/department/sub?${query.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        AuthKey: authKey,
      },
    }
  );

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
