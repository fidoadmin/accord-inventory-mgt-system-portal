import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addOrUpdateInventory } from "@/app/api/inventories/inventoryAddOrUpdate";

export const useAddOrUpdateInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addOrUpdateInventory,
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ["inventoryDetails"] });
      }
    },
  });
};
