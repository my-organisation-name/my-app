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
      className="inline-flex items-center justify-center rounded-full px-5 py-3 text-base font-semibold text-foreground transition-colors hover:bg-muted"
    >
      Sign in
    </button>
  );
}
