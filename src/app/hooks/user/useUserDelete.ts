import { deleteUsers } from "@/app/api/userDE/userDelete";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteUserMaintenance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUsers,
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["users"],
        });
      }
    },
  });
};
