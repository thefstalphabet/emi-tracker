"use client";

import { useState } from "react";
import {
  BarChart3,
  LogOut,
  PanelRight,
  PanelRightClose,
  LayoutDashboard,
  CreditCard,
  Plus,
  Calculator,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import logo from "../../public/logo.svg";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname, useRouter } from "next/navigation";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "my-emis", label: "My EMIs", icon: CreditCard },
  { id: "add-emi", label: "Add EMI", icon: Plus },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "calculator", label: "Calculator", icon: Calculator },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className={cn(
        "bg-[#F5F6F8] h-screen flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-3.5 border-b border-border">
        <div
          className={`flex items-center justify-between ${
            collapsed && "justify-center"
          }`}
        >
          {!collapsed && <Image src={logo} alt="logo" className="w-8 h-8" />}
          <button onClick={() => setCollapsed(!collapsed)} className="">
            {collapsed ? (
              <PanelRightClose size={16} className="cursor-pointer" />
            ) : (
              <PanelRight size={16} className="cursor-pointer" />
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mt-3">
        <nav className="space-y-2 p-2">
          {menuItems.map((item) => (
            <Tooltip key={item.label}>
              <Link
                // onClick={() => router.replace(item.id)}
                href={item.id}
                className={cn(
                  "flex items-center gap-3 justify-center rounded-lg text-sm transition-colors px-3 py-2",
                  pathname === item.id
                    ? "bg-white text-accent-foreground"
                    : "text-muted-foreground hover:bg-white hover:text-accent-foreground"
                )}
              >
                <TooltipTrigger>
                  <item.icon size={16} className="min-w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.label}</p>
                </TooltipContent>
                {!collapsed && <span className="flex-1">{item.label}</span>}
              </Link>
            </Tooltip>
          ))}
        </nav>
      </div>
      <div
        className={`p-4 flex items-center justify-between ${
          collapsed && "flex-col gap-3 justify-center"
        }`}
      >
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8",
              },
            }}
          />
        </SignedIn>
        <SignOutButton>
          <LogOut className="cursor-pointer" size={16} />
        </SignOutButton>
      </div>
    </div>
  );
}
