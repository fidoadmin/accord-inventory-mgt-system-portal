import { UpdateReturnInterface } from "@/types/CheckoutInterface";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const ReturnCheckoutList = async (params: UpdateReturnInterface) => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const response = await fetch(`${baseURL}/return/individual`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      origin: "http://localhost:3000",
      AuthKey: authKey,
    },
    body: JSON.stringify(params.items),
  });

  if (!response.ok) {
    const errorData = await response.json();
    toast.error(errorData.error);
    throw new Error(
      `Failed to update user (status: ${response.status}): ${errorData}`
    );
  } else {
    toast.success("Return Successfully!");
  }

  return response.json();
};
