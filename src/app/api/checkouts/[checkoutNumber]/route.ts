import { CheckoutInventoryDetailInterface } from "@/types/CheckoutInterface";
import { getCookie } from "cookies-next";

import { toast } from "react-toastify";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchCheckoutList = async (
  CheckoutNumber: string
): Promise<CheckoutInventoryDetailInterface[]> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }
  const response = await fetch(
    `${baseURL}/checkoutlist/verify/${CheckoutNumber}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        AuthKey: authKey,
      },
    }
  );

  if (!response.ok) {
    const errorResponse = await response.json();
    toast.error(errorResponse.error);
  }

  return response.json();
};
