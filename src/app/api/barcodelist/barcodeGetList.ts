import { CheckoutBarcodeListInterface } from "@/types/CheckoutInterface";
import { getCookie } from "cookies-next";
const baseURL = process.env.NEXT_PUBLIC_API_URL;
export const fetchBarcodeGetDetail = async (
  CheckoutNumber: string
): Promise<CheckoutBarcodeListInterface> => {
  const authKey = getCookie("authKey") as string;
  if (!authKey) {
    throw new Error("No authKey found");
  }
  const response = await fetch(
    `${baseURL}/checkoutinventories/Barcode?CheckoutNumber=${CheckoutNumber}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        AuthKey: authKey,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch barcode details");
  }
  return await response.json();
};