"use client";

import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md">
        <SignUp
          signInUrl="/login"
          appearance={
            localStorage.getItem("theme") === "dark"
              ? {
                  baseTheme: dark,
                }
              : {}
          }
        />
      </div>
    </div>
  );
}