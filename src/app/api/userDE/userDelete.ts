import { DeleteUserInterface } from "@/types/UserInterface";
import { toast } from "react-toastify";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const deleteUsers = async (data: DeleteUserInterface): Promise<void> => {
  const response = await fetch(`${baseURL}/users/${data.Id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      AuthKey: data.AuthKey || "",
    },
  });

  if (!response.ok) {
    const errorText = await response.json();
    toast.error(errorText.error);
    throw new Error(
      `Failed to delete user(status:${response.status}):${errorText}`
    );
  }
};
