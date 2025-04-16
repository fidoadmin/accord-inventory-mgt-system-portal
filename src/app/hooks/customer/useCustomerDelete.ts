import { deleteCustomer } from "@/app/api/customer/customerDelete";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteCustomerMaintenance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCustomer,
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["customers"],
        });
      }
    },
  });
};
