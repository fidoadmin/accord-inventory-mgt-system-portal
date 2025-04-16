import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const deleteContainer = async (id: string): Promise<void> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const response = await fetch(`${baseURL}/containers/${id}`, {
    method: "DELETE",
    headers: {
      AuthKey: authKey,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete container");
  }
};
