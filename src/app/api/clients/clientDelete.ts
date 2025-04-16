import { DeleteClientInterface } from "@/types/ClientInterface";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const deleteClient = async (
  data: DeleteClientInterface
): Promise<void> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }
  const response = await fetch(`${baseURL}/clients/${data.Id}`, {
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
      `Failed to delete client(status:${response.status}):${errorText}`
    );
  } else {
    toast.success("Client deleted successfully!");
  }
};
