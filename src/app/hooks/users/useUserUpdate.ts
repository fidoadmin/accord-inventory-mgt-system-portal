import { addOrUpdateUserProfile } from "@/app/api/users/userUpdate";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddOrUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addOrUpdateUserProfile,
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["user"],
        });
      }
    },
  });
};
