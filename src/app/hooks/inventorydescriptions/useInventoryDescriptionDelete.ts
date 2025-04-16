import { deleteBranch } from "@/app/api/branches/branchDelete";
import { deleteInventoryDescriptions } from "@/app/api/inventorydescription/inventoryDescriptionDelete";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteInventoryDescription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteInventoryDescriptions,
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["inventoryDescriptions"],
        });
      }
    },
  });
};
