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
        className="inline-flex items-center justify-center rounded-full border border-border bg-secondary px-6 py-3 text-base font-semibold text-secondary-foreground transition-colors hover:bg-muted"
      >
        Go to my dashboard
      </Link>
    );
  }

  return <LoginButton />;
}
