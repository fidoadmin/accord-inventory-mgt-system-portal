import { useQuery } from "@tanstack/react-query";
import { fetchInvoiceNullReport } from "@/app/api/reports/invoicenullReport";

export const useInvoiceNullReport = (
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
      fetchInvoiceNullReport(
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
