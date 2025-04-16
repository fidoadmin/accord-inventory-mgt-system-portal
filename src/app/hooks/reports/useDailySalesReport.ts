import { fetchDailySalesReport } from "@/app/api/reports/dailysalesReport";
import { useQuery } from "@tanstack/react-query";

export const useFetchDailySalesReport = (
  authKey: string,
  params: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
    search?: string;
    clientid?: string;
  }
) => {
  const reportQuery = useQuery({
    queryKey: ["report", params],
    queryFn: () =>
      fetchDailySalesReport(
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
