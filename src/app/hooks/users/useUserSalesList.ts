import { useQuery } from "@tanstack/react-query";
import { fetchSalesUserList } from "@/app/api/users/userSalesList";

export const useSalesUserList = (
  authKey: string,
  params: {
    page?: number;
    limit?: number;
  }
) => {
  const userQuery = useQuery({
    queryKey: ["users", params],
    queryFn: () => fetchSalesUserList(params.page, params.limit),
    enabled: !!authKey,
  });

  return userQuery;
};
