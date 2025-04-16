import { useQuery } from "@tanstack/react-query";
import { fetchBarcodeGetDetail } from "@/app/api/barcodelist/barcodeGetList";

export const useBarcodeList = (authKey: string, CheckoutNumber: string) => {
  console.log("CheckoutNumber", CheckoutNumber);
  const detailsQuery = useQuery({
    queryKey: ["checkoutinventoriesforbarcode", CheckoutNumber],
    queryFn: () => fetchBarcodeGetDetail(CheckoutNumber),
    enabled: !!authKey,
  });

  return detailsQuery;
};
