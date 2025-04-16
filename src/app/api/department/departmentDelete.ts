import { toast } from "react-toastify";
import { getCookie } from "cookies-next";
import { DeleteDepartmentInterface } from "@/types/Department";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const deleteDepartment = async (
  data: DeleteDepartmentInterface
): Promise<void> => {
  const authKey = getCookie("authKey") as string;
  if (!authKey) {
    throw new Error("No authKey found");
  }

  const response = await fetch(`${baseURL}/departments/${data.Id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
  });

  if (!response.ok) {
    const errorText = await response.json();
    toast.error(errorText.error);
    throw new Error(
      `Failed to delete department(status:${response.status}):${errorText}`
    );
  } else {
    toast.success("Department Deleted Successfully");
  }
};
