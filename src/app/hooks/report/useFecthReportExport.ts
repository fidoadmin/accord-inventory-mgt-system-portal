// hooks/useGetInventories.ts
import { useQuery } from "@tanstack/react-query";
import { fetchSalesReportExport } from "@/app/api/report/salesreportexport";

export const useFetchSalesReportExport = (
  authKey: string,
  fetch: boolean,
  params: {
    page?: number;
    limit?: number;
    sortBy?:string;
    sortOrder?:string;
    search?: string;
    inventoryDescriptionId?: string;
    buyerId?: string;
    fromDate?: string;
    toDate?: string;
  }
) => {
  const reportQuery = useQuery({
    queryKey: ["reportexport", params, fetch],
    enabled: fetch,
    queryFn: () =>
      fetchSalesReportExport(
        params.page,
        params.limit,
        params.sortBy,
        params.sortOrder,
        params.search,
        params.inventoryDescriptionId,
        params.buyerId,
        params.fromDate,
        params.toDate
      ),
  });
  return reportQuery;
};
