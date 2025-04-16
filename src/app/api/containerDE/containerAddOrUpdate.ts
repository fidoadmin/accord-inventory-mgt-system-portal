import {
  AddOrUpdateContainerPayloadInterface,
  AddOrUpdateContainerResponseInterface,
} from "@/types/ContainerInterface";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

import { toast } from "react-toastify";

export const addOrUpdateContainer = async (
  containerData: AddOrUpdateContainerPayloadInterface
): Promise<AddOrUpdateContainerResponseInterface> => {
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
    const errorText = await response.json();
    toast.error(errorText.error);
    throw new Error(
      `Failed to delete container (status: ${response.status}): ${errorText}`
    );
  } else {
    toast.success("Customer Updated Successfully!");
  }
  return response.json();
};
