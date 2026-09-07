"use client";

import { useAuth } from "@/lib/auth/mock-auth-context";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-16 py-32 text-center">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        Dashboard
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Signed in as {user?.name} ({user?.email})
      </p>
    </div>
  );
}
