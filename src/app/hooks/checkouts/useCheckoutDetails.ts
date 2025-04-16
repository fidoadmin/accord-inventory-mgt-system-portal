import { useQuery } from "@tanstack/react-query";
import { fetchCheckoutDetails } from "@/app/api/checkouts/checkoutDetails/route";

export const useCheckoutDetails = (
  authKey: string,
  checkoutNumber: string,
  isForSaleChallan?: boolean,
  isForGatePass?: boolean,
  IsForReturnChallan?: boolean
) => {
  const detailsQuery = useQuery({
    queryKey: [
      "checkoutDetails",
      checkoutNumber,
      isForSaleChallan,
      isForGatePass,
      IsForReturnChallan,
    ],
    queryFn: () =>
      fetchCheckoutDetails(
        checkoutNumber,
        isForSaleChallan!,
        isForGatePass,
        IsForReturnChallan
      ),
    enabled: !!authKey,
  });

  return detailsQuery;
};
