"use client";

import Header from "./Header";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";
import { LayoutPropsInterface } from "@/types/ComponentInterface";

export default function Layout({ children }: LayoutPropsInterface) {
  const pathname = usePathname();
  const isLoginPage =
    pathname === "/login" ||
    pathname.includes("/forgot-password") ||
    pathname === "/";

  return isLoginPage ? (
    <>{children}</>
  ) : (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-20 md:m-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto overflow-x-hidden mt-4 px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
