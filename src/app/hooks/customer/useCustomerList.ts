import { fetchCustomer } from "@/app/api/customer/customerList";
import { useQuery } from "@tanstack/react-query";
export const useCustomer = (
  authKey: string,
  params: {
    page?: number;
    limit?: number;
    search?: string;
    varsortby?: string;
    varsortorder?: string;
    clientid?: string;
  }
) => {
  const companyQuery = useQuery({
    queryKey: ["customers", params],
    queryFn: () =>
      fetchCustomer(
        params.page,
        params.limit,
        params.search,
        params.varsortby,
        params.varsortorder,
        params.clientid
      ),
    enabled: !!authKey,
  });

  return companyQuery;
};
