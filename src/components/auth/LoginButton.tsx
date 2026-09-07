"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/mock-auth-context";

export function LoginButton() {
  const router = useRouter();
  const { loginWithRedirect } = useAuth();

  return (
    <button
      type="button"
      onClick={() => {
        loginWithRedirect();
        router.push("/dashboard");
      }}
      className="flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
    >
      Sign in
    </button>
  );
}
