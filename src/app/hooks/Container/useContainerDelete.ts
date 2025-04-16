import { deleteContainerDetails } from "@/app/api/containerDE/containerDelete";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useDeleteContainer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteContainerDetails,
    onSettled: async (_, error) => {
      if (error) {
        console.error("Error deleting container:", error);
      } else {
        toast.success("Container Deleted Successfully");

        queryClient.invalidateQueries({
          queryKey: ["containersformaintenance"],
        });
        console.log("Container list query invalidated.");
      }
    },
  });
};
