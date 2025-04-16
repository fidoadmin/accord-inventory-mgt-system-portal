import { deleteCompany } from "@/app/api/companiesDE/companyDelete";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteCompanyMaintenance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCompany,
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["companies"],
        });
      }
    },
  });
};
