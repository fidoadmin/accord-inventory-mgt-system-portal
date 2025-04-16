import { useQuery } from "@tanstack/react-query";
import { fetchSupplierList } from "@/app/api/supplier/supplierList";

export const useSupplierList = (
  authKey: string,
  params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    clientId?: string;
  }
) => {
  const companyQuery = useQuery({
    queryKey: ["suppliers", params],
    queryFn: () =>
      fetchSupplierList(
        params.page,
        params.limit,
        params.search,
        params.sortBy,
        params.sortOrder,
        params.clientId
      ),
    enabled: !!authKey,
  });

  return companyQuery;
};
