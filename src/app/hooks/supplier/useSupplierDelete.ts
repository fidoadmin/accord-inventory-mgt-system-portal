import { deleteSupplier } from "@/app/api/supplier/supplierDelete";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSupplier,
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["suppliers"],
        });
      }
    },
  });
};
