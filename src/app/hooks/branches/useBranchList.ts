// hooks/useGetInventories.ts
import { useQuery } from "@tanstack/react-query";
import { fetchBranchList } from "@/app/api/branches/branchList";

export const useBranchList = (
  authKey: string,
  params: {
    page?: number;
    limit?: number;
    varcategoryname?: string;
    companyId?: string;
    varsearch?: string;
    varsortby?: string;
    varsortorder?: string;
  }
) => {
  const branchQuery = useQuery({
    queryKey: ["branches", params],
    queryFn: () =>
      fetchBranchList(
        params.page,
        params.limit,
        params.varcategoryname,
        params.companyId,
        params.varsearch,
        params.varsortby,
        params.varsortorder
      ),
    enabled: !!authKey,
  });

  return branchQuery;
};
