import { CheckoutInventoryDescriptionListInterface } from "@/types/CheckoutInventoryDescriptions";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchCheckoutInventoryDescriptions = async (
  checkoutNumber: string,
  page?: number,
  limit?: number,
  varsearch?: string,
  varsortby?: string,
  varsortorder?: string
): Promise<{
  data: CheckoutInventoryDescriptionListInterface[];
  totalCount: number;
}> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const query = new URLSearchParams({
    Page: page?.toString() || "0",
    Limit: limit?.toString() || "0",
    Search: varsearch || "",
    SortBy: varsortby || "description",
    SortOrder: varsortorder || "ASC",
    CheckoutNumber: checkoutNumber,
  });

  const response = await fetch(
    `${baseURL}/checkoutinventorydescriptions?${query.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        AuthKey: authKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch checkout inventory descriptions");
  }

  const totalCount = parseInt(
    response.headers.get("x-page-totalcount") || "0",
    10
  );

  const data = await response.json();

  return { data, totalCount };
};
