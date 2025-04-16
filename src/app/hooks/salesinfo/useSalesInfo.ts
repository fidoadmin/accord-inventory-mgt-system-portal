import { fetchSalesInfo } from "@/app/api/salesinfo/salesInfo";
import { useQuery } from "@tanstack/react-query";

export const useFetchSalesInfo = (
  authKey: string,
  params: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
    search?: string;
    clientid?:string
  }
) => {
  const reportQuery = useQuery({
    queryKey: ["report", params],
    queryFn: () =>
      fetchSalesInfo(
        params.page,
        params.limit,
        params.sortBy,
        params.sortOrder,
        params.search,
        params.clientid
      ),
  });
  return reportQuery;
};
