import { deleteBranchDetails } from "@/app/api/branchDE/branchDelete";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteBranchDetail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBranchDetails,
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["branches"],
        });
      }
    },
  });
};
