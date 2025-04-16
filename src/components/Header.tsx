import { LogoutRounded } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useLogout } from "@/app/hooks/auth/useLogout";
import { useEffect, useState, useRef } from "react";
import React from "react";
import Link from "next/link";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

export default function Header() {
  const logoutMutation = useLogout();
  const router = useRouter();
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [EmailAddress, setEmailAddress] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");
    const EmailAddress = localStorage.getItem("EmailAddress");
    const verified = localStorage.getItem("IsVerified") === "true";
    setFirstName(firstName);
    setLastName(lastName);
    setEmailAddress(EmailAddress);
    setIsVerified(verified);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();

      localStorage.removeItem("authKey");
      localStorage.removeItem("userId");
      localStorage.removeItem("firstName");
      localStorage.removeItem("lastName");
      localStorage.removeItem("EmailAddress");
      localStorage.removeItem("ClientName");
      localStorage.removeItem("menuItems");

      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="text-primary w-full px-4 md:px-8 h-20 flex items-center justify-end sticky top-0 z-10 bg-background">
      <div className="relative pr-4">
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 text-text focus:outline-none"
        >
          <AccountCircleRoundedIcon fontSize="large" />
          {firstName && lastName ? (
            <span>
              {firstName} {lastName}
            </span>
          ) : (
            <span>Loading...</span>
          )}
        </button>
        {dropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            <div className="p-4 border-b border-gray-300">
              <h2 className="text-lg font-semibold text-gray-700">
                {firstName} {lastName}
              </h2>
              <p className="text-sm text-gray-500">{EmailAddress || "NA"}</p>
            </div>
            <ul className="py-2">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                {isVerified ? (
                  <Link href="/profile">
                    <span onClick={() => setDropdownOpen(false)}>Profile</span>
                  </Link>
                ) : (
                  <span className="text-gray-400 cursor-not-allowed">
                    Profile
                  </span>
                )}
              </li>
            </ul>
            <div className="border-t border-gray-300">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-error hover:bg-red-200"
              >
                <LogoutRounded className="mr-2" />
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
