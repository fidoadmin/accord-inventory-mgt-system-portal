import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchInventoryList } from "@/app/api/inventories/inventoryList";

export const useInventoryList = (
  authKey: string,
  inventoryDescriptionId: string,
  params: {
    page?: number;
    limit?: number;
    sortby?: string;
    sortorder?: string;
  }
) => {
  const inventoryQuery = useQuery({
    queryKey: ["inventories", params],
    queryFn: () =>
      fetchInventoryList(
        params.page,
        params.limit,
        inventoryDescriptionId,
        params.sortby,
        params.sortorder
      ),
    enabled: !!authKey,
    placeholderData: keepPreviousData,
  });

  return inventoryQuery;
};
