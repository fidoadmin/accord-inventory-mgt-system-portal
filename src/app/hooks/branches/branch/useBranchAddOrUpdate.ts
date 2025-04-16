import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addOrUpdateBranch } from "@/app/api/branchDE/branchAddOrUpdate";

export const useAddOrUpdateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addOrUpdateBranch,
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
