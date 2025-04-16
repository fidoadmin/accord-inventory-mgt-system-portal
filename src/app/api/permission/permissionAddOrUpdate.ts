import {
  AddOrUpdatePermissionPayloadInterface,
  AddOrUpdatePermissionResponseInterface,
} from "@/types/Permission";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const addOrUpdatePermission = async (
  PermissionData: AddOrUpdatePermissionPayloadInterface
): Promise<AddOrUpdatePermissionResponseInterface> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const response = await fetch(`${baseURL}/permissions/${PermissionData.Id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
    body: JSON.stringify(PermissionData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`${errorData.error}`);
  }

  return response.json();
};
