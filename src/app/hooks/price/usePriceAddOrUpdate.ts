import { addOrUpdatePrice } from "@/app/api/price/priceAddOrUpdate";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddOrUpdateInventoryPrice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addOrUpdatePrice,
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        queryClient.invalidateQueries({
          queryKey: ["inventories/price"],
        });
      }
    },
  });
};
