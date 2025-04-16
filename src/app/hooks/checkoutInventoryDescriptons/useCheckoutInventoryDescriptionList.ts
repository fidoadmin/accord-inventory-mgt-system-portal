import { useQuery } from "@tanstack/react-query";
import { fetchCheckoutInventoryDescriptions } from "@/app/api/checkoutinventorydescriptions/checkoutInventoryDescriptionList";

export const useCheckoutInventoryDescriptionList = (
  authKey: string,
  checkoutNumber: string,
  params: {
    page?: number;
    limit?: number;
    varsearch?: string;
    varsortby?: string;
    varsortorder?: string;
  }
) => {
  const checkoutInventoryQuery = useQuery({
    queryKey: ["checkoutInventoryDescriptions", checkoutNumber, params],
    queryFn: () =>
      fetchCheckoutInventoryDescriptions(
        checkoutNumber,
        params.page,
        params.limit,
        params.varsearch,
        params.varsortby,
        params.varsortorder
      ),
    enabled: !!authKey,
  });

  return checkoutInventoryQuery;
};
