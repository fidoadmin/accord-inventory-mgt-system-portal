import {
  AddOrUpdateClientPayloadInterface,
  AddOrUpdateClientResponseInterface,
} from "@/types/ClientInterface";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const addOrUpdateClient = async (
  ClientData: AddOrUpdateClientPayloadInterface
): Promise<AddOrUpdateClientResponseInterface> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const response = await fetch(`${baseURL}/clients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
    body: JSON.stringify(ClientData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    toast.error(errorData.error);
    throw new Error(
      `Failed to update client (status: ${response.status}): ${errorData}`
    );
  } else {
    toast.success("Client Updated Successfully!");
  }

  return response.json();
};
