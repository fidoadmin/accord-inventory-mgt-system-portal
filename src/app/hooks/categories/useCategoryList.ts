import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchCategoryList } from "@/app/api/categories/categoryList";

export const useCategoryList = (
  authKey: string,
  params: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    sortBy?: string;
    sortOrder?: string;
    clientid?: string;
  }
) => {
  const categoryQuery = useQuery({
    queryKey: ["categories", params],
    queryFn: () =>
      fetchCategoryList(
        params.page,
        params.limit,
        params.search,
        params.sortBy,
        params.sortOrder,
        params.clientid
      ),
    enabled: !!authKey,
  });

  return categoryQuery;
};
