import {
  AddOrCompanyResponseInterface,
  AddOrUpdateCustomerPayloadInterface,
} from "@/types/CompanyInterface";
import { getCookie } from "cookies-next";

import { toast } from "react-toastify";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const addOrUpdateCustomer = async (
  CompanyData: AddOrUpdateCustomerPayloadInterface
): Promise<AddOrCompanyResponseInterface> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const response = await fetch(`${baseURL}/customers`, {
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
      `Failed to update customer (status: ${response.status}): ${errorData}`
    );
  } else {
    toast.success("Customer Updated Successfully!");
  }

  return response.json();
};
