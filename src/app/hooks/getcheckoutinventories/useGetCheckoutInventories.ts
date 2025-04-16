import { useQuery } from "@tanstack/react-query";
import { fetchCheckoutInventories } from "@/app/api/getcheckoutinventories/getcheckoutinventories";

export const useCheckoutInventories = (
  checkoutNumber: string,
  descriptionId?: string
) => {
  const query = useQuery({
    queryKey: ["checkoutinventories", checkoutNumber, descriptionId],
    queryFn: () =>
      fetchCheckoutInventories(checkoutNumber, descriptionId || ""),
    enabled: !!checkoutNumber && !!descriptionId,
  });

  return query;
};
