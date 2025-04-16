import { DeleteBranchDetailInterface } from "@/types/BranchInterface";
import { toast } from "react-toastify";
const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const deleteBranchDetails = async (
  data: DeleteBranchDetailInterface
): Promise<Response> => {
  const response = await fetch(`${baseURL}/branches/${data.Id}`, {
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
      `Failed to delete branch(status:${response.status}):${errorText}`
    );
  } else {
    toast.success("Branch Deleted Successfully");
  }

  console.log(response);
  return response;
};
