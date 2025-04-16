import {
  AddOrUpdateInventoryPrice,
  AddOrUpdatePriceResponseInterface,
} from "@/types/PriceInterface";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const addOrUpdatePrice = async (
  PriceData: AddOrUpdateInventoryPrice
): Promise<AddOrUpdatePriceResponseInterface> => {
  const authKey = getCookie("authKey") as string;
  if (!authKey) {
    throw new Error("No authKey found");
  }

  const response = await fetch(`${baseURL}/inventories/price`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
    body: JSON.stringify(PriceData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`${errorData.error}`);
  } else {
    toast.success("Price Updated Successfully!");
  }

  return response.json();
};
