import { GenerateCheckoutListRequestInterface } from "@/types/CheckoutInterface";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const generateCheckoutList = async (
  Data: GenerateCheckoutListRequestInterface
) => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }
  const response = await fetch(`${baseURL}/checkoutlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
      origin: "http://localhost:3000",
    },
    body: JSON.stringify(Data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return errorData;
  }

  const responseData = await response.json();
  return responseData;
};
