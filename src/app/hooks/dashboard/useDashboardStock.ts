import { fetchDashboardStock } from "@/app/api/dashboard/dashboardStock";
import { useQuery } from "@tanstack/react-query";
export const useDashboardStock = (authKey: string) => {
  const companyQuery = useQuery({
    queryKey: ["stock", authKey],
    queryFn: () => fetchDashboardStock(),
    enabled: !!authKey,
  });

  return companyQuery;
};
