import { useQuery } from "@tanstack/react-query";
import { fetchInventoryDetail } from "@/app/api/inventories/[inventoryId]/route";

export const useInventoryDetails = (authKey: string, id: string) => {
  const detailsQuery = useQuery({
    queryKey: ["inventoryDetails", id],
    queryFn: () => fetchInventoryDetail(id),
    enabled: !!authKey,
  });

  return detailsQuery;
};
