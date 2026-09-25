"use client";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { LogoutButton } from "@/components/auth/LogoutButton";
import Link from "next/link";
import { APP_NAME } from "@/components/ui";

function ProtectedHeader() {
  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4">
      <Link href="/dashboard" className="font-bold text-primary">
        {APP_NAME}
      </Link>
      <LogoutButton />
    </header>
  );
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <div className="flex flex-1 flex-col">
        <ProtectedHeader />
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </RequireAuth>
  );
}
