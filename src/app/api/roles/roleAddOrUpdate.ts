import {
  AddOrUpdateRolePayloadInterface,
  AddOrUpdateRoleResponseInterface,
} from "@/types/RolesInterface";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const addOrUpdateRole = async (
  RoleData: AddOrUpdateRolePayloadInterface
): Promise<AddOrUpdateRoleResponseInterface> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const response = await fetch(`${baseURL}/roles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
    body: JSON.stringify(RoleData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    toast.error(errorData.error);
    throw new Error(
      `Failed to update role (status: ${response.status}): ${errorData}`
    );
  } else {
    toast.success("Role Updated Successfully!");
  }

  return response.json();
};
