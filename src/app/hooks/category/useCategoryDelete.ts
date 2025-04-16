import { deleteCategoryDetails } from "@/app/api/categoryDE/categoryDelete";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteCategoryDetail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategoryDetails,
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
