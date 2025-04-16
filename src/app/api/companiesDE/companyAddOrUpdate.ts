import {
  AddOrCompanyResponseInterface,
  AddOrUpdateCompanyPayloadInterface,
} from "@/types/CompanyInterface";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const addOrUpdateCompany = async (
  CompanyData: AddOrUpdateCompanyPayloadInterface
): Promise<AddOrCompanyResponseInterface> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const response = await fetch(`${baseURL}/companies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
    body: JSON.stringify(CompanyData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    toast.error(errorData.error);
    throw new Error(
      `Failed to update company (status: ${response.status}): ${errorData}`
    );
  } else {
    toast.success("Company Updated Successfully!");
  }
  return response.json();
};
