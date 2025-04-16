import { getCookie } from "cookies-next";
import { toast } from "react-toastify";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const insertCheckoutInventory = async (
  checkoutNumber: string,
  barcode: string
): Promise<{ message: string }> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    toast.error("No authKey found");
    throw new Error("No authKey found");
  }

  const response = await fetch(
    `${baseURL}/checkoutinventories/${checkoutNumber}/${barcode}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        AuthKey: authKey,
      },
    }
  );

  if (!response.ok) {
    const errorResponse = await response.json();
    console.log(errorResponse);
    toast.error(errorResponse.message || "Failed to update checkout inventory");
    throw new Error(
      errorResponse.message || "Failed to update checkout inventory"
    );
  }

  const result = await response.json();
  return result;
};
