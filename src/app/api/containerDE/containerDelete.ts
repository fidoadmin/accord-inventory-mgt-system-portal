import { DeleteContainerDetailInterface } from "@/types/ContainerInterface";
import { toast } from "react-toastify";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const deleteContainerDetails = async (
  data: DeleteContainerDetailInterface
): Promise<void> => {
  const response = await fetch(`${baseURL}/containers/${data.Id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(data.AuthKey ? { AuthKey: data.AuthKey } : {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.json();
    toast.error(errorText.error);
    throw new Error(
      `Failed to delete container (status: ${response.status}): ${errorText}`
    );
  } else {
    toast.success("Container Deleted Successfully");
  }
};
