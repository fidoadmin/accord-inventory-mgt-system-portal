import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addOrUpdateInventoryDescription } from "@/app/api/inventorydescription/inventoryDescriptionAddOrUpdate";

export const useAddOrUpdateInventoryDescription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addOrUpdateInventoryDescription,
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["inventoryDescDetails"],
        });
      }
    },
  });
};
