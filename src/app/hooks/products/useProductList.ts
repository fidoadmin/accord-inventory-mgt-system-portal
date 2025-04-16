// hooks/useGetInventories.ts
import { useQuery } from "@tanstack/react-query";
import { fetchProductList } from "@/app/api/products/productList";

export const useProductList = (
  authKey: string,
  params: {
    page?: number;
    limit?: number;
    varcategoryname?: string;
    varsearch?: string;
    varsortby?: string;
    varsortorder?: string;
  }
) => {
  const productQuery = useQuery({
    queryKey: ["products", params],
    queryFn: () =>
      fetchProductList(
        params.page,
        params.limit,
        params.varcategoryname,
        params.varsearch,
        params.varsortby,
        params.varsortorder
      ),
    enabled: !!authKey,
  });

  return productQuery;
};
