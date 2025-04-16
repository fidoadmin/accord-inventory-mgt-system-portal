import {
  AddOrUpdateCategoryPayloadInterface,
  AddOrUpdateCategoryResponseInterface,
} from "@/types/CategoryInterface";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const addOrUpdateCategory = async (
  categoryData: AddOrUpdateCategoryPayloadInterface
): Promise<AddOrUpdateCategoryResponseInterface> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const response = await fetch(`${baseURL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    toast.error(errorData.error);
    throw new Error(
      `Failed to update categories (status: ${response.status}): ${errorData}`
    );
  } else {
    toast.success("Category Updated Successfully!");
  }

  return response.json();
};
