import {
  AddOrUpdateInventoryDescriptionPayloadInterface,
  AddOrUpdateInventoryDescriptionResponseInterface,
} from "@/types/InventoryInterface";
import { error } from "console";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const addOrUpdateInventoryDescription = async (
  InventoryData: AddOrUpdateInventoryDescriptionPayloadInterface
): Promise<AddOrUpdateInventoryDescriptionResponseInterface> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const response = await fetch(`${baseURL}/inventorydescriptions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
    body: JSON.stringify(InventoryData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    toast.error(errorData.error);
    throw new Error(
      `Failed to update inventory description (status: ${response.status}): ${errorData}`
    );
  } else {
    toast.success("Inventory Description Updated Successfully!");
  }
  return response.json();
};
