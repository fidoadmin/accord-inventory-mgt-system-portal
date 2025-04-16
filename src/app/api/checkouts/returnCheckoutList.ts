import { getCookie } from "cookies-next";
import { toast } from "react-toastify";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const ReturnCheckoutList = async (params: {
  checkoutNumber: string;
  reason: string;
}) => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const response = await fetch(
    `${baseURL}/checkout/${params.checkoutNumber}/return`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        origin: "http://localhost:3000",
        AuthKey: authKey,
      },
      body: JSON.stringify({ Reason: params.reason }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    toast.error(errorData.result);
    throw new Error(errorData.error);
  }

  return response.json();
};
