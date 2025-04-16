import { fetchUserProfile } from "@/app/api/users/userGetList";
import { useQuery } from "@tanstack/react-query";

export const useUserGetList = (userId: string) => {
  const userQuery = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserProfile(userId),
    enabled: !!userId,
  });

  return userQuery;
};
