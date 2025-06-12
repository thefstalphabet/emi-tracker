"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X } from "lucide-react";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import logo from "../../public/logo.svg";
import Image from "next/image";

const navItems = [
  {
    url: "/features",
    title: "Features",
  },
  {
    url: "/pricing",
    title: "Pricing",
  },
  {
    url: "/faq",
    title: "FAQ's",
  },
  {
    url: "/about-us",
    title: "About Us",
  },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const pathname = usePathname();

  const authButtons = (
    <SignedOut>
      <Button variant="ghost" asChild>
        <Link href="/login" onClick={() => setIsOpen(false)}>
          Login
        </Link>
      </Button>
      <Button asChild>
        <Link href="signup" onClick={() => setIsOpen(false)}>
          Sign Up
        </Link>
      </Button>
    </SignedOut>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex justify-between h-[4.5rem] px-10">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image src={logo} alt="logo" className="w-12 h-12" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        {!user && (
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => {
              return (
                <Link
                  key={index}
                  href={item.url}
                  className={`text-sm font-medium hover:text-primary transition-colors ${
                    pathname == item.url && "text-primary"
                  }`}
                >
                  {item.title}
                </Link>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-5">
          <ThemeToggle />
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            >
              <UserButton.MenuItems>
                {/* <UserButton.Link
                  label="Payments"
                  labelIcon={<CreditCard className="mr-2 h-4 w-4" />}
                  href="/payments"
                /> */}
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
          <div className="hidden md:flex items-center space-x-2">
            {authButtons}
          </div>

          {/* Mobile menu button */}
          {!user && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="space-y-4 px-10 py-4">
            {navItems.map((item, index) => {
              return (
                <Link
                  key={index}
                  href={item.url}
                  onClick={() => setIsOpen(false)}
                  className={`block text-sm font-medium hover:text-primary transition-colors ${
                    pathname == item.url && "text-primary"
                  }`}
                >
                  {item.title}
                </Link>
              );
            })}
            <div className="flex flex-col space-y-2 pt-4 border-t">
              {authButtons}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
