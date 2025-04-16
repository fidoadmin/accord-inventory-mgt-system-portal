import { useMutation } from "@tanstack/react-query";
import { verifyAndUpdatePassword } from "@/app/api/auth/forgotpassword/verifyAndUpdatePassword";
export const useVerifyAndUpdatePassword = () => {
  return useMutation({
    mutationFn: verifyAndUpdatePassword,
  });
};
