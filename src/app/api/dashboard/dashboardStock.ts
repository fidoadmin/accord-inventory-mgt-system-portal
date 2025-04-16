import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchDashboardStock = async (): Promise<{
  data: any[];
}> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const query = new URLSearchParams({});

  const response = await fetch(
    `${baseURL}/dashboard/stock?${query.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        AuthKey: authKey,
      },
    }
  );

  const data = await response.json();

  return { data };
};
