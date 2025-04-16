import { useQuery } from "@tanstack/react-query";
import { fetchTeamList } from "@/app/api/teams/teamList";

export const useTeamList = (
  authKey: string,
  params: {
    page?: number;
    limit?: number;
    varcategoryname?: string;
    varsearch?: string;
    varsortby?: string;
    varsortorder?: string;
  }
) => {
  const teamQuery = useQuery({
    queryKey: ["teams", params],
    queryFn: () =>
      fetchTeamList(
        params.page,
        params.limit,
        params.varcategoryname,
        params.varsearch,
        params.varsortby,
        params.varsortorder
      ),
    enabled: !!authKey,
  });

  return teamQuery;
};
