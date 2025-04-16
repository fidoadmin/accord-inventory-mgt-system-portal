import { InventoryDescriptionDetailInterface } from "@/types/InventoryInterface";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchInventoryDescriptionDetail = async (
  authKey: string,
  descriptionId: string,
  page: number,
  limit: number,
  sortby?: string,
  sortorder?: "asc" | "desc"
): Promise<{
  totalCount: number;
  data: InventoryDescriptionDetailInterface;
}> => {
  const query = new URLSearchParams({
    Page: page?.toString() || "",
    Limit: limit?.toString() || "",
    SortBy: sortby || "",
    SortOrder: sortorder || "",
  });

  const response = await fetch(
    `${baseURL}/inventorydescriptions/${descriptionId}?${query.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        AuthKey: authKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch inventory description details: ${response.statusText}`
    );
  }

  const totalCount = parseInt(
    response.headers.get("x-page-totalcount") || "0",
    10
  );
  const data = await response.json();
  console.log(data);

  return {
    totalCount,
    data,
  };
};
