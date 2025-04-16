import { BranchDetailInterface } from "@/types/BranchInterface";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchBranchDetail = async (
  Id: string
): Promise<BranchDetailInterface> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }
  const response = await fetch(`${baseURL}/branches/${Id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch branch detail");
  }
  return response.json();
};
