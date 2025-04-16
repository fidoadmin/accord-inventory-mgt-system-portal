import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertCheckoutInventory } from "@/app/api/checkoutinventories/insertcheckoutinventories";

export const useInsertCheckoutInventory = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string }, 
    Error,              
    { checkoutNumber: string; barcode: string }, 
    unknown             
  >({
    mutationFn: ({ checkoutNumber, barcode }) => insertCheckoutInventory(checkoutNumber, barcode),
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        queryClient.invalidateQueries({ queryKey: ["checkoutList"] });
        console.log("Checkout inventories query invalidated.");
      }
    },
  });
};
