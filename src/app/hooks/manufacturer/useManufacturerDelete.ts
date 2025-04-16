import { deleteManufacturer } from "@/app/api/manufacturer/manufacturerDelete";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteManufacturer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteManufacturer,
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["manufacturers"],
        });
      }
    },
  });
};
