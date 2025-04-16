import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchInventoryDescriptionList } from "@/app/api/inventorydescription/inventoryDescriptionList";

export const useInventoryDescriptionList = (
  authKey: string,
  params: {
    page?: number;
    limit?: number;
    categoryId?: string;
    companyId?: string;
    branchId?: string;
    search?: string;
    varsortby?: string;
    varsortorder?: string;
    isCheckout?: boolean;
    isFromDispatch?: boolean;
  }
) => {
  const inventoryQuery = useQuery({
    queryKey: ["inventoryDescriptions", params],
    queryFn: () =>
      fetchInventoryDescriptionList(
        params.page,
        params.limit,
        params.categoryId,
        params.branchId,
        params.companyId,
        params.search,
        params.varsortby,
        params.varsortorder,
        params.isCheckout,
        params.isFromDispatch
      ),
    enabled: !!authKey,
    placeholderData: keepPreviousData,
  });

  return inventoryQuery;
};
