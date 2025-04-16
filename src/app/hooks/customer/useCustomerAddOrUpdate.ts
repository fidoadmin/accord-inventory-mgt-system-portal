import { addOrUpdateCustomer } from "@/app/api/customer/customerAddOrUpdate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useAddOrUpdateCustomersMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addOrUpdateCustomer,
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        queryClient.invalidateQueries({
          queryKey: ["customers"],
        });
      }
    },
  });
};
