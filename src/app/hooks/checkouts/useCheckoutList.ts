import { useQuery } from "@tanstack/react-query";
import { fetchCheckoutList } from "@/app/api/checkouts/[checkoutNumber]/route";

export const useCheckoutList = (authKey: string, checkoutNumber: string) => {
  const detailsQuery = useQuery({
    queryKey: ["checkoutList", checkoutNumber],
    queryFn: () => fetchCheckoutList(checkoutNumber),
    enabled: !!authKey,
  });

  return detailsQuery;
};
