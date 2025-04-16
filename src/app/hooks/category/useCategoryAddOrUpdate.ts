import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addOrUpdateCategory } from "@/app/api/categoryDE/categoryAddOrUpdate";

export const useAddOrUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addOrUpdateCategory,
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["categories"],
        });
      }
    },
  });
};
