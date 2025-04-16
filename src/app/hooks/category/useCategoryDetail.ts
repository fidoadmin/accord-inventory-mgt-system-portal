import { fetchCategoryDetail } from "@/app/api/categoryDE/[categorydetail]/route";
import { fetchInventoryDescriptionDetail } from "@/app/api/inventorydescription/[inventorydescriptiondetail]/route";
import { useQuery } from "@tanstack/react-query";

export const useCategoryDetail = (authKey: string, id: string) => {
  const detailsQuery = useQuery({
    queryKey: ["categoryDetails", id],
    queryFn: () => fetchCategoryDetail(id),
    enabled: !!authKey,
  });

  return detailsQuery;
};
