import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addOrUpdateUser } from "@/app/api/userDE/userAddOrUpdate";

export const useAddOrUpdateUserMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addOrUpdateUser,
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
