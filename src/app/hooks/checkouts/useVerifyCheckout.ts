import { useMutation } from "@tanstack/react-query";
import { verifyCheckoutList } from "@/app/api/checkouts/verifyCheckoutList";

export const useVerifyCheckoutList = () => {
  return useMutation({
    mutationFn: verifyCheckoutList,
  });
};
