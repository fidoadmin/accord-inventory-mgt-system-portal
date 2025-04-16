import { useQuery } from "@tanstack/react-query";
import { fetchBranchList } from "@/app/api/branches/branchList";

export const useBranchGetList = (
  authKey: string,
  params: {
    page?: number;
    limit?: number;
    search?: string;
    varsortby?: string;
    varsortorder?: string;
    clientId?: string;
  }
) => {
  const branchQuery = useQuery({
    queryKey: ["branches", params],
    queryFn: () =>
      fetchBranchList(
        params.page,
        params.limit,
        params.search,
        params.varsortby,
        params.varsortorder,
        params.clientId
      ),
    enabled: !!authKey,
  });

  return branchQuery;
};
