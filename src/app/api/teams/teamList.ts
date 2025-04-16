import { TeamInterface } from "@/types/TeamInterface";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchTeamList = async (
  page?: number,
  limit?: number,
  varcategoryname?: string,
  varsearch?: string,
  varsortby?: string,
  varsortorder?: string
): Promise<TeamInterface[]> => {
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
  });

  const response = await fetch(`${baseURL}/teams?${query.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch team list");
  }
  return response.json();
};
