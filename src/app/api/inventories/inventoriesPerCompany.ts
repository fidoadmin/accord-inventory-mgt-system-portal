import { InventoryPerCompanyResponse } from "@/types/ComponentInterface";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchInventoryPerCompany = async (
  inventoryDescriptionId: string,
  companyId: string,
  limit: number = 10,
  page: number = 1
): Promise<InventoryPerCompanyResponse[]> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const query = new URLSearchParams({
    InventoryDescriptionId: inventoryDescriptionId,
    CompanyId: companyId,
    Limit: limit.toString(),
    Page: page.toString(),
  });

  const response = await fetch(
    `${baseURL}/inventoriespercompany?${query.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        AuthKey: authKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch inventory per company");
  }

  return response.json();
};
