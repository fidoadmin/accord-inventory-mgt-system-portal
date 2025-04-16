// hooks/useGetInventories.ts
import { useQuery } from "@tanstack/react-query";
import { fetchCompanyList } from "@/app/api/companiesDE/companyList";
import { fetchCustomerList } from "@/app/api/companiesDE/customerList";

export const useCustomerList = (
  authKey: string,
  params: {
    page?: number;
    limit?: number;
    varcategoryname?: string;
    varsearch?: string;
    varsortby?: string;
    varsortorder?: string;
  }
) => {
  const companyQuery = useQuery({
    queryKey: ["companies", params],
    queryFn: () =>
      fetchCustomerList(
        params.page,
        params.limit,
        params.varcategoryname,
        params.varsearch,
        params.varsortby,
        params.varsortorder
      ),
    enabled: !!authKey,
  });

  return companyQuery;
};
