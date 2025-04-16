import { deleteClient } from "@/app/api/clients/clientDelete";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteClientMaintenance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteClient,
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["clients"],
        });
      }
    },
  });
};
