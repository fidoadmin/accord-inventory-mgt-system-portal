import { InventoryDetailForCategoryInterface } from "@/types/InventoryInterface";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchInventoryDetailForCategory = async (
  CategoryName: string
): Promise<InventoryDetailForCategoryInterface[]> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const response = await fetch(
    `${baseURL}/inventories?categoryName=${CategoryName}`,
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

  const list = response.json();

  return list;
};
