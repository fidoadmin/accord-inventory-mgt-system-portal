import { useMutation } from "@tanstack/react-query";
import { login } from "@/app/api/auth/login";

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
  });
};
