import { fetchUserDetail } from "@/app/api/userDE/[userdetail]/route";
import { useQuery } from "@tanstack/react-query";

export const useUserDetails = (authKey: string, id: string) => {
  const detailsQuery = useQuery({
    queryKey: ["userDetails", id],
    queryFn: () => fetchUserDetail(id),
    enabled: !!authKey,
  });

  return detailsQuery;
};
