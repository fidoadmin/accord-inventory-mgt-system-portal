// hooks/useGetInventories.ts
import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "@/app/api/dashboard/dashboard";

export const useFetchDashboard = (
) => {
  const dashboardQuery = useQuery({
    queryKey: ["dashboard"],
    queryFn: () =>
      fetchDashboard()
  });
  return dashboardQuery

};
