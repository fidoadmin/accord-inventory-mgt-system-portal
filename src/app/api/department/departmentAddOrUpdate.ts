import {
  AddOrUpdateDepartmentPayloadInterface,
  AddOrUpdateDepartmentResponseInterface,
} from "@/types/Department";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const addOrUpdateDepartment = async (
  RoleData: AddOrUpdateDepartmentPayloadInterface
): Promise<AddOrUpdateDepartmentResponseInterface> => {
  const authKey = getCookie("authKey") as string;
  if (!authKey) {
    throw new Error("No authKey found");
  }

  const response = await fetch(`${baseURL}/departments`, {
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
      `Failed to update department (status: ${response.status}): ${errorData}`
    );
  } else {
    toast.success("Department Updated Successfully!");
  }
  return response.json();
};
