import { fetchCheckoutToAndForDetails } from "@/app/api/checkouts/checkoutToAndForDetails";
import { useQuery } from "@tanstack/react-query";

export const useCheckoutToAndForDetails = (
  authKey: string,
  checkoutNumber: string
) => {
  const detailsQuery = useQuery({
    queryKey: ["checkoutToAndForDetails", checkoutNumber],
    queryFn: () => fetchCheckoutToAndForDetails(checkoutNumber),
    enabled: !!authKey && !!checkoutNumber,
  });

  return detailsQuery;
};
