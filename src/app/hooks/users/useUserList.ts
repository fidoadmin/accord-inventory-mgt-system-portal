import { useQuery } from "@tanstack/react-query";
import { fetchUserList } from "@/app/api/users/userList";

export const useUserList = (
  authKey: string,
  params: {
    page?: number;
    limit?: number;
    departmentCode?: string;
    search?: string;
    varsortby?: string;
    varsortorder?: string;
    clientid?: string;
  }
) => {
  const userQuery = useQuery({
    queryKey: ["users", params],
    queryFn: () =>
      fetchUserList(
        params.page,
        params.limit,
        params.departmentCode,
        params.search,
        params.varsortby,
        params.varsortorder,
        params.clientid
      ),
    enabled: !!authKey,
  });

  return userQuery;
};
