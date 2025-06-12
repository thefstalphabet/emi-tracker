"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <Sun
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="h-[1.6rem] w-[1.6rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <Moon
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="absolute h-[1.6rem] w-[1.6rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
    </>
  );
}
