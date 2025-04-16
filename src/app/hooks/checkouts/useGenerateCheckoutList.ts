import { useMutation } from "@tanstack/react-query";
import { generateCheckoutList } from "@/app/api/checkouts/generateCheckoutList";

export const useGenerateCheckoutList = () => {
  return useMutation({
    mutationFn: generateCheckoutList,
  });
};
