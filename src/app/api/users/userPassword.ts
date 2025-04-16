import { UserPasswordInterface } from "@/types/UserInterface";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const addOrUpdateUserPassword = async (
  UserData: UserPasswordInterface
) => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const response = await fetch(`${baseURL}/users/profile/changepassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
    body: JSON.stringify(UserData),
  });

  if (!response.ok) {
    const errorText = await response.json();
    toast.error(errorText.error);
    throw new Error(
      `Failed to change password (status: ${response.status}): ${errorText}`
    );
  } else {
    toast.success("Password Changed Successfully");
  }

  return response;
};
