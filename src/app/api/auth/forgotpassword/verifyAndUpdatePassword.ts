import { PasswordUpdateResponse } from "@/types/AuthInterface";
import { toast } from "react-toastify";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const verifyAndUpdatePassword = async (datas: {
  passwordChangeRequestId: string;
  newPassword: string;
}): Promise<PasswordUpdateResponse> => {
  try {
    const response = await fetch(
      `${baseURL}/verifypassword/${datas.passwordChangeRequestId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ NewPassword: datas.newPassword }),
      }
    );

    if (!response.ok) {
      const errorText = await response.json();
      toast.error(errorText.error);
      return { success: false, message: errorText.error };
    }

    toast.success("Password Changed Successfully");
    return { success: true, message: "Password Changed Successfully" };
  } catch (error) {
    toast.error("Something went wrong. Please try again.");
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};
