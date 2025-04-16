import { CheckoutDetailInterface } from "@/types/CheckoutInterface";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchCheckoutDetails = async (
  CheckoutNumber: string,
  IsForSaleChallan?: boolean,
  IsForGatePass?: boolean,
  IsForReturnChallan?: boolean
): Promise<CheckoutDetailInterface> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }
  const response = await fetch(
    `${baseURL}/checkoutdetails/${CheckoutNumber}?IsForSaleChallan=${IsForSaleChallan}&IsForGatePass=${IsForGatePass}&IsForReturnChallan=${IsForReturnChallan}`,
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
