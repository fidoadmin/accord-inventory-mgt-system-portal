import { useQuery } from "@tanstack/react-query";
import { fetchManufacturerList } from "@/app/api/manufacturer/manufacturerList";

export const useManufacturerList = (
  authKey: string,
  params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    clientId?: string;
  }
) => {
  const companyQuery = useQuery({
    queryKey: ["manufacturers", params],
    queryFn: () =>
      fetchManufacturerList(
        params.page,
        params.limit,
        params.search,
        params.sortBy,
        params.sortOrder,
        params.clientId
      ),
    enabled: !!authKey,
  });

  return companyQuery;
};
