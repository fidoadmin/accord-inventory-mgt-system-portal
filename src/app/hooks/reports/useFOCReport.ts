import { useQuery } from "@tanstack/react-query";
import { fetchFOCReport } from "@/app/api/reports/focReport";

export const useFetchFOCReport = (
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
      fetchFOCReport(
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
