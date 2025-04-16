import { addOrUpdateDepartment } from "@/app/api/department/departmentAddOrUpdate";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddOrUpdateDepartmentMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addOrUpdateDepartment,
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        queryClient.invalidateQueries({
          queryKey: ["departments"],
        });
      }
    },
  });
};
