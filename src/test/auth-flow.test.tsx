import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it } from "vitest";
import { MockAuthProvider } from "@/lib/auth/mock-auth-context";
import Home from "@/app/page";

beforeEach(() => {
  window.localStorage.clear();
});

it("clicking sign in reveals a link to the dashboard", async () => {
  const user = userEvent.setup();

  render(
    <MockAuthProvider>
      <Home />
    </MockAuthProvider>,
  );

  await user.click(await screen.findByRole("button", { name: /sign in/i }));

  expect(
    await screen.findByRole("link", { name: /dashboard/i }),
  ).toBeInTheDocument();
});
