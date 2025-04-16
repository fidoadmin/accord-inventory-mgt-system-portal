import { useQuery } from "@tanstack/react-query";
import { fetchCompanyList } from "@/app/api/companiesDE/companyList";

export const useCompanyList = (
  authKey: string,
  params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    clientId?: string;
    isinternal?: string;
  }
) => {
  const companyQuery = useQuery({
    queryKey: ["companies", params],
    queryFn: () =>
      fetchCompanyList(
        params.page,
        params.limit,
        params.search,
        params.sortBy,
        params.sortOrder,
        params.clientId,
        params.isinternal
      ),
    enabled: !!authKey,
  });

  return companyQuery;
};
