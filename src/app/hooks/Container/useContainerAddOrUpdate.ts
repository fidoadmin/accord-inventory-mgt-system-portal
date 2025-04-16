import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addOrUpdateContainer } from "@/app/api/containerDE/containerAddOrUpdate";

export const useAddOrUpdateContainer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addOrUpdateContainer,
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        queryClient.invalidateQueries({
          queryKey: ["containersformaintenance"],
        });
      }
    },
  });
};
