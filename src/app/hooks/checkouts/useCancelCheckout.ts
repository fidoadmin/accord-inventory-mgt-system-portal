import { useMutation } from "@tanstack/react-query";
import { cancelCheckoutList } from "@/app/api/checkouts/cancelCheckoutList";

export const useCancelCheckoutList = () => {
  return useMutation({
    mutationFn: cancelCheckoutList,
  });
};
