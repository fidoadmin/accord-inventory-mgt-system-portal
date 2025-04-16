import { useMutation } from "@tanstack/react-query";
import { addPasswordChangeRequest } from "@/app/api/auth/forgotpassword/addPasswordChangeRequest"

export const useAddChangePasswordRequest = () => {
  return useMutation({
    mutationFn: addPasswordChangeRequest,
  });
};

