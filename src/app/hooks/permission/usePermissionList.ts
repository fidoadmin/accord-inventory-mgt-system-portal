import { fetchPermission } from "@/app/api/permission/permissionGet";
import { useQuery } from "@tanstack/react-query";
export const useFetchPermission = (
  authKey: string,
  params: {
    page?: number;
    limit?: number;
    varsearch?: string;
    roleid?: string;
    clientid?: string;
    accesslabelid?: string;
  }
) => {
  const permissionQuery = useQuery({
    queryKey: [
      "permissions",
      authKey,
      params.page,
      params.limit,
      params.varsearch,
      params.roleid,
      params.clientid,
      params.accesslabelid,
    ],
    queryFn: () =>
      fetchPermission(
        params.page,
        params.limit,
        params.varsearch,
        params.roleid,
        params.clientid,
        params.accesslabelid
      ),
    enabled: !!authKey,
  });
  return permissionQuery;
};
