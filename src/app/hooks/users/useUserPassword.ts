import { addOrUpdateUserPassword } from "@/app/api/users/userPassword";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddOrUpdateUserPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addOrUpdateUserPassword,
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["UpdatePassword"],
        });
      }
    },
  });
};
