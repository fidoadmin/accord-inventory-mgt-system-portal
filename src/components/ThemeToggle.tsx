"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

import {
  DarkModeRounded,
  LightModeRounded,
  RefreshRounded,
} from "@mui/icons-material";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [darkMode, setDarkMode] = useState(resolvedTheme === "dark");

  useEffect(() => setMounted(true), []);

  if (!mounted)
    return <RefreshRounded fontSize="small" className="mr-10 animate-spin" />;
  console.log();

  return (
    <>
      {/* {mounted ? (
        <div
          className={`mr-10 bg-primary h-6 w-12 rounded-full flex cursor-pointer items-center`}
          onClick={() => {
            setDarkMode(!darkMode);
            setTheme(darkMode ? "light" : "dark");
          }}
        >
          <div
            className={`${
              darkMode ? "bg-accent" : "bg-highlight"
            } h-6 w-6 rounded-full absolute transition-transform duration-300 ease-in-out flex items-center justify-center ${
              darkMode ? "translate-x-6" : "translate-x-0"
            }`}
          >
            {darkMode ? (
              <DarkModeRounded className="w-4 h-4 text-white" />
            ) : (
              <LightModeRounded className="w-4 h-4 text-white" />
            )}
          </div>
        </div>
      ) : (
        <RefreshRounded fontSize="small" className="mr-10 animate-spin" />
      )} */}
    </>
  );

  //   if (resolvedTheme) {
  //     <div>Hello</div>;
  //   }

  //   if (resolvedTheme === "dark") {
  //     return (
  //       <LightModeRounded className="mr-10" onClick={() => setTheme("light")} />
  //     );
  //   }

  //   if (resolvedTheme === "light") {
  //     return (
  //       <DarkModeRounded className="mr-10" onClick={() => setTheme("dark")} />
  //     );
  //   }
}
