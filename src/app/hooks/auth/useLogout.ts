import { useMutation } from "@tanstack/react-query";
import { logout } from "@/app/api/auth/logout";

export const useLogout = () => {
  return useMutation({ mutationFn: logout });
};
