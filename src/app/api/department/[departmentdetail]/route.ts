import { DepartmentDetailInterface } from "@/types/Department";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchDepartmentDetail = async (
  Id: string
): Promise<DepartmentDetailInterface> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const response = await fetch(`${baseURL}/departments/${Id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authKey}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch department detail");
  }

  return response.json();
};
