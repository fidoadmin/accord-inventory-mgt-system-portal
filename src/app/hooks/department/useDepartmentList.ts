import { fetchDepartmentList } from "@/app/api/department/departmentList";
import { useQuery } from "@tanstack/react-query";

export const useDepartmentList = (
  authKey: string,
  params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    hasClient?: boolean;
    clientId?: string;
  }
) => {
  const roleQuery = useQuery({
    queryKey: ["departments", authKey, params],
    queryFn: () =>
      fetchDepartmentList(
        params.page,
        params.limit,
        params.search,
        params.sortBy,
        params.sortOrder,
        params.clientId
      ),
    enabled: !!authKey,
  });
  return roleQuery;
};
