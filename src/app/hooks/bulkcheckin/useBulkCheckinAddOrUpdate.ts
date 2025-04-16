import { useMutation } from "@tanstack/react-query";
import { addOrUpdateBulkCheckin } from "@/app/api/bulkcheckin/bulkcheckinAddOrUpdate";
import { BulkCheckinInterface } from "@/types/BulkCheckin";


export const useAddOrUpdateBulkCheckin = () => {
  return useMutation<boolean, Error, BulkCheckinInterface>({
    mutationFn: addOrUpdateBulkCheckin,
    onSettled: (data, error) => {
      if (error) {
        console.error("Error during mutation:", error);
      } else {
        console.log("Mutation succeeded:", data);
      }
    },
  });
};
