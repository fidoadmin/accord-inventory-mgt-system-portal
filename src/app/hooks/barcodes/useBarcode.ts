import { barcodes } from "@/app/api/barcodes/route";
import { useMutation } from "@tanstack/react-query";

export const useBarcode = () => {
  return useMutation({
    mutationFn: barcodes,
  });
};
