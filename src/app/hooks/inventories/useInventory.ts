import { useQuery } from "@tanstack/react-query";
import { fetchInventory } from "@/app/api/inventories/inventory";

export const useInventory = (authKey: string) => {
  const inventoryQuery = useQuery({
    queryKey: ["inventories"],
    queryFn: () => fetchInventory(),
    enabled: !!authKey,
  });

  return inventoryQuery;
};
