import {
  AddOrManufacturerResponseInterface,
  AddOrUpdateSupplierPayloadInterface,
} from "@/types/ManufacturerInterface";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const addOrUpdateSupplier = async (
  CompanyData: AddOrUpdateSupplierPayloadInterface
): Promise<AddOrManufacturerResponseInterface> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const response = await fetch(`${baseURL}/suppliers`, {
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
      `Failed to update suppliers (status: ${response.status}): ${errorData}`
    );
  } else {
    toast.success("Supplier Updated Successfully!");
  }
  return response.json();
};
