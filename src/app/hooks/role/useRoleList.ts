import { fetchRoleList } from "@/app/api/roles/roleList";
import { useQuery } from "@tanstack/react-query";

export const useRoleList = (
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
  const roleQuery = useQuery({
    queryKey: ["roles", authKey, params],
    queryFn: () =>
      fetchRoleList(
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
