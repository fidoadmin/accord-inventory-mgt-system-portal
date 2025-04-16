import { ReturnCheckoutList } from "@/app/api/checkouts/returnCheckoutList";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useReturnCheckoutList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ReturnCheckoutList,
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        toast.success("Checkout Returned Successfully");
        await queryClient.invalidateQueries({
          queryKey: ["checkouts"],
        });
      }
    },
  });
};
