import { fetchCompanyTypeList } from "@/app/api/containerDE/companyTypeList";
import { useQuery } from "@tanstack/react-query";

export const useCompanyTypeList = (
  authKey: string,
  params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }
) => {
  const companyQuery = useQuery({
    queryKey: ["companies", params],
    queryFn: () =>
      fetchCompanyTypeList(
        params.page,
        params.limit,
        params.search,
        params.sortBy,
        params.sortOrder
      ),
    enabled: !!authKey,
  });

  return companyQuery;
};
