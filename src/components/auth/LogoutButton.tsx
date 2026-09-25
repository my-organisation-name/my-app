"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/mock-auth-context";

export function LogoutButton() {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <button
      type="button"
      onClick={() => {
        logout();
        router.push("/");
        router.refresh();
      }}
      className="rounded-full border border-solid border-border px-5 py-2 text-sm font-medium transition-colors hover:bg-muted"
    >
      Log out
    </button>
  );
}
