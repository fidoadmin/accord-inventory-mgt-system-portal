import { fetchSubDepartmentList } from "@/app/api/department/subdepartmentList";
import { useQuery } from "@tanstack/react-query";

export const useSubDepartmentList = (
  authKey: string,
  params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    hasChildren?: boolean;
    parentId?: string;
  }
) => {
  const roleQuery = useQuery({
    queryKey: ["department/sub", authKey, params],
    queryFn: () =>
      fetchSubDepartmentList(
        params.page,
        params.limit,
        params.search,
        params.sortBy,
        params.sortOrder,
        params.parentId
      ),
    enabled: !!params.hasChildren,
  });
  return roleQuery;
};
