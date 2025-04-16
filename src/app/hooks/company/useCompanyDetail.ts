import { fetchCompanyDetail } from "@/app/api/companiesDE/[companydetail]/route";
import { useQuery } from "@tanstack/react-query";

export const useCompanyDetail = (authKey: string, id: string) => {
  const detailsQuery = useQuery({
    queryKey: ["companyDetails", id],
    queryFn: () => fetchCompanyDetail(id),
    enabled: !!authKey,
  });

  return detailsQuery;
};
