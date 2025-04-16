import { CheckoutToAndForDetailInterface } from "@/types/CheckoutInterface";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchCheckoutToAndForDetails = async (
  CheckoutNumber: string
): Promise<CheckoutToAndForDetailInterface> => {
  console.log("CheckoutNumber", CheckoutNumber);
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }
  const response = await fetch(
    `${baseURL}/checkouttoandfordetails/${CheckoutNumber}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        AuthKey: authKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch inventory detail");
  }
  return response.json();
};
