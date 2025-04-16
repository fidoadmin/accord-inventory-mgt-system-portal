import { getCookie } from "cookies-next";

import { ContainerInterface } from "@/types/ContainerInterface";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const addOrUpdateContainer = async (
  containerData: ContainerInterface
): Promise<void> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const response = await fetch(`${baseURL}/containers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
    body: JSON.stringify(containerData),
  });

  if (!response.ok) {
    throw new Error("Failed to add or update container");
  }
};
