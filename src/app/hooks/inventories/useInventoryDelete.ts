import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteInventory } from "@/app/api/inventories/inventoryDelete";

export const useDeleteInventory = () => {
  return useMutation({ mutationFn: deleteInventory });
};
