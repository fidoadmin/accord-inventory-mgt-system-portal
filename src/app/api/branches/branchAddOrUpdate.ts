import { BranchRequestInterface } from "@/types/BranchInterface";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const addOrUpdateBranch = async (
  branchData: BranchRequestInterface
): Promise<void> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const response = await fetch(`${baseURL}/branches`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
    body: JSON.stringify(branchData),
  });

  if (!response.ok) {
    throw new Error("Failed to add branch");
  }
};
