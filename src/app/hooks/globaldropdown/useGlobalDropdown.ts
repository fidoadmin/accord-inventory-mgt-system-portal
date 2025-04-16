import { fetchDropdownList } from "@/app/api/globaldropdown/globaldropdown";
import { useQuery } from "@tanstack/react-query";

export const useDropdownList = (
  dropdownName: string,
  search?: string,
  Filters: Record<string, any> = {}
) => {
  return useQuery({
    queryKey: ["dropdown", dropdownName, search, Filters],
    queryFn: () => fetchDropdownList(dropdownName, search, Filters),
    enabled: !!dropdownName,
  });
};
