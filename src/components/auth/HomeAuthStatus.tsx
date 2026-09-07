"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/mock-auth-context";
import { LoginButton } from "./LoginButton";

export function HomeAuthStatus() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <div className="h-12" aria-hidden />;
  }

  if (isAuthenticated) {
    return (
      <Link
        href="/dashboard"
        className="flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
      >
        Go to dashboard
      </Link>
    );
  }

  return <LoginButton />;
}
