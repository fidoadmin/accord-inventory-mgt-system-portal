import { useQuery } from "@tanstack/react-query";
import { fetchThresholdReport } from "@/app/api/reports/thresholdReport";

export const useFetchThresholdReport = (
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
      fetchThresholdReport(
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
