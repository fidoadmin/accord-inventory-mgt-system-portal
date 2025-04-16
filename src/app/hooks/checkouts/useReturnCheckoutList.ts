import { ReturnCheckoutList } from "@/app/api/checkouts/updateReturnCheckoutList";
import { UpdateReturnInterface } from "@/types/CheckoutInterface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useUpdateReturnCheckoutList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateReturnInterface) => ReturnCheckoutList(data),
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["returncheckoutinventories"],
        });
      }
    },
  });
};
