import { fetchContainerList } from "@/app/api/containers/containerList";
import { useQuery } from "@tanstack/react-query";

export const useContainers = (
  authKey: string,
  params: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    sortBy?: string;
    sortOrder?: string;
  }
) => {
  const containerQuery = useQuery({
    queryKey: ["containers", authKey, params], 
    queryFn: () =>
      fetchContainerList(
        params.page,
        params.limit,
        params.search,
        params.categoryId,
        params.sortBy,
        params.sortOrder
      ),
    enabled: !!authKey, 
  });

  return containerQuery;
};
