import { UserDetailInterface } from "@/types/UserInterface";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchUserDetail = async (
  Id: string
): Promise<UserDetailInterface> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }
  const response = await fetch(`${baseURL}/users/${Id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user detail");
  }
  return response.json();
};
