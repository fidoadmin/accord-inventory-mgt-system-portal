import { RoleDetailInterface } from "@/types/RolesInterface";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchRoleDetail = async (
  Id: string
): Promise<RoleDetailInterface> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const response = await fetch(`${baseURL}/roles/${Id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authKey}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch role detail");
  }

  return response.json();
};
