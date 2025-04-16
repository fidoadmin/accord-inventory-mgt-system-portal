import { DeleteCompanyInterface } from "@/types/CompanyInterface";
import { getCookie } from "cookies-next";

import { toast } from "react-toastify";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const deleteManufacturer = async (
  data: DeleteCompanyInterface
): Promise<void> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const response = await fetch(`${baseURL}/manufacturers/${data.Id}`, {
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
      `Failed to delete manufacturer(status:${response.status}):${errorText}`
    );
  } else {
    toast.success("Manufacturer deleted successfully!");
  }
};
