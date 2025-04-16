import { fetchInventoryDescriptionDetail } from "@/app/api/inventorydescription/[inventorydescriptiondetail]/route";
import { useQuery } from "@tanstack/react-query";

export const useInventoryDescriptionDetails = (  authKey: string,
  descriptionId: string,
  queryParams?: {

  sortby: string;
  sortorder: "asc" | "desc";
  page?: number;
  limit?: number;
}) => {
  const {  sortby, sortorder, page = 1, limit = 10 } = queryParams?queryParams:{};

  const detailsQuery = useQuery({
    queryKey: ["inventoryDescDetails", descriptionId, sortby, sortorder, page, limit],
    queryFn: async () => {
      if (!authKey) {
        throw new Error("Authentication key is missing.");
      }
      return await fetchInventoryDescriptionDetail(authKey, descriptionId, page, limit, sortby, sortorder);
    },
    enabled: !!authKey && !!descriptionId, 
  });

  return detailsQuery;
};
