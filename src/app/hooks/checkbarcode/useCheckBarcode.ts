import { checkbarcode } from "@/app/api/checkbarcode/route";
import { useMutation } from "@tanstack/react-query";

export const useCheckBarcode = () => {
  return useMutation({
    mutationFn: checkbarcode,
  });
};
