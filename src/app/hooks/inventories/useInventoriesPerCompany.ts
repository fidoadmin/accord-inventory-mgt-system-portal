import { useQuery } from "@tanstack/react-query";
import { fetchInventoryPerCompany } from "@/app/api/inventories/inventoriesPerCompany";

export const useInventoryPerCompany = (
  authKey: string,
  params: {
    inventoryDescriptionId: string;
    companyId: string;
    page: number;
    limit: number;
  }
) => {
  const inventoriesPerCompanyQuery = useQuery({
    queryKey: ["inventoryPerCompany", params],
    queryFn: () =>
      fetchInventoryPerCompany(
        params.inventoryDescriptionId,
        params.companyId,
        params.limit,
        params.page
      ),

    enabled: !!authKey,
  });
  return inventoriesPerCompanyQuery;
};
