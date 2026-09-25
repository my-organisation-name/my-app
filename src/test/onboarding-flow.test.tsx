import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it } from "vitest";
import { MockAuthProvider } from "@/lib/auth/mock-auth-context";
import { Onboarding } from "@/components/onboarding/Onboarding";
import SessionPage from "@/app/(protected)/session/page";
import { readProfile, readSessions } from "@/lib/program/member-store";

beforeEach(() => {
  window.localStorage.clear();
});

it("walks a newcomer from welcome to a free trial on a gentle program", async () => {
  const user = userEvent.setup();
  render(
    <MockAuthProvider>
      <Onboarding />
    </MockAuthProvider>,
  );

  await user.click(screen.getByRole("button", { name: /let's begin/i }));
  await user.click(
    screen.getByRole("button", { name: /none of these apply/i }),
  );
  await user.click(screen.getByLabelText(/new to strength exercise/i));
  await user.click(screen.getByRole("button", { name: /continue/i }));
  await user.click(screen.getByLabelText(/feel stronger all over/i));
  await user.click(screen.getByRole("button", { name: /continue/i }));
  await user.click(screen.getByRole("button", { name: /continue/i }));
  await user.click(screen.getByRole("button", { name: /show my program/i }));

  expect(
    screen.getByRole("heading", { name: "New Start — Full Body" }),
  ).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /free trial/i }));

  expect(readProfile()?.programId).toBe("prog01");
});

it("shows a kind GP note when a health question applies", async () => {
  const user = userEvent.setup();
  render(
    <MockAuthProvider>
      <Onboarding />
    </MockAuthProvider>,
  );

  await user.click(screen.getByRole("button", { name: /let's begin/i }));
  await user.click(screen.getByLabelText(/heart condition/i));

  expect(screen.getByText(/check in with your GP/i)).toBeInTheDocument();
});

it("steps through a session, remembers a swap and records how it felt", async () => {
  window.localStorage.setItem(
    "member_profile_v1",
    JSON.stringify({
      programId: "prog01",
      answers: { equipment: ["chair"] },
      trialStartedAt: new Date().toISOString(),
      swaps: {},
    }),
  );
  const user = userEvent.setup();
  render(<SessionPage />);

  // First exercise in prog01 is Bodyweight Squat, which has an easier option.
  expect(
    screen.getByRole("heading", { name: "Bodyweight Squat" }),
  ).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: /make it easier/i }));
  expect(
    screen.getByRole("heading", { name: "Sit to Stand" }),
  ).toBeInTheDocument();
  expect(readProfile()?.swaps).toEqual({ ex001: "ex021" });

  for (let i = 0; i < 4; i++) {
    await user.click(screen.getByRole("button", { name: /next exercise/i }));
  }
  await user.click(screen.getByRole("button", { name: /finish session/i }));
  await user.click(
    screen.getByRole("button", { name: /challenging but doable/i }),
  );

  expect(screen.getByText(/well done you/i)).toBeInTheDocument();
  expect(readSessions().map((s) => s.feeling)).toEqual(["justRight"]);
});
