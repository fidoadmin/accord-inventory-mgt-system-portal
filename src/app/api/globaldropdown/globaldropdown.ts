import { GlobalDropdown } from "@/types/GlobalDropdown";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchDropdownList = async (
  dropdownName: string,
  varsearch?: string,
  Filters?: any
): Promise<GlobalDropdown[]> => {
  const authKey = getCookie("authKey") as string;

  // Filters = { IsEntryPoint: "true" };

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const query = new URLSearchParams({
    Search: varsearch || "",
  });

  Object.keys(Filters).forEach((key) => {
    query.append(key, Filters[key].toString());
  });

  console.log("Query String:", query.toString());

  const response = await fetch(
    `${baseURL}/dropdownlist/${dropdownName}?${query.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        AuthKey: authKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch dropdown data");
  }

  const data = await response.json();
  return data;
};
