import { deleteDepartment } from "@/app/api/department/departmentDelete";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteDepartmentMaintenance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDepartment,
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["departments"],
        });
      }
    },
  });
};
