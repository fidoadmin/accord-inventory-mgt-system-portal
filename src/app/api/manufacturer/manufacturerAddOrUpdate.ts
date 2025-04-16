import {
  AddOrUpdateManufacturerPayloadInterface,
  AddOrManufacturerResponseInterface,
} from "@/types/ManufacturerInterface";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const addOrUpdateManufacturer = async (
  ManufacturerData: AddOrUpdateManufacturerPayloadInterface
): Promise<AddOrManufacturerResponseInterface> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const response = await fetch(`${baseURL}/manufacturers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
    body: JSON.stringify(ManufacturerData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    toast.error(errorData.error);
    throw new Error(
      `Failed to update manufacturer (status: ${response.status}): ${errorData}`
    );
  } else {
    toast.success("Manufacturer Updated Successfully!");
  }
  return response.json();
};
