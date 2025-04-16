import { fetchContainerDetail } from "@/app/api/containerDE/[containerdetail]/route";
import { useQuery } from "@tanstack/react-query";

export const useContainerDetails = (authKey: string, id: string) => {
  const detailsQuery = useQuery({
    queryKey: ["containerDetails", id],
    queryFn: () => fetchContainerDetail(id),
    enabled: !!authKey && !!id,
  });

  return detailsQuery;
};
