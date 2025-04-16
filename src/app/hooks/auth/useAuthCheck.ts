"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function useAuthCheck() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const authKey = localStorage.getItem("authKey");
    const isLoginPage = pathname === "/login";
    const isPasswordForgot = pathname === "/forgot-password";
    const isPasswordForgotId = pathname.includes("/forgot-password/");

    if (!authKey && !isLoginPage && !isPasswordForgot && !isPasswordForgotId) {
      router.push("/login");
    } else if (authKey && isLoginPage) {
      router.push("/");
    } else if (!authKey && isPasswordForgot) {
      router.push("/forgot-password");
    } else if (!authKey && isPasswordForgotId) {
      router.push(`${pathname}`);
    }
  }, [router, pathname]);
}
