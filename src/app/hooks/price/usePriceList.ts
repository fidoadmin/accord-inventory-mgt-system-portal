import { fetchPrice } from "@/app/api/price/priceList";
import { useQuery } from "@tanstack/react-query";

export const usePriceList = (
  authKey: string,
  params: {
    page?: number;
    limit?: number;
    search?: string | null;
    sortBy?: string;
    sortOrder?: string;
  }
) => {
  const roleQuery = useQuery({
    queryKey: ["inventories/price", authKey, params],
    queryFn: () =>
      fetchPrice(
        params.page,
        params.limit,
        params.search,
        params.sortBy,
        params.sortOrder
      ),
    enabled: !!params.search,
  });
  return roleQuery;
};
