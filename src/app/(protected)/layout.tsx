"use client";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { useAuth } from "@/lib/auth/mock-auth-context";

function ProtectedHeader() {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-black/[.08] px-8 py-4 dark:border-white/[.145]">
      <span className="text-sm text-zinc-600 dark:text-zinc-400">
        {user?.email}
      </span>
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
