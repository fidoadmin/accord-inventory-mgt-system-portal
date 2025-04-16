import { fetchContainerListForMaintenance } from "@/app/api/containers/containerListForMaintenance";
import { useQuery } from "@tanstack/react-query";

export const useContainersForMaintenance = (
  authKey: string,
  params: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    sortBy?: string;
    sortOrder?: string;
    type?: string;
    clientid?: string;
  }
) => {
  const containerQuery = useQuery({
    queryKey: ["containersformaintenance", authKey, params],
    queryFn: () =>
      fetchContainerListForMaintenance(
        params.page,
        params.limit,
        params.search,
        params.categoryId,
        params.sortBy,
        params.sortOrder,
        params.type,
        params.clientid
      ),
    enabled: !!authKey,
  });

  return containerQuery;
};
