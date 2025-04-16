import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCheckoutInventoryDescriptions } from "@/app/api/checkoutinventorydescriptions/checkoutInventoryDescriptionUpdate";

export const useUpdateCheckoutInventoryDescriptions = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void, 
    Error, 
    {  records: { Id: string; InvoiceNumber: string }[] } 
  >({
    mutationFn: ({  records }) =>
      updateCheckoutInventoryDescriptions( records),
    onSettled: (_, error) => {
      if (error) {
        console.error("Error updating checkout inventory descriptions:", error);
      } else {
        queryClient.invalidateQueries({ queryKey: ["checkoutList"] }); 
        console.log("Checkout inventory descriptions updated and cache invalidated.");
      }
    },
  });
};
