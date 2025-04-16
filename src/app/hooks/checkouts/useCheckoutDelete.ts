import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCheckoutDetails } from "@/app/api/checkouts/checkoutDelete";
import { DeleteCheckoutDetailInterface } from "@/types/CheckoutInterface";

export const useDeleteCheckoutDetail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteCheckoutDetailInterface) =>
      deleteCheckoutDetails(data),
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["checkoutList"],
        });
      }
    },
  });
};
