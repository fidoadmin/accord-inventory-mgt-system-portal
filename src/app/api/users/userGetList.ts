import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchUserProfile = async (userId: string): Promise<any> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey provided");
  }

  const response = await fetch(`${baseURL}/users/profile/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user profile with ID: ${userId}`);
  }

  const data = await response.json();
  return data;
};
