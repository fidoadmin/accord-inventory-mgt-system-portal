import { deleteRole } from "@/app/api/roles/roleDelete";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteRoleMaintenance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRole,
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["roles"],
        });
      }
    },
  });
};
