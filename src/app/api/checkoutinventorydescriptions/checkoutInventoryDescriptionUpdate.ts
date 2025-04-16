import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const updateCheckoutInventoryDescriptions = async (
  records: { Id: string; InvoiceNumber: string }[]
): Promise<void> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const response = await fetch(`${baseURL}/checkoutinventorydescriptions`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
    body: JSON.stringify(records),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Failed to update inventory descriptions"
    );
  }
};
