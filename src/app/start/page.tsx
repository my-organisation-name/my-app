import type { Metadata } from "next";
import { Onboarding } from "@/components/onboarding/Onboarding";

export const metadata: Metadata = {
  title: "Find your starting point",
};

export default function StartPage() {
  return <Onboarding />;
}
