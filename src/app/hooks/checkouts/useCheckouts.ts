import { useQuery } from "@tanstack/react-query";
import { fetchCheckouts } from "../../api/checkouts/getcheckouts";

export const useCheckouts = (params: {
  page?: number;
  limit?: number;
  statusguid?: string;
  varsearch?: string;
  sortby?: string;
  sortorder?: string;
  isfromreport?: boolean;
  isfromreturn?: boolean;
  onlycancelled?: boolean;
  onlydispatched?: boolean;
  onlyreturned?: boolean;
  fromdate?: string;
  todate?: string;
  typefilter?: string;
  search?: string;
  clientid?: string;
}) => {
  const checkoutQuery = useQuery({
    queryKey: ["checkouts", params],
    queryFn: () =>
      fetchCheckouts(
        params.page,
        params.limit,
        params.statusguid,
        params.varsearch,
        params.sortby,
        params.sortorder,
        params.isfromreport,
        params.isfromreturn,
        params.onlycancelled,
        params.onlydispatched,
        params.onlyreturned,
        params.fromdate,
        params.todate,
        params.typefilter,
        params.search,
        params.clientid
      ),
  });

  return checkoutQuery;
};
