import { addOrUpdatePermission } from "@/app/api/permission/permissionAddOrUpdate";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddOrUpdatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addOrUpdatePermission,
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["permissions"],
        });
      }
    },
  });
};
