import { addOrUpdateSupplier } from "@/app/api/supplier/supplierAddOrUpdate";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddOrUpdateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addOrUpdateSupplier,
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        queryClient.invalidateQueries({
          queryKey: ["suppliers"],
        });
      }
    },
  });
};
