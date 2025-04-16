import { VerifyCheckoutResponseInterface } from "@/types/CheckoutInterface";
import { ErrorResponse } from "@/types/ErrorInterface";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const verifyCheckoutList = async (
  CheckoutNumber: string
): Promise<VerifyCheckoutResponseInterface> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }
  const response = await fetch(`${baseURL}/checkout/${CheckoutNumber}/verify`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      origin: "http://localhost:3000",
      AuthKey: authKey,
    },
  });

  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.error);
  }

  const responseData = await response.json();
  return responseData;
};
