import { fetchBranchDetail } from "@/app/api/branchDE/[branchdetail]/route";
import { useQuery } from "@tanstack/react-query";

export const useBranchDetails = (authKey: string, id: string) => {
  const detailsQuery = useQuery({
    queryKey: ["branchDetails", id],
    queryFn: () => fetchBranchDetail(id),
    enabled: !!authKey,
  });

  return detailsQuery;
};
