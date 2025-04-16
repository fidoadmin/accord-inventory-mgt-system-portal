import { addOrUpdateManufacturer } from "@/app/api/manufacturer/manufacturerAddOrUpdate";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddOrUpdateManufacturer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addOrUpdateManufacturer,
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        queryClient.invalidateQueries({
          queryKey: ["manufacturers"],
        });
      }
    },
  });
};
