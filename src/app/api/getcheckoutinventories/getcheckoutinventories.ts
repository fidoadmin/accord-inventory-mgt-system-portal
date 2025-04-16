import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchCheckoutInventories = async (
  checkoutNumber: string,
  descriptionid: string
): Promise<{ data: any[]; totalCount: number }> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const query = new URLSearchParams({
    CheckoutInventoryDescriptionId: descriptionid,
    CheckoutNumber: checkoutNumber,
  });

  const response = await fetch(
    `${baseURL}/checkoutinventories?${query.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        AuthKey: authKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch checkout inventories");
  }

  const totalCount = parseInt(
    response.headers.get("x-page-totalcount") || "0",
    10
  );
  const data = await response.json();

  return { data, totalCount };
};
